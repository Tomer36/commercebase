import { Spinner } from "@medusajs/icons"

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full text-ui-fg-base">
      <Spinner width={36} height={36} className="animate-spin" />
    </div>
  )
}
