import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function inspect_fulfillment({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: [
      "id",
      "name",
      "type",
      "service_zones.id",
      "service_zones.name",
      "service_zones.geo_zones.*",
    ],
  })

  logger.info(`Fulfillment sets: ${JSON.stringify(fulfillmentSets, null, 2)}`)

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: [
      "id",
      "name",
      "service_zone_id",
      "shipping_profile_id",
      "provider_id",
      "price_type",
    ],
  })

  logger.info(`Shipping options: ${JSON.stringify(shippingOptions, null, 2)}`)

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name", "type"],
  })

  logger.info(`Shipping profiles: ${JSON.stringify(shippingProfiles, null, 2)}`)

  const { data: fulfillmentProviders } = await query.graph({
    entity: "fulfillment_provider",
    fields: ["id", "is_enabled"],
  })

  logger.info(
    `Fulfillment providers: ${JSON.stringify(fulfillmentProviders, null, 2)}`
  )
}
