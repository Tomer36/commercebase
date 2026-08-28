import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function seed_cosmetics_demo_2({
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

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const categoryByName = (name: string) => {
    const category = categories.find((c) => c.name === name)
    if (!category) {
      throw new Error(`Category not found: ${name}`)
    }
    return category
  }
  const serums = categoryByName("Serums")
  const cleansers = categoryByName("Cleansers")
  const moisturizers = categoryByName("Moisturizers")
  const devices = categoryByName("Devices & Tools")
  const giftSets = categoryByName("Gift Sets")

  const { data: options } = await query.graph({
    entity: "product_option",
    fields: ["id", "title"],
  })
  const volumeOption = options.find((o) => o.title === "Volume")!
  const formatOption = options.find((o) => o.title === "Format")!

  logger.info("Seeding additional cosmetics demo products...")

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Vitamin C Brightening Serum",
          category_ids: [serums.id],
          description:
            "Placeholder test product - antioxidant serum that targets dullness and uneven tone.",
          handle: "vitamin-c-brightening-serum",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: volumeOption.id }],
          variants: [
            {
              title: "30ml",
              sku: "VITC-SERUM-30ML",
              options: { Volume: "30ml" },
              prices: [
                { amount: 52, currency_code: "eur" },
                { amount: 58, currency_code: "usd" },
              ],
            },
            {
              title: "50ml",
              sku: "VITC-SERUM-50ML",
              options: { Volume: "50ml" },
              prices: [
                { amount: 72, currency_code: "eur" },
                { amount: 80, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Retinol Renewal Serum",
          category_ids: [serums.id],
          description:
            "Placeholder test product - nightly retinol serum for texture and fine lines.",
          handle: "retinol-renewal-serum",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: volumeOption.id }],
          variants: [
            {
              title: "30ml",
              sku: "RETINOL-SERUM-30ML",
              options: { Volume: "30ml" },
              prices: [
                { amount: 58, currency_code: "eur" },
                { amount: 64, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Foaming Cleanser",
          category_ids: [cleansers.id],
          description:
            "Placeholder test product - foaming daily cleanser for normal to oily skin.",
          handle: "foaming-cleanser",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Standard",
              sku: "FOAM-CLEANSER-STANDARD",
              options: { Format: "Standard" },
              prices: [
                { amount: 24, currency_code: "eur" },
                { amount: 27, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Micellar Water",
          category_ids: [cleansers.id],
          description:
            "Placeholder test product - no-rinse micellar water for makeup removal.",
          handle: "micellar-water",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Standard",
              sku: "MICELLAR-WATER-STANDARD",
              options: { Format: "Standard" },
              prices: [
                { amount: 18, currency_code: "eur" },
                { amount: 20, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Daily Moisture Cream",
          category_ids: [moisturizers.id],
          description:
            "Placeholder test product - lightweight daily moisturizer for all skin types.",
          handle: "daily-moisture-cream",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: volumeOption.id }],
          variants: [
            {
              title: "30ml",
              sku: "MOISTURE-CREAM-30ML",
              options: { Volume: "30ml" },
              prices: [
                { amount: 38, currency_code: "eur" },
                { amount: 42, currency_code: "usd" },
              ],
            },
            {
              title: "50ml",
              sku: "MOISTURE-CREAM-50ML",
              options: { Volume: "50ml" },
              prices: [
                { amount: 54, currency_code: "eur" },
                { amount: 60, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Night Repair Cream",
          category_ids: [moisturizers.id],
          description:
            "Placeholder test product - richer overnight cream for dry skin.",
          handle: "night-repair-cream",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Standard",
              sku: "NIGHT-CREAM-STANDARD",
              options: { Format: "Standard" },
              prices: [
                { amount: 46, currency_code: "eur" },
                { amount: 51, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "LED Facial Device",
          category_ids: [devices.id],
          description:
            "Placeholder test product - at-home LED light therapy device.",
          handle: "led-facial-device",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Standard",
              sku: "LED-DEVICE-STANDARD",
              options: { Format: "Standard" },
              prices: [
                { amount: 220, currency_code: "eur" },
                { amount: 245, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Jade Facial Roller",
          category_ids: [devices.id],
          description:
            "Placeholder test product - jade roller for lymphatic massage.",
          handle: "jade-facial-roller",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Standard",
              sku: "JADE-ROLLER-STANDARD",
              options: { Format: "Standard" },
              prices: [
                { amount: 32, currency_code: "eur" },
                { amount: 36, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Skincare Starter Kit",
          category_ids: [giftSets.id],
          description:
            "Placeholder test product - a curated set of cleanser, serum, and moisturizer.",
          handle: "skincare-starter-kit",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Standard",
              sku: "STARTER-KIT-STANDARD",
              options: { Format: "Standard" },
              prices: [
                { amount: 85, currency_code: "eur" },
                { amount: 95, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Radiance Gift Box",
          category_ids: [giftSets.id],
          description:
            "Placeholder test product - gift box featuring the brightening serum and moisturizer.",
          handle: "radiance-gift-box",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [{ id: formatOption.id }],
          variants: [
            {
              title: "Standard",
              sku: "RADIANCE-GIFTBOX-STANDARD",
              options: { Format: "Standard" },
              prices: [
                { amount: 110, currency_code: "eur" },
                { amount: 122, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  })

  logger.info("Finished seeding additional cosmetics demo data.")
}
