"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const CategoryPills = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
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

  if (!categories.length) {
    return null
  }

  return (
    <div
      className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1"
      data-testid="category-pills"
    >
      <button
        type="button"
        onClick={() => selectCategory(null)}
        className={clx(
          "h-9 shrink-0 rounded-full px-4 text-sm transition-colors",
          !selectedCategoryId
            ? "bg-accent text-accent-foreground"
            : "bg-accent-soft text-black"
        )}
        data-testid="category-pill-all"
      >
        {t("allCategories")}
      </button>
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => selectCategory(category.id ?? null)}
            className={clx(
              "h-9 shrink-0 rounded-full px-4 text-sm transition-colors duration-200 ease-out active:scale-95",
              isSelected
                ? "bg-accent text-accent-foreground"
                : "bg-accent-soft text-black"
            )}
            data-testid="category-pill"
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryPills
