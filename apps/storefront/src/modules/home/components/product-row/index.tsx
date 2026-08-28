import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { getTranslations } from "next-intl/server"

/**
 * A curated horizontal-scroll row of products with a heading and a "see
 * all" link — used to break the home page up into distinct sections
 * (New Arrivals, one row per real category) instead of a single flat grid.
 */
const ProductRow = async ({
  title,
  seeAllHref,
  products,
  region,
}: {
  title: string
  seeAllHref: string
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}) => {
  if (!products.length) {
    return null
  }

  const t = await getTranslations("Home")

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl-semi text-black">{title}</h2>
        <LocalizedClientLink
          href={seeAllHref}
          className="text-small-regular text-accent transition-opacity hover:opacity-70"
        >
          {t("seeAll")}
        </LocalizedClientLink>
      </div>
      <ul className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
        {products.map((product) => (
          <li key={product.id} className="w-[45%] shrink-0 small:w-[220px]">
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductRow
