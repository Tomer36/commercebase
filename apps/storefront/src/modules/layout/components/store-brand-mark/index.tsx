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
          variant === "mark" && "h-8 w-8",
          className
        )}
        data-testid="nav-store-link"
      >
        <Image
          src="/logo.svg"
          alt={storeName}
          width={variant === "mark" ? 32 : 120}
          height={32}
          className={variant === "mark" ? "h-8 w-8 object-contain" : "h-8 w-auto object-contain"}
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
          "flex h-8 w-8 items-center justify-center rounded-full bg-white text-accent text-base-semi uppercase transition-transform duration-150 ease-out active:scale-90",
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
        "text-xl-semi uppercase transition-colors duration-150 hover:text-gray-500",
        className
      )}
      data-testid="nav-store-link"
    >
      {storeName}
    </LocalizedClientLink>
  )
}

export default StoreBrandMark
