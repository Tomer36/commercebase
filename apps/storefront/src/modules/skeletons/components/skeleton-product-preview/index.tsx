import { Container } from "@modules/common/components/ui"

const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-large border border-gray-200 bg-white">
      <Container className="aspect-[4/3] w-full p-0 rounded-none bg-gray-100" />
      <div className="flex justify-between text-base-regular p-3">
        <div className="w-2/5 h-6 bg-gray-100"></div>
        <div className="w-1/5 h-6 bg-gray-100"></div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
