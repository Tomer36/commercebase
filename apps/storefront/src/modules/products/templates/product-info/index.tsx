import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  hideDescription?: boolean
}

const ProductInfo = ({ product, hideDescription }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 large:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-small-regular text-gray-400 hover:text-gray-500"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl-semi text-black"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        {!hideDescription && (
          <Text
            className="text-base-regular text-gray-500 whitespace-pre-line"
            data-testid="product-description"
          >
            {product.description}
          </Text>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
