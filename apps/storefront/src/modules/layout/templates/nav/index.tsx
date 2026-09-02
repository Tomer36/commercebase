import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import { ShoppingCart } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileHeader from "@modules/layout/components/mobile-header"
import { getTranslations } from "next-intl/server"

import DesktopNav from "./desktop-nav"

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
      <header className="relative h-12 mx-auto border-b duration-200 bg-accent small:bg-white border-accent small:border-gray-200">
        <MobileHeader
          locales={locales}
          currentLocale={currentLocale}
          storeName={storeName}
          contactLabel={t("contactUs")}
        />
        <DesktopNav
          regions={regions}
          locales={locales}
          currentLocale={currentLocale}
          storeName={storeName}
          cartButton={
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center gap-x-2 rounded-full px-3 py-2 text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-black"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <ShoppingCart width={20} height={20} />
                  {t("cart")}
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          }
        />
      </header>
    </div>
  )
}
