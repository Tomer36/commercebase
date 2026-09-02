import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

/**
 * Compact category chips — a real product-photo avatar + name in a
 * wrapping pill row. Deliberately different from a grid of tiles or a
 * stacked list: categories are a quick jump-off point here, not the
 * page's main visual event (New Arrivals below carries that weight).
 */
const CategoryChips = ({
  items,
}: {
  items: {
    category: HttpTypes.StoreProductCategory
    thumbnail: string | null
  }[]
}) => {
  if (!items.length) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ category, thumbnail }) => (
        <LocalizedClientLink
          key={category.id}
          href={`/categories/${category.handle}`}
          className="flex items-center gap-3 rounded-full border border-gray-200 bg-white py-2 pe-5 ps-2 transition-colors hover:border-accent"
          data-testid="home-category-chip"
        >
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-50">
            {thumbnail && (
              <Image
                src={thumbnail}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            )}
          </span>
          <span className="text-base-semi text-black">{category.name}</span>
        </LocalizedClientLink>
      ))}
    </div>
  )
}

export default CategoryChips
