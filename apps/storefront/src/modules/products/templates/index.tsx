import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { Text } from "@modules/common/components/ui"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate = ({
  product,
  region,
  countryCode,
  images,
}: ProductTemplateProps) => {
  if (!product || !product.id) {
    return notFound()
  }

  const actionsFallback = (
    <ProductActions disabled={true} product={product} region={region} />
  )

  return (
    <>
      {/* Mobile: photo and price/add-to-cart come first, details/description last */}
      <div
        className="content-container flex flex-col small:hidden py-6 gap-y-6"
        data-testid="product-container-mobile"
      >
        <ImageGallery images={images} />
        <ProductInfo product={product} hideDescription />
        <ProductOnboardingCta />
        <Suspense fallback={actionsFallback}>
          <ProductActionsWrapper id={product.id} region={region} />
        </Suspense>
        <div className="flex flex-col gap-y-4">
          {product.description && (
            <Text className="text-medium text-gray-500 whitespace-pre-line">
              {product.description}
            </Text>
          )}
          <ProductTabs product={product} />
        </div>
      </div>

      {/* Desktop: unchanged sticky 3-column layout */}
      <div
        className="content-container hidden small:flex small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col sticky top-48 py-0 max-w-[300px] w-full gap-y-6">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={images} />
        </div>
        <div className="flex flex-col sticky top-48 py-0 max-w-[300px] w-full gap-y-12">
          <ProductOnboardingCta />
          <Suspense fallback={actionsFallback}>
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>

      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
