import { Table } from "@modules/common/components/ui"

const SkeletonLineItem = ({ type = "preview" }: { type?: "full" | "preview" }) => {
  if (type === "full") {
    return (
      <div className="flex gap-4 border-b border-gray-200 py-4 last:border-0">
        <div className="w-20 h-20 shrink-0 small:w-24 small:h-24 bg-gray-200 animate-pulse" />
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-y-2">
              <div className="w-32 h-4 bg-gray-200 animate-pulse" />
              <div className="w-24 h-4 bg-gray-200 animate-pulse" />
            </div>
            <div className="w-12 h-6 bg-gray-200 animate-pulse" />
          </div>
          <div className="w-28 h-12 bg-gray-200 animate-pulse rounded-rounded" />
        </div>
      </div>
    )
  }

  return (
    <Table.Row className="w-full m-4">
      <Table.Cell className="p-4 w-24">
        <div className="flex w-24 h-24 p-4 bg-gray-200 animate-pulse" />
      </Table.Cell>
      <Table.Cell className="text-start">
        <div className="flex flex-col gap-y-2">
          <div className="w-32 h-4 bg-gray-200 animate-pulse" />
          <div className="w-24 h-4 bg-gray-200 animate-pulse" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-8 bg-gray-200 animate-pulse" />
          <div className="w-14 h-10 bg-gray-200 animate-pulse" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-gray-200 animate-pulse" />
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex gap-2 justify-end">
          <div className="w-12 h-6 bg-gray-200 animate-pulse" />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default SkeletonLineItem
