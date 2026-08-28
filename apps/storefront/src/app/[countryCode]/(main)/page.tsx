import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import { listProducts, listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { EXCLUDED_CATEGORY_HANDLES } from "@lib/util/excluded-categories"
import Hero from "@modules/home/components/hero"
import ProductRow from "@modules/home/components/product-row"
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

  const [{ response: newArrivals }, allCategories] = await Promise.all([
    listProductsWithSort({
      page: 1,
      queryParams: { limit: 8 },
      sortBy: "created_at",
      countryCode,
    }),
    listCategories({ fields: "id,handle,name,*category_children" }),
  ])

  // Only categories that actually hold products directly (no children of
  // their own) become their own curated row — the "Skincare" umbrella
  // category is a pure parent and would otherwise duplicate its children.
  const leafCategories = allCategories.filter(
    (c) =>
      !EXCLUDED_CATEGORY_HANDLES.includes(c.handle ?? "") &&
      !c.category_children?.length
  )

  const categoryRows = await Promise.all(
    leafCategories.map(async (category) => {
      const { response } = await listProducts({
        queryParams: { category_id: [category.id], limit: 6 },
        countryCode,
      })
      return { category, products: response.products }
    })
  )

  return (
    <>
      <Hero />
      <div className="content-container py-12">
        <div className="mb-10">
          <CategoryScroller />
        </div>
        <ProductRow
          title={t("newArrivals")}
          seeAllHref="/store"
          products={newArrivals.products}
          region={region}
        />
        {categoryRows.map(({ category, products }) => (
          <ProductRow
            key={category.id}
            title={category.name}
            seeAllHref={`/store?category=${category.id}`}
            products={products}
            region={region}
          />
        ))}
      </div>
    </>
  )
}
