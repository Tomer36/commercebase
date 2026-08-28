"use client"

import { ArrowRightOnRectangle } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useParams, usePathname } from "next/navigation"

import { signout } from "@lib/data/customer"
import { Locale } from "@lib/data/locales"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "@modules/layout/components/country-select"
import LanguageSelect from "@modules/layout/components/language-select"
import { ChevronDown, MapPin, Receipt, User } from "@medusajs/icons"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useTranslations } from "next-intl"

const AccountNav = ({
  customer,
  regions,
  locales,
  currentLocale,
}: {
  customer: HttpTypes.StoreCustomer | null
  regions?: HttpTypes.StoreRegion[] | null
  locales?: Locale[] | null
  currentLocale?: string | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const t = useTranslations("AccountNav")
  const tCommon = useTranslations("Common")
  const languageToggleState = useToggleState()
  const countryToggleState = useToggleState()

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90 rtl:-rotate-90" />
              <span>{tCommon("account")}</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-xl-semi mb-4 px-8">
              {t("hello", { firstName: customer?.first_name ?? "" })}
            </div>
            <div className="text-base-regular">
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User width={20} height={20} />
                        <span>{t("profile")}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90 rtl:rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin width={20} height={20} />
                        <span>{t("addresses")}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90 rtl:rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Receipt width={20} height={20} />
                      <span>{t("orders")}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 rtl:rotate-90" />
                  </LocalizedClientLink>
                </li>
                {!!locales?.length && (
                  <li className="flex items-center justify-between py-4 border-b border-gray-200 px-8">
                    <LanguageSelect
                      toggleState={languageToggleState}
                      locales={locales}
                      currentLocale={currentLocale ?? null}
                      buttonId="account-nav-language-select-button"
                    />
                  </li>
                )}
                {!!regions?.length && (
                  <li className="flex items-center justify-between py-4 border-b border-gray-200 px-8">
                    <CountrySelect
                      toggleState={countryToggleState}
                      regions={regions}
                      buttonId="account-nav-country-select-button"
                    />
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>{t("logOut")}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 rtl:rotate-90" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div>
          <div className="pb-4">
            <h3 className="text-base-semi">{tCommon("account")}</h3>
          </div>
          <div className="text-base-regular">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  {t("overview")}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  {t("profile")}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  {t("addresses")}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  {t("orders")}
                </AccountNavLink>
              </li>
              <li className="text-gray-500">
                <button
                  type="button"
                  onClick={handleLogout}
                  data-testid="logout-button"
                >
                  {t("logOut")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx("text-ui-fg-subtle hover:text-ui-fg-base", {
        "text-ui-fg-base font-semibold": active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
