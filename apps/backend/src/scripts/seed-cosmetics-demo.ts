import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import {
  createProductOptionsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seed_cosmetics_demo({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const defaultSalesChannel = salesChannels[0]

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const cleansersCategory = existingCategories.find((c) => c.name === "Cleansers")!
  const serumsCategory = existingCategories.find((c) => c.name === "Serums")!

  logger.info("Seeding cosmetics test products...")

  const { result: volumeOptions } = await createProductOptionsWorkflow(container).run({
    input: {
      product_options: [{ title: "Volume", values: ["30ml", "50ml"] }],
    },
  })
  const volumeOption = volumeOptions[0]

  const { result: formatOptions } = await createProductOptionsWorkflow(container).run({
    input: {
      product_options: [{ title: "Format", values: ["Standard"] }],
    },
  })
  const formatOption = formatOptions[0]

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Hydrating Serum",
          category_ids: [serumsCategory.id],
          description:
            "Placeholder test product - lightweight hydrating serum with hyaluronic acid.",
          handle: "hydrating-serum",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: volumeOption.id }],
          variants: [
            {
              title: "30ml",
              sku: "SERUM-30ML",
              options: { Volume: "30ml" },
              prices: [
                { amount: 45, currency_code: "eur" },
                { amount: 50, currency_code: "usd" },
              ],
            },
            {
              title: "50ml",
              sku: "SERUM-50ML",
              options: { Volume: "50ml" },
              prices: [
                { amount: 65, currency_code: "eur" },
                { amount: 72, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Gentle Cleanser",
          category_ids: [cleansersCategory.id],
          description:
            "Placeholder test product - gentle daily facial cleanser for sensitive skin.",
          handle: "gentle-cleanser",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Standard",
              sku: "CLEANSER-STANDARD",
              options: { Format: "Standard" },
              prices: [
                { amount: 28, currency_code: "eur" },
                { amount: 32, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  })

  logger.info("Finished seeding cosmetics demo data.")
}
