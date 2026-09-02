import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

/**
 * Full-bleed photo tiles with the category name overlaid — real product
 * photography carrying the visual weight, not a fabricated category-level
 * image. A flat scrim (not a gradient) keeps the overlaid text legible
 * regardless of what's in the photo, matching the same technique used for
 * the Brand page's story panel.
 */
const CategoryTiles = ({
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
    <div className="grid grid-cols-2 small:grid-cols-3 gap-4">
      {items.map(({ category, thumbnail }) => (
        <LocalizedClientLink
          key={category.id}
          href={`/categories/${category.handle}`}
          className="group relative aspect-square overflow-hidden rounded-large bg-accent-soft"
          data-testid="home-category-tile"
        >
          {thumbnail && (
            <Image
              src={thumbnail}
              alt=""
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 576px) 200px, 400px"
            />
          )}
          {thumbnail && (
            <div className="absolute inset-0 bg-black/30 transition-colors duration-200 group-hover:bg-black/40" />
          )}
          <span
            className={
              "absolute inset-x-0 bottom-0 p-4 text-xl-semi " +
              (thumbnail ? "text-white" : "text-black")
            }
          >
            {category.name}
          </span>
        </LocalizedClientLink>
      ))}
    </div>
  )
}

export default CategoryTiles
