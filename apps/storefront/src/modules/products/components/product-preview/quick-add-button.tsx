"use client"

import { addToCart } from "@lib/data/cart"
import { Check, Plus } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useState } from "react"

const buttonClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-150 ease-out hover:opacity-90 active:scale-90 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"

type QuickAddButtonProps =
  | { variantId: string; inStock: boolean; href?: undefined }
  | { href: string; variantId?: undefined; inStock?: undefined }

const QuickAddButton = (props: QuickAddButtonProps) => {
  const t = useTranslations("ProductActions")
  const { countryCode } = useParams()
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  // No single variant to add — go to the product page to pick options
  // instead of guessing which one the customer wants.
  if (props.href) {
    return (
      <LocalizedClientLink
        href={props.href}
        aria-label={t("selectOptions")}
        data-testid="quick-add-button"
        className={buttonClassName}
      >
        <Plus />
      </LocalizedClientLink>
    )
  }

  const { variantId, inStock } = props

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!inStock || isAdding) {
      return
    }

    setIsAdding(true)

    await addToCart({
      variantId,
      quantity: 1,
      countryCode: countryCode as string,
    })

    setIsAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!inStock || isAdding}
      aria-label={t("addToCart")}
      data-testid="quick-add-button"
      className={buttonClassName}
    >
      <span key={added ? "check" : "plus"} className="flex animate-enter">
        {added ? <Check /> : <Plus />}
      </span>
    </button>
  )
}

export default QuickAddButton
