import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  updateProductsWorkflow,
  updateProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows"

// Placeholder demo photos — Pexels stock photos, individually hand-picked
// and visually verified one at a time (not by keyword/tag matching). Not
// real product photography — this is throwaway local demo data, same as
// the rest of the seed scripts, but at least topically appropriate and
// confirmed free of any visible branding/watermarks.
//
// A keyword-tag-based approach (LoremFlickr) was tried before this and
// reverted: automated matching against an unmoderated photo pool returned
// wrong and in some cases inappropriate results (a virus illustration for
// "serum", a competitor's vintage branded ad for "cleanser", food photos
// for "cream"), plus watermarks. A second round of manually-searched
// candidates also turned up real competitor-branded products (Cos De BAHA,
// Dr. Jart+, innisfree, Tommy Hilfiger) that had to be rejected on sight.
// Every URL below was downloaded and looked at before being used.
const PRODUCT_IMAGE_URLS: Record<string, string> = {
  "hydrating-serum":
    "https://images.pexels.com/photos/35899861/pexels-photo-35899861.jpeg?cs=srgb&dl=pexels-mir-fialkova-2156588206-35899861.jpg&fm=jpg&w=800&h=800&fit=crop",
  "vitamin-c-brightening-serum":
    "https://images.pexels.com/photos/8054400/pexels-photo-8054400.jpeg?cs=srgb&dl=pexels-kseniachernaya-8054400.jpg&fm=jpg&w=800&h=800&fit=crop",
  "retinol-renewal-serum":
    "https://images.pexels.com/photos/35899861/pexels-photo-35899861.jpeg?cs=srgb&dl=pexels-mir-fialkova-2156588206-35899861.jpg&fm=jpg&w=800&h=800&fit=crop",
  "gentle-cleanser":
    "https://images.pexels.com/photos/19049367/pexels-photo-19049367.png?cs=srgb&dl=pexels-volkerthimm-19049367.jpg&fm=jpg&w=800&h=800&fit=crop",
  "foaming-cleanser":
    "https://images.pexels.com/photos/6690232/pexels-photo-6690232.jpeg?cs=srgb&dl=pexels-tara-winstead-6690232.jpg&fm=jpg&w=800&h=800&fit=crop",
  "micellar-water":
    "https://images.pexels.com/photos/8054400/pexels-photo-8054400.jpeg?cs=srgb&dl=pexels-kseniachernaya-8054400.jpg&fm=jpg&w=800&h=800&fit=crop",
  "daily-moisture-cream":
    "https://images.pexels.com/photos/6690232/pexels-photo-6690232.jpeg?cs=srgb&dl=pexels-tara-winstead-6690232.jpg&fm=jpg&w=800&h=800&fit=crop",
  "night-repair-cream":
    "https://images.pexels.com/photos/8789618/pexels-photo-8789618.jpeg?cs=srgb&dl=pexels-darina-belonogova-8789618.jpg&fm=jpg&w=800&h=800&fit=crop",
  "led-facial-device":
    "https://images.pexels.com/photos/7216285/pexels-photo-7216285.jpeg?cs=srgb&dl=pexels-dinc-tapa-691009-7216285.jpg&fm=jpg&w=800&h=800&fit=crop",
  "jade-facial-roller":
    "https://images.pexels.com/photos/4938455/pexels-photo-4938455.jpeg?cs=srgb&dl=pexels-karola-g-4938455.jpg&fm=jpg&w=800&h=800&fit=crop",
  "skincare-starter-kit":
    "https://images.pexels.com/photos/6690232/pexels-photo-6690232.jpeg?cs=srgb&dl=pexels-tara-winstead-6690232.jpg&fm=jpg&w=800&h=800&fit=crop",
  "radiance-gift-box":
    "https://images.pexels.com/photos/8014845/pexels-photo-8014845.jpeg?cs=srgb&dl=pexels-cup-of-couple-8014845.jpg&fm=jpg&w=800&h=800&fit=crop",
}

const CATEGORY_IMAGE_URLS: Record<string, string> = {
  Skincare:
    "https://images.pexels.com/photos/6690232/pexels-photo-6690232.jpeg?cs=srgb&dl=pexels-tara-winstead-6690232.jpg&fm=jpg&w=800&h=800&fit=crop",
  Cleansers:
    "https://images.pexels.com/photos/19049367/pexels-photo-19049367.png?cs=srgb&dl=pexels-volkerthimm-19049367.jpg&fm=jpg&w=800&h=800&fit=crop",
  Serums:
    "https://images.pexels.com/photos/35899861/pexels-photo-35899861.jpeg?cs=srgb&dl=pexels-mir-fialkova-2156588206-35899861.jpg&fm=jpg&w=800&h=800&fit=crop",
  Moisturizers:
    "https://images.pexels.com/photos/8789618/pexels-photo-8789618.jpeg?cs=srgb&dl=pexels-darina-belonogova-8789618.jpg&fm=jpg&w=800&h=800&fit=crop",
  "Devices & Tools":
    "https://images.pexels.com/photos/7216285/pexels-photo-7216285.jpeg?cs=srgb&dl=pexels-dinc-tapa-691009-7216285.jpg&fm=jpg&w=800&h=800&fit=crop",
  "Gift Sets":
    "https://images.pexels.com/photos/8014845/pexels-photo-8014845.jpeg?cs=srgb&dl=pexels-cup-of-couple-8014845.jpg&fm=jpg&w=800&h=800&fit=crop",
}

export default async function seed_product_images({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Seeding product and category placeholder photos...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })

  const productUpdates = products
    .filter((p) => p.handle && PRODUCT_IMAGE_URLS[p.handle])
    .map((p) => {
      const url = PRODUCT_IMAGE_URLS[p.handle!]
      return {
        id: p.id,
        thumbnail: url,
        images: [{ url }],
      }
    })

  if (productUpdates.length) {
    await updateProductsWorkflow(container).run({
      input: { products: productUpdates },
    })
  }
  logger.info(`Updated photos for ${productUpdates.length} products.`)

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })

  let categoryCount = 0
  for (const category of categories) {
    const url = CATEGORY_IMAGE_URLS[category.name]
    if (!url) {
      continue
    }

    await updateProductCategoriesWorkflow(container).run({
      input: {
        selector: { id: category.id },
        update: { metadata: { thumbnail: url } },
      },
    })
    categoryCount++
  }
  logger.info(`Updated photos for ${categoryCount} categories.`)

  logger.info("Finished seeding placeholder photos.")
}
