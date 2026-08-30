"use client"

import { clx } from "@modules/common/components/ui"
import { useEffect, useRef, useState } from "react"

/**
 * Renders the tab-bar cart count and pops with a brief scale/fade animation
 * whenever the count increases (e.g. right after an add-to-cart action
 * triggers a server refresh and this component re-renders with a new prop).
 */
const CartBadge = ({ count }: { count: number }) => {
  const previousCount = useRef(count)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (count > previousCount.current) {
      setPulse(true)
      const timeout = setTimeout(() => setPulse(false), 300)
      previousCount.current = count
      return () => clearTimeout(timeout)
    }
    previousCount.current = count
  }, [count])

  if (count <= 0) {
    return null
  }

  return (
    <span
      className={clx(
        "absolute -top-1.5 -end-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-xsmall-regular leading-none text-accent-foreground",
        pulse && "animate-enter"
      )}
    >
      {count}
    </span>
  )
}

export default CartBadge
