import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

export default function Loading() {
  return (
    <>
      <div className="w-full border-b border-gray-200 bg-white py-8">
        <div className="content-container flex flex-col items-center gap-3">
          <div className="h-8 w-64 max-w-full animate-pulse rounded-large bg-gray-100" />
          <div className="h-5 w-80 max-w-full animate-pulse rounded-large bg-gray-100" />
        </div>
      </div>
      <div className="content-container py-12">
        <SkeletonProductGrid />
      </div>
    </>
  )
}
