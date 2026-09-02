"use client"

import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import ProductSearch from "@modules/store/components/product-search"
import { CATEGORY_ICONS } from "@modules/store/utils/category-icons"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLayoutEffect, useRef, useState } from "react"

// Fades both edges of a horizontally-scrollable row instead of hard-cutting
// whatever tab happens to sit at the boundary — direction-agnostic, so it
// works the same in RTL and LTR without extra logic. A small FIXED pixel
// strip (not a percentage) so it only touches the last sliver of a tab
// that's actually being cut off, not a chunk of whatever tab happens to
// sit near the edge.
const scrollFadeClassName =
  "[mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)]"

// The active tab gets a solid accent-soft "chip" fill instead of a thin
// underline — a stronger, warmer selected state that reads at a glance and
// gives the row actual color instead of flat gray text. Fixed height +
// centered content means every tab (icon+label, or label-only like "All")
// sits identically regardless of what's inside it.
const tierOneTabClassName = (isSelected: boolean) =>
  clx(
    "flex h-12 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-1.5 text-small-regular transition-colors duration-200 ease-out active:scale-95",
    isSelected
      ? "bg-accent-soft text-accent font-semibold"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
  )

// Material Design's "secondary tabs" pattern: same chip language as Tier 1,
// just smaller and lighter, sitting flush beneath it. Position + shared
// styling *is* the parent/child cue — no separate box or caption needed.
const tierTwoTabClassName = (isSelected: boolean) =>
  clx(
    "inline-flex h-8 shrink-0 items-center rounded-full px-3 text-small-regular transition-colors duration-200 ease-out active:scale-95",
    isSelected
      ? "bg-accent-soft text-accent font-semibold"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
  )

// Top-level categories are Tier 1. A top-level category with children (e.g.
// "Skincare") is an organizational grouping, never a product-bearing category
// itself — selecting it reveals its children as a Tier 2 row underneath and
// filters the grid to all of them combined (resolved server-side in
// store/templates/index.tsx). A flat top-level category (e.g. "Gift Sets")
// has no Tier 2 row and filters directly.
const CategoryPills = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) => {
  const t = useTranslations("Store")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tierOneRowRef = useRef<HTMLDivElement>(null)
  const tierTwoRowRef = useRef<HTMLDivElement>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const selectedCategoryId = searchParams.get("category")
  // A query in the URL (e.g. a shared link) should show the input even
  // before the user has tapped the search icon this visit.
  const hasQuery = !!searchParams.get("q")
  const showSearch = isSearchOpen || hasQuery

  const closeSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    params.delete("page")
    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
    setIsSearchOpen(false)
  }

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

  // Which Tier 1 category (if any) the current selection belongs to — either
  // the selection IS this top-level category, or it's one of its children.
  const selectedTopLevel = categories.find(
    (top) =>
      top.id === selectedCategoryId ||
      top.category_children?.some((child) => child.id === selectedCategoryId)
  )

  const selectedTopLevelId = selectedTopLevel?.id

  // Bring the selected tab fully into view when it's chosen — otherwise a
  // tab near the scrollable edge stays half-cut-off after being tapped.
  // `block: "nearest"` keeps this from also scrolling the page vertically.
  useLayoutEffect(() => {
    const container = tierOneRowRef.current
    const button = container?.querySelector<HTMLButtonElement>(
      `[data-pill-id="${selectedTopLevelId ?? "all"}"]`
    )
    button?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [selectedTopLevelId])

  useLayoutEffect(() => {
    const container = tierTwoRowRef.current
    if (!container || !selectedCategoryId) {
      return
    }
    const button = container.querySelector<HTMLButtonElement>(
      `[data-pill-id="${selectedCategoryId}"]`
    )
    button?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [selectedCategoryId])

  if (!categories.length) {
    return null
  }

  return (
    <div className="-mx-6 flex flex-col">
      {showSearch ? (
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 pb-2 pt-1">
          <button
            type="button"
            onClick={closeSearch}
            className="flex shrink-0 items-center text-gray-500 hover:text-gray-800"
            aria-label={t("closeSearch")}
            data-testid="search-close"
          >
            <XMark width={20} height={20} />
          </button>
          <div className="flex-1">
            <ProductSearch />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex h-12 shrink-0 items-center justify-center rounded-full ps-6 pe-2 text-gray-600 hover:text-gray-800"
            aria-label={t("search")}
            data-testid="search-toggle"
          >
            <MagnifyingGlass width={22} height={22} />
          </button>
          <div
            ref={tierOneRowRef}
            className={clx("flex gap-1 overflow-x-auto no-scrollbar pe-6", scrollFadeClassName)}
            data-testid="category-pills"
          >
            <button
              type="button"
              onClick={() => selectCategory(null)}
              className={tierOneTabClassName(!selectedCategoryId)}
              data-pill-id="all"
              data-testid="category-pill-all"
            >
              {t("allCategories")}
            </button>
            {categories.map((category) => {
              const isSelected = selectedTopLevel?.id === category.id
              const Icon = CATEGORY_ICONS[category.handle ?? ""]

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id ?? null)}
                  className={tierOneTabClassName(isSelected)}
                  data-pill-id={category.id}
                  data-testid="category-pill"
                >
                  {Icon && <Icon width={24} height={24} />}
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
      {!showSearch && !!selectedTopLevel?.category_children?.length && (
        // Secondary tabs sit flush beneath Tier 1 — same row family, no box,
        // no caption. Direct adjacency is what reads as "belongs to Skincare."
        // Plain page-margin inset (matching every other edge on the page)
        // rather than trying to pixel-match Tier 1's search-icon-shifted
        // start — that alignment was fragile and kept drifting off in one
        // direction or the other as icon/padding values changed.
        <div
          ref={tierTwoRowRef}
          className={clx(
            "animate-fade-in-top flex gap-1 overflow-x-auto no-scrollbar ps-6 pe-6 pt-2",
            scrollFadeClassName
          )}
          data-testid="subcategory-pills"
        >
          {selectedTopLevel.category_children.map((child) => {
            const isSelected = selectedCategoryId === child.id

            return (
              <button
                key={child.id}
                type="button"
                onClick={() => selectCategory(child.id ?? null)}
                className={tierTwoTabClassName(isSelected)}
                data-pill-id={child.id}
                data-testid="subcategory-pill"
              >
                {child.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryPills
