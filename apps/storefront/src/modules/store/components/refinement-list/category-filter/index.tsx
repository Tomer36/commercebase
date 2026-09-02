"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import { CATEGORY_ICONS } from "@modules/store/utils/category-icons"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type CategoryFilterProps = {
  categories: HttpTypes.StoreProductCategory[]
}

// Desktop equivalent of the mobile Store page's CategoryPills — same
// underlying category data, same tier 1/tier 2 relationship, and the same
// accent-soft-fill-on-select visual language (no separate checkmark/radio
// dot — the fill itself is the selection state), but expressed as a
// sidebar list rather than horizontal tabs. Sidebar filters on desktop +
// tabs on mobile for the same filter is a standard responsive split
// (Amazon, Zara, etc.), not a mismatch to paper over.
const rowClassName = (isSelected: boolean) =>
  clx(
    "flex w-full items-center gap-2 rounded-large px-3 py-2.5 text-base-regular text-start transition-colors duration-150",
    isSelected
      ? "bg-accent-soft text-accent font-semibold"
      : "text-gray-600 hover:bg-gray-50 hover:text-black"
  )

const childRowClassName = (isSelected: boolean) =>
  clx(
    "flex w-full items-center rounded-full px-3 py-1.5 text-small-regular text-start transition-colors duration-150",
    isSelected
      ? "bg-accent-soft text-accent font-semibold"
      : "text-gray-600 hover:bg-gray-50 hover:text-black"
  )

const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const t = useTranslations("Store")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedCategoryId = searchParams.get("category")

  const selectCategory = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (categoryId) {
      params.set("category", categoryId)
    } else {
      params.delete("category")
    }

    params.delete("page")

    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }

  const selectedTopLevel = categories.find(
    (top) =>
      top.id === selectedCategoryId ||
      top.category_children?.some((child) => child.id === selectedCategoryId)
  )

  if (!categories.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="px-3 text-base-semi text-black">{t("categories")}</span>
      <ul className="flex flex-col gap-y-1" data-testid="category-filter">
        <li>
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className={rowClassName(!selectedCategoryId)}
            data-testid="category-filter-all"
          >
            {t("allCategories")}
          </button>
        </li>
        {categories.map((category) => {
          const isSelected = selectedTopLevel?.id === category.id
          const Icon = CATEGORY_ICONS[category.handle ?? ""]

          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => selectCategory(category.id ?? null)}
                className={rowClassName(isSelected)}
                data-testid="category-filter-item"
              >
                {Icon && <Icon width={18} height={18} />}
                {category.name}
              </button>
              {isSelected && !!category.category_children?.length && (
                <ul className="animate-fade-in-top mt-1 flex flex-col gap-y-1 ps-4">
                  {category.category_children.map((child) => {
                    const isChildSelected = selectedCategoryId === child.id

                    return (
                      <li key={child.id}>
                        <button
                          type="button"
                          onClick={() => selectCategory(child.id ?? null)}
                          className={childRowClassName(isChildSelected)}
                          data-testid="category-filter-subitem"
                        >
                          {child.name}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CategoryFilter
