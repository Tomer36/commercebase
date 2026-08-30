import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronDown } from "@medusajs/icons"
import { getTranslations } from "next-intl/server"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations("Common")

  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white border-b ">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90 rtl:-rotate-90" width={16} height={16} />
            <span className="mt-px hidden small:block text-small-semi text-ui-fg-subtle hover:text-ui-fg-base ">
              {t("backToShoppingCart")}
            </span>
            <span className="mt-px block small:hidden text-small-semi text-ui-fg-subtle hover:text-ui-fg-base">
              {t("back")}
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-xl-semi text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            data-testid="store-link"
          >
            {t("storeName")}
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
