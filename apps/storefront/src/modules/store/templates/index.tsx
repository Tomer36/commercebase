import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { EXCLUDED_CATEGORY_HANDLES } from "@lib/util/excluded-categories"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CategoryPills from "@modules/store/components/category-pills"
import ProductSearch from "@modules/store/components/product-search"
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

  const allCategories = await listCategories({ fields: "id,handle,name" })
  const categories = allCategories.filter(
    (c) => !EXCLUDED_CATEGORY_HANDLES.includes(c.handle ?? "")
  )

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <div className="hidden small:block">
        <RefinementList sortBy={sort} />
      </div>
      <div className="w-full">
        <div className="small:hidden sticky top-16 z-30 bg-white py-3 flex flex-col gap-4">
          <ProductSearch />
          <CategoryPills categories={categories} />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            optionValueIds={optionValueIds}
            q={q}
            categoryId={category}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
