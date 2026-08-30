"use client"

import { House, Receipt, ShoppingBag, ShoppingCart, User } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { ReactNode } from "react"

const MobileTabBar = ({ cartBadge }: { cartBadge?: ReactNode }) => {
  const t = useTranslations("Common")
  const pathname = usePathname()
  const { countryCode } = useParams()

  const path = countryCode
    ? pathname.replace(`/${countryCode}`, "") || "/"
    : pathname

  const isOrders = path.startsWith("/account/orders")

  const tabs = [
    {
      key: "home",
      href: "/",
      label: t("home"),
      Icon: House,
      active: path === "/",
    },
    {
      key: "store",
      href: "/store",
      label: t("store"),
      Icon: ShoppingBag,
      active: path.startsWith("/store") || path.startsWith("/categories"),
    },
    {
      key: "cart",
      href: "/cart",
      label: t("cart"),
      Icon: ShoppingCart,
      active: path.startsWith("/cart"),
    },
    {
      key: "orders",
      href: "/account/orders",
      label: t("orders"),
      Icon: Receipt,
      active: isOrders,
    },
    {
      key: "account",
      href: "/account",
      label: t("account"),
      Icon: User,
      active: path.startsWith("/account") && !isOrders,
    },
  ]

  return (
    // The safe-area padding lives on this outer element, separate from the
    // fixed-height row below — putting both on the same box would eat into
    // the h-12 content height (border-box sizing) and squeeze the tabs
    // upward instead of leaving them centered with extra room underneath.
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white small:hidden pb-[env(safe-area-inset-bottom)]"
      data-testid="mobile-tab-bar"
    >
      <div className="flex h-12 items-stretch">
        {tabs.map(({ key, href, label, Icon, active }) => (
          <LocalizedClientLink
            key={key}
            href={href}
            className={clx(
              "flex flex-1 flex-col items-center justify-center gap-1 pt-1.5 text-xsmall-regular transition-colors duration-200",
              active ? "font-semibold text-accent" : "text-gray-400"
            )}
            data-testid={`mobile-tab-${key}`}
          >
            <span
              className={clx(
                "relative inline-flex transition-transform duration-200",
                active && "scale-105"
              )}
            >
              <Icon width={20} height={20} />
              {key === "cart" && cartBadge}
            </span>
            {label}
          </LocalizedClientLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileTabBar
