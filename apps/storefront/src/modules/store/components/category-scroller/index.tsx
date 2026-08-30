import { listCategories } from "@lib/data/categories"
import { EXCLUDED_CATEGORY_HANDLES } from "@lib/util/excluded-categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import Image from "next/image"

const CategoryScroller = async () => {
  const categories = await listCategories()
  const visible = categories.filter(
    (category) => !EXCLUDED_CATEGORY_HANDLES.includes(category.handle ?? "")
  )

  if (!visible.length) {
    return null
  }

  return (
    <div
      className="flex gap-4 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1"
      data-testid="category-scroller"
    >
      {visible.map((category) => {
        const thumbnail =
          (category.metadata?.thumbnail as string | undefined) ?? null

        return (
          <LocalizedClientLink
            key={category.id}
            href={`/categories/${category.handle}`}
            className="flex w-16 shrink-0 flex-col items-center gap-2"
            data-testid="category-scroller-item"
          >
            <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-large border border-accent-soft bg-accent-soft text-gray-400">
              {thumbnail ? (
                <Image src={thumbnail} alt="" fill className="object-cover" />
              ) : (
                <PlaceholderImage size={24} />
              )}
            </span>
            <span className="w-full truncate text-center text-small-regular text-black">
              {category.name}
            </span>
          </LocalizedClientLink>
        )
      })}
    </div>
  )
}

export default CategoryScroller
