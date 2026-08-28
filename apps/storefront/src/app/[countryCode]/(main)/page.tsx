import { Metadata } from "next"

import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import Hero from "@modules/home/components/hero"
import ProductPreview from "@modules/products/components/product-preview"
import CategoryScroller from "@modules/store/components/category-scroller"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Home")
  const tCommon = await getTranslations("Common")
  return {
    title: tCommon("storeName"),
    description: t("metaDescription"),
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const t = await getTranslations("Home")

  const {
    response: { products },
  } = await listProductsWithSort({
    page: 1,
    queryParams: { limit: 8 },
    sortBy: "created_at",
    countryCode,
  })

  return (
    <>
      <Hero />
      <div className="content-container py-12">
        <div className="mb-8">
          <CategoryScroller />
        </div>
        {products.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl-semi text-black">
                {t("newArrivals")}
              </h2>
            </div>
            <ul
              className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
              data-testid="home-products-list"
            >
              {products.map((product) => (
                <li key={product.id}>
                  <ProductPreview product={product} region={region} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
