import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import QuickAddButton from "./quick-add-button"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Quick-add from the grid only makes sense when there's exactly one
  // variant to add — otherwise the customer needs the PDP to pick options.
  const quickAddVariant =
    product.variants?.length === 1 ? product.variants[0] : undefined
  const quickAddInStock = quickAddVariant
    ? !quickAddVariant.manage_inventory ||
      !!quickAddVariant.allow_backorder ||
      (quickAddVariant.inventory_quantity ?? 0) > 0
    : false

  return (
    <div data-testid="product-wrapper">
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="group block active:scale-[0.98] transition-transform duration-150"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          alt={product.title}
        />
      </LocalizedClientLink>
      <div className="mt-3 flex items-start justify-between gap-2">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="flex flex-col gap-y-1 min-w-0"
        >
          <span
            className="text-large-regular text-black line-clamp-2 min-h-[3rem]"
            data-testid="product-title"
          >
            {product.title}
          </span>
          {cheapestPrice && (
            <span className="text-large-semi text-black">
              <PreviewPrice price={cheapestPrice} />
            </span>
          )}
        </LocalizedClientLink>
        {quickAddVariant ? (
          <QuickAddButton
            variantId={quickAddVariant.id}
            inStock={quickAddInStock}
          />
        ) : (
          <QuickAddButton href={`/products/${product.handle}`} />
        )}
      </div>
    </div>
  )
}
