import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seed_israel_region({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
  })

  if (existingRegions.some((r) => r.name === "Israel")) {
    logger.info("Israel region already exists, skipping.")
    return
  }

  logger.info("Creating Israel region...")

  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Israel",
          currency_code: "ils",
          countries: ["il"],
        },
      ],
    },
  })
  const israelRegion = regions[0]

  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name"],
  })
  const fulfillmentSet = fulfillmentSets[0]

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]

  logger.info("Creating Israel service zone...")

  const { result: serviceZones } = await createServiceZonesWorkflow(
    container
  ).run({
    input: {
      data: [
        {
          name: "Israel",
          fulfillment_set_id: fulfillmentSet.id,
          geo_zones: [{ type: "country", country_code: "il" }],
        },
      ],
    },
  })
  const israelZone = serviceZones[0]

  logger.info("Creating Israel shipping option...")

  // Placeholder shipping price — adjust in the admin dashboard once real
  // rates are known.
  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        service_zone_id: israelZone.id,
        shipping_profile_id: shippingProfile.id,
        provider_id: "manual_manual",
        type: {
          label: "Standard",
          description: "Standard shipping within Israel",
          code: "standard",
        },
        price_type: "flat",
        prices: [{ amount: 25, currency_code: "ils" }],
      },
    ],
  })

  logger.info(
    `Finished seeding Israel region (${israelRegion.id}) with shipping.`
  )
}
