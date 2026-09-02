"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import {
  ArrowRightMini,
  BarsThree,
  House,
  ShoppingBag,
  ShoppingCart,
  User,
  XMark,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"
import { useTranslations } from "next-intl"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const t = useTranslations("Common")

  // Same icon set as the mobile tab bar (House/ShoppingBag/User/ShoppingCart)
  // so "Store" and "Cart" read as the same concept in both places rather
  // than two different icons standing in for the same link.
  const SideMenuItems = [
    { name: t("home"), href: "/", Icon: House },
    { name: t("store"), href: "/store", Icon: ShoppingBag },
    { name: t("account"), href: "/account", Icon: User },
    { name: t("cart"), href: "/cart", Icon: ShoppingCart },
  ]

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative flex items-center gap-x-2 rounded-full px-3 py-2 text-gray-600 transition-colors duration-150 ease-out focus:outline-none hover:bg-gray-50 hover:text-black"
                >
                  <BarsThree width={20} height={20} />
                  {t("menu")}
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 -translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-1"
              >
                <PopoverPanel
                  static
                  className="absolute start-0 top-[calc(100%+1px)] z-[51] w-80 rounded-large border border-gray-200 bg-white text-base-regular text-black shadow-xl"
                >
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col p-4"
                  >
                    <div className="mb-2 flex justify-end">
                      <button
                        type="button"
                        data-testid="close-menu-button"
                        onClick={close}
                        aria-label={t("close")}
                        className="flex items-center rounded-full p-1.5 text-gray-500 transition-colors duration-150 hover:bg-gray-50 hover:text-black"
                      >
                        <XMark width={18} height={18} />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-y-1">
                      {SideMenuItems.map(({ name, href, Icon }) => (
                        <li key={name}>
                          <LocalizedClientLink
                            href={href}
                            className="flex items-center gap-x-2 rounded-large px-3 py-2.5 text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-black"
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            <Icon width={20} height={20} />
                            {name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                    <div className="my-2 border-t border-gray-200" />
                    <div className="flex flex-col gap-y-1 px-1">
                      {!!locales?.length && (
                        <div
                          className="flex items-center justify-between py-1 text-gray-600"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                            buttonId="side-menu-language-select-button"
                          />
                          <ArrowRightMini
                            className={clx(
                              "text-gray-400 transition-transform duration-150 rtl:-scale-x-100",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex items-center justify-between py-1 text-gray-600"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                            buttonId="side-menu-country-select-button"
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "text-gray-400 transition-transform duration-150 rtl:-scale-x-100",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                    </div>
                    <div className="my-2 border-t border-gray-200" />
                    <Text className="px-1 text-small-regular text-gray-400">
                      {t("copyright", {
                        year: new Date().getFullYear(),
                        storeName: t("storeName"),
                      })}
                    </Text>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
