"use client"

import { Transition } from "@headlessui/react"
import { Adjustments, XMark } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import { Fragment, useEffect, useState } from "react"

const STORAGE_KEY = "a11y-preferences"
const MAX_TEXT_SCALE = 2

type Preferences = {
  textScale: number
  highContrast: boolean
  underlineLinks: boolean
}

const DEFAULT_PREFERENCES: Preferences = {
  textScale: 0,
  highContrast: false,
  underlineLinks: false,
}

const applyPreferences = (prefs: Preferences) => {
  const root = document.documentElement
  root.classList.remove("a11y-text-scale-1", "a11y-text-scale-2")
  if (prefs.textScale > 0) {
    root.classList.add(`a11y-text-scale-${prefs.textScale}`)
  }
  root.classList.toggle("a11y-high-contrast", prefs.highContrast)
  root.classList.toggle("a11y-underline-links", prefs.underlineLinks)
}

const AccessibilityWidget = () => {
  const t = useTranslations("Accessibility")
  const [isOpen, setIsOpen] = useState(false)
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
        setPrefs(parsed)
        applyPreferences(parsed)
      }
    } catch {}
  }, [])

  const update = (next: Preferences) => {
    setPrefs(next)
    applyPreferences(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={t("openWidget")}
        aria-expanded={isOpen}
        data-testid="accessibility-widget-button"
        className="fixed end-4 bottom-20 small:bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-150 ease-out hover:opacity-90 active:scale-90"
      >
        {isOpen ? (
          <XMark width={20} height={20} />
        ) : (
          <Adjustments width={20} height={20} />
        )}
      </button>

      <Transition
        as={Fragment}
        show={isOpen}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          role="dialog"
          aria-label={t("panelTitle")}
          data-testid="accessibility-widget-panel"
          className="fixed end-4 bottom-[8.5rem] small:bottom-20 z-40 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-large border border-gray-200 bg-white p-4 shadow-xl"
        >
          <h2 className="text-base-semi text-black">{t("panelTitle")}</h2>

          <div className="flex flex-col gap-2">
            <span className="text-small-regular text-gray-600">
              {t("textSize")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  update({
                    ...prefs,
                    textScale: Math.max(0, prefs.textScale - 1),
                  })
                }
                disabled={prefs.textScale === 0}
                aria-label={t("decreaseText")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-base-semi disabled:opacity-30"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => update({ ...prefs, textScale: 0 })}
                className="flex h-9 items-center justify-center rounded-full border border-gray-200 px-3 text-small-regular"
              >
                {t("reset")}
              </button>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...prefs,
                    textScale: Math.min(MAX_TEXT_SCALE, prefs.textScale + 1),
                  })
                }
                disabled={prefs.textScale === MAX_TEXT_SCALE}
                aria-label={t("increaseText")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-large-semi disabled:opacity-30"
              >
                A+
              </button>
            </div>
          </div>

          <label className="flex items-center justify-between gap-2">
            <span className="text-small-regular text-gray-600">
              {t("highContrast")}
            </span>
            <input
              type="checkbox"
              checked={prefs.highContrast}
              onChange={(e) =>
                update({ ...prefs, highContrast: e.target.checked })
              }
              className={clx("h-5 w-9 appearance-none rounded-full bg-gray-200 transition-colors checked:bg-accent relative cursor-pointer",
                "before:absolute before:start-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4 rtl:checked:before:-translate-x-4"
              )}
            />
          </label>

          <label className="flex items-center justify-between gap-2">
            <span className="text-small-regular text-gray-600">
              {t("underlineLinks")}
            </span>
            <input
              type="checkbox"
              checked={prefs.underlineLinks}
              onChange={(e) =>
                update({ ...prefs, underlineLinks: e.target.checked })
              }
              className={clx("h-5 w-9 appearance-none rounded-full bg-gray-200 transition-colors checked:bg-accent relative cursor-pointer",
                "before:absolute before:start-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4 rtl:checked:before:-translate-x-4"
              )}
            />
          </label>
        </div>
      </Transition>
    </>
  )
}

export default AccessibilityWidget
