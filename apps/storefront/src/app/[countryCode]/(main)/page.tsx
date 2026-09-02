import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import { listProducts, listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { EXCLUDED_CATEGORY_HANDLES } from "@lib/util/excluded-categories"
import CategoryTiles from "@modules/home/components/category-tiles"
import Hero from "@modules/home/components/hero"
import ProductRow from "@modules/home/components/product-row"
import TrustBadges from "@modules/common/components/trust-badges"
import { Heading } from "@modules/common/components/ui"
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

  const [{ response: newArrivals }, allCategories] = await Promise.all([
    listProductsWithSort({
      page: 1,
      queryParams: { limit: 8 },
      sortBy: "created_at",
      countryCode,
    }),
    listCategories({ fields: "id,handle,name,*category_children,*parent_category" }),
  ])

  const visibleCategories = allCategories.filter(
    (c) => !EXCLUDED_CATEGORY_HANDLES.includes(c.handle ?? "")
  )

  // Top-level categories only for the homepage — these are the primary
  // browsable entry points, matching the same convention already used by
  // the store sidebar/mobile category pills.
  const topLevelCategories = visibleCategories.filter((c) => !c.parent_category)

  // A real product thumbnail per category (not a fabricated category-level
  // image) — there's no category photography, so each chip previews one of
  // its actual products. A pure umbrella category (e.g. "Skincare") holds
  // no products directly, so its preview is searched across its children.
  const categoryPreviews = await Promise.all(
    topLevelCategories.map(async (category) => {
      const searchIds = [
        category.id,
        ...(category.category_children?.map((child) => child.id) ?? []),
      ]
      const { response } = await listProducts({
        queryParams: { category_id: searchIds, limit: 1 },
        countryCode,
      })
      return { category, thumbnail: response.products[0]?.thumbnail ?? null }
    })
  )

  return (
    <>
      <Hero heroImage={newArrivals.products[0]?.thumbnail} />

      <div className="content-container py-6">
        <TrustBadges />
      </div>

      {!!categoryPreviews.length && (
        <div className="content-container pb-12">
          <Heading level="h2" className="text-xl-semi text-black mb-6">
            {t("shopByCategory")}
          </Heading>
          <CategoryTiles items={categoryPreviews} />
        </div>
      )}

      <div className="content-container py-12">
        <ProductRow
          title={t("newArrivals")}
          seeAllHref="/store"
          products={newArrivals.products}
          region={region}
        />
      </div>
    </>
  )
}
