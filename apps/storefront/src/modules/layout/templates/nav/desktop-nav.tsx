"use client"

import { MagnifyingGlass, User, XMark } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import { Input } from "@modules/common/components/ui"
import SideMenu from "@modules/layout/components/side-menu"
import StoreBrandMark from "@modules/layout/components/store-brand-mark"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useState, type FormEvent, type ReactNode } from "react"

type DesktopNavProps = {
  regions: StoreRegion[]
  locales: Locale[] | null
  currentLocale: string | null
  storeName: string
  // CartButton is an async Server Component — it has to be instantiated by
  // the server (`Nav`) and handed down as an already-rendered node, since a
  // Client Component can't import and render a Server Component itself.
  cartButton: ReactNode
}

// Desktop-only nav content, split out from the server `Nav` component so it
// can own the collapsible-search toggle state (search was entirely missing
// from the desktop header before — every other page had no way to search
// at all, only the Store page's own sidebar had one). Mirrors the same
// "icon collapses to a real input" interaction already used on mobile,
// swapping the whole row's content rather than squeezing an input into a
// fixed-width flex slot next to the centered logo.
const DesktopNav = ({
  regions,
  locales,
  currentLocale,
  storeName,
  cartButton,
}: DesktopNavProps) => {
  const t = useTranslations("Common")
  const tStore = useTranslations("Store")
  const { countryCode } = useParams()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(`/${countryCode}/store${q ? `?q=${encodeURIComponent(q)}` : ""}`)
    setIsSearchOpen(false)
  }

  if (isSearchOpen) {
    return (
      <nav className="hidden small:flex content-container items-center gap-x-4 w-full h-full">
        <button
          type="button"
          onClick={() => setIsSearchOpen(false)}
          aria-label={tStore("closeSearch")}
          className="flex shrink-0 items-center text-gray-500 hover:text-gray-800"
        >
          <XMark width={20} height={20} />
        </button>
        <form onSubmit={submitSearch} className="flex-1">
          <Input
            autoFocus
            className="h-10 border-transparent bg-gray-50 focus:bg-white"
            startIcon={<MagnifyingGlass width={18} height={18} />}
            placeholder={tStore("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="header-search-input"
          />
        </form>
      </nav>
    )
  }

  return (
    <nav className="hidden small:flex content-container text-black items-center justify-between w-full h-full text-small-regular">
      <div className="flex-1 basis-0 h-full flex items-center">
        <div className="h-full">
          <SideMenu
            regions={regions}
            locales={locales}
            currentLocale={currentLocale}
          />
        </div>
      </div>

      <div className="flex items-center h-full">
        <StoreBrandMark storeName={storeName} variant="wordmark" />
      </div>

      <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          aria-label={tStore("search")}
          className="flex items-center rounded-full p-2.5 text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-black"
          data-testid="header-search-toggle"
        >
          <MagnifyingGlass width={20} height={20} />
        </button>
        <LocalizedClientLink
          className="flex items-center gap-x-2 rounded-full px-3 py-2 text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-black"
          href="/account"
          data-testid="nav-account-link"
        >
          <User width={20} height={20} />
          {t("account")}
        </LocalizedClientLink>
        {cartButton}
      </div>
    </nav>
  )
}

export default DesktopNav
