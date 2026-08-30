import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { EXCLUDED_CATEGORY_HANDLES } from "@lib/util/excluded-categories"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CategoryPills from "@modules/store/components/category-pills"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
  q,
  category,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
  q?: string
  category?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const allCategories = await listCategories({
    fields: "id,handle,name,*category_children,*parent_category",
  })
  const visibleCategories = allCategories.filter(
    (c) => !EXCLUDED_CATEGORY_HANDLES.includes(c.handle ?? "")
  )
  // Tier 1 of the category pills is top-level categories only — a category
  // with children (e.g. "Skincare") is never itself a directly-browsable
  // pill target, it's an organizational grouping around its children.
  const topLevelCategories = visibleCategories.filter((c) => !c.parent_category)

  // The selected category id can be either a top-level category or one of
  // its children. Resolve it against the full (flattened) set so a parent
  // selection expands to all of its children's ids — Medusa's category_id
  // filter doesn't cascade to children on its own.
  const flattenedCategories = visibleCategories.flatMap((c) => [
    c,
    ...(c.category_children ?? []),
  ])
  const selectedCategory = flattenedCategories.find((c) => c.id === category)
  const categoryIds = selectedCategory
    ? selectedCategory.category_children?.length
      ? selectedCategory.category_children.map((child) => child.id)
      : [selectedCategory.id]
    : undefined

  return (
    <div
      className="flex flex-col small:flex-row small:items-start pt-0 pb-3 small:py-6 content-container"
      data-testid="category-container"
    >
      <div className="hidden small:block">
        <RefinementList sortBy={sort} />
      </div>
      <div className="w-full">
        <div className="small:hidden sticky top-12 z-30 -mx-6 border-b border-gray-200 bg-white px-6 py-2 shadow-md">
          <CategoryPills categories={topLevelCategories} />
        </div>
        <div className="pt-3">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
              q={q}
              categoryIds={categoryIds}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
