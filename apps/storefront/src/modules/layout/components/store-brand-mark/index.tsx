import { HAS_CUSTOM_LOGO } from "@lib/config/business-info"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import Image from "next/image"

type StoreBrandMarkProps = {
  storeName: string
  /** "mark" = compact circular avatar (mobile header). "wordmark" = inline text lockup (desktop nav). */
  variant: "mark" | "wordmark"
  className?: string
}

/**
 * Single source for the store's brand mark, used by both the mobile header
 * and the desktop nav. Until a real logo is supplied (HAS_CUSTOM_LOGO in
 * business-info.ts), each variant falls back to a plain text treatment —
 * once a logo lands at public/logo.svg and the flag flips, both variants
 * render the real image instead.
 */
const StoreBrandMark = ({ storeName, variant, className }: StoreBrandMarkProps) => {
  if (HAS_CUSTOM_LOGO) {
    return (
      <LocalizedClientLink
        href="/"
        className={clx(
          "flex items-center",
          variant === "mark" && "h-10 w-10",
          className
        )}
        data-testid="nav-store-link"
      >
        <Image
          src="/logo.svg"
          alt={storeName}
          width={variant === "mark" ? 40 : 120}
          height={40}
          className={variant === "mark" ? "h-10 w-10 object-contain" : "h-8 w-auto object-contain"}
          priority
        />
      </LocalizedClientLink>
    )
  }

  if (variant === "mark") {
    return (
      <LocalizedClientLink
        href="/"
        className={clx(
          "flex h-10 w-10 items-center justify-center rounded-full bg-white text-accent text-lg font-bold uppercase transition-transform duration-150 ease-out active:scale-90",
          className
        )}
        data-testid="nav-store-link"
      >
        {storeName.charAt(0)}
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink
      href="/"
      className={clx(
        "txt-compact-xlarge-plus uppercase transition-colors duration-150 hover:text-gray-500",
        className
      )}
      data-testid="nav-store-link"
    >
      {storeName}
    </LocalizedClientLink>
  )
}

export default StoreBrandMark
