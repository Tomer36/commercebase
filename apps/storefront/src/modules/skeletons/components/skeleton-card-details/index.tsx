const SkeletonCardDetails = () => {
  return (
    <div className="flex flex-col gap-1 my-4 transition-all duration-150 ease-in-out">
      <div className="h-4 bg-gray-200 rounded-rounded w-1/4 animate-pulse mb-1"></div>
      <div className="pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-gray-100 border rounded-rounded appearance-none border-gray-200 animate-pulse" />
    </div>
  )
}

export default SkeletonCardDetails
