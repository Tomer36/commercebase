"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { updateLocale } from "@lib/data/locale-actions"
import { Locale } from "@lib/data/locales"
import { useTranslations } from "next-intl"

type LanguageOption = {
  code: string
  name: string
  localizedName: string
  countryCode: string
}

const getCountryCodeFromLocale = (localeCode: string): string => {
  try {
    const locale = new Intl.Locale(localeCode)
    if (locale.region) {
      return locale.region.toUpperCase()
    }
    const maximized = locale.maximize()
    return maximized.region?.toUpperCase() ?? localeCode.toUpperCase()
  } catch {
    const parts = localeCode.split(/[-_]/)
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
  }
}

type LanguageSelectProps = {
  toggleState: StateType
  locales: Locale[]
  currentLocale: string | null
  /** "pill" = compact code-only trigger (opt-in, for tight header contexts). Default unchanged. */
  variant?: "row" | "pill"
  /** Unique per call site so headlessui's generated ids never collide when
   * this component is mounted more than once on the same page (e.g. the
   * desktop SideMenu and the mobile AccountNav are both in the DOM at
   * once on /account). */
  buttonId: string
}

/**
 * Gets the localized display name for a language code using Intl API.
 * Falls back to the provided name if Intl is unavailable.
 */
const getLocalizedLanguageName = (
  code: string,
  fallbackName: string,
  displayLocale: string = "en-US"
): string => {
  try {
    const displayNames = new Intl.DisplayNames([displayLocale], {
      type: "language",
    })
    return displayNames.of(code) ?? fallbackName
  } catch {
    return fallbackName
  }
}

const DEFAULT_OPTION: LanguageOption = {
  code: "",
  name: "Default",
  localizedName: "Default",
  countryCode: "",
}

const LanguageSelect = ({
  toggleState,
  locales,
  currentLocale,
  variant = "row",
  buttonId,
}: LanguageSelectProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { state, close, toggle } = toggleState
  const t = useTranslations("Common")

  const options = useMemo(() => {
    return locales.map((locale) => {
      const baseLanguage = locale.code.split(/[-_]/)[0]

      return {
        code: locale.code,
        name: locale.name,
        // Each language shown in its own script (native name), not
        // translated into whatever language is currently active.
        localizedName: getLocalizedLanguageName(
          baseLanguage,
          locale.name,
          baseLanguage
        ),
        countryCode: getCountryCodeFromLocale(locale.code),
      }
    })
  }, [locales])

  const [current, setCurrent] = useState<LanguageOption | undefined>(undefined)

  useEffect(() => {
    if (currentLocale) {
      const option = options.find(
        (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
      )
      setCurrent(option ?? DEFAULT_OPTION)
    } else {
      setCurrent(DEFAULT_OPTION)
    }
  }, [options, currentLocale])

  const handleChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      close()
      router.refresh()
    })
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          currentLocale
            ? options.find(
                (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
              ) ?? DEFAULT_OPTION
            : DEFAULT_OPTION
        }
        disabled={isPending}
      >
        {variant === "pill" ? (
          <ListboxButton
            id={buttonId}
            className="flex h-8 items-center justify-center rounded-full bg-white/20 px-2.5 text-xsmall-regular font-semibold text-accent-foreground"
            aria-label={t("language")}
            onClick={toggle}
          >
            {current?.code ? current.code.slice(0, 2).toUpperCase() : "--"}
          </ListboxButton>
        ) : (
        <ListboxButton
          id={buttonId}
          className="py-1 w-full"
          onClick={toggle}
        >
          <div className="text-small-regular flex items-start gap-x-2">
            <span>{t("language")}</span>
            {current && (
              <span className="text-small-regular flex items-center gap-x-2">
                {current.countryCode && (
                  /* @ts-ignore */
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={current.countryCode}
                  />
                )}
                {isPending ? "..." : current.localizedName}
              </span>
            )}
          </div>
        </ListboxButton>
        )}
        <div
          className={
            variant === "pill"
              ? "relative"
              : "flex relative w-full min-w-80"
          }
        >
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className={
                variant === "pill"
                  ? "absolute top-full start-0 mt-2 w-56 max-h-80 overflow-y-scroll z-[900] bg-white shadow-xl text-small-regular text-black no-scrollbar rounded-rounded"
                  : "absolute -bottom-[calc(100%-36px)] start-0 xsmall:start-auto xsmall:end-0 max-h-[442px] overflow-y-scroll z-[900] bg-white shadow-xl text-small-regular text-black no-scrollbar rounded-rounded w-full"
              }
              static
            >
              {options.map((o) => (
                <ListboxOption
                  key={o.code || "default"}
                  value={o}
                  className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                >
                  {o.countryCode ? (
                    /* @ts-ignore */
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o.countryCode}
                    />
                  ) : (
                    <span style={{ width: "16px", height: "16px" }} />
                  )}
                  {o.localizedName}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default LanguageSelect
