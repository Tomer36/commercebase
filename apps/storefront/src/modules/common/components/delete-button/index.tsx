import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch((_err) => {
      setIsDeleting(false)
    })
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        type="button"
        aria-label="Remove item"
        className="flex h-9 w-9 items-center justify-center gap-x-1 rounded-rounded text-gray-500 transition-all duration-150 ease-out hover:bg-gray-50 hover:text-black active:scale-90 disabled:opacity-50"
        onClick={() => handleDelete(id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Spinner className="animate-spin" width={18} height={18} />
        ) : (
          <Trash width={18} height={18} />
        )}
        {children && <span>{children}</span>}
      </button>
    </div>
  )
}

export default DeleteButton
