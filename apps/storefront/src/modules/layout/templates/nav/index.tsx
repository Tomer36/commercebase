import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileHeader from "@modules/layout/components/mobile-header"
import SideMenu from "@modules/layout/components/side-menu"
import StoreBrandMark from "@modules/layout/components/store-brand-mark"
import { getTranslations } from "next-intl/server"

export default async function Nav() {
  const [regions, locales, currentLocale, t] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getTranslations("Common"),
  ])

  const storeName = t("storeName")

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-12 mx-auto border-b duration-200 bg-accent small:bg-white border-accent small:border-ui-border-base">
        <MobileHeader
          locales={locales}
          currentLocale={currentLocale}
          storeName={storeName}
          contactLabel={t("contactUs")}
        />
        <nav className="hidden small:flex content-container text-black items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <StoreBrandMark storeName={storeName} variant="wordmark" />
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-gray-500"
                href="/account"
                data-testid="nav-account-link"
              >
                {t("account")}
              </LocalizedClientLink>
            </div>
            <div className="flex items-center h-full">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-gray-500 flex gap-2"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    {t("cart")} (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
