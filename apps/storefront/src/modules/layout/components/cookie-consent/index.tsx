"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const STORAGE_KEY = "cookie-consent"

/**
 * Sitewide cookie consent banner, mounted once in the root layout. The
 * choice (accepted/declined) persists in localStorage so it only shows
 * once per visitor. This store currently sets no non-essential cookies of
 * its own — if analytics/marketing cookies are added later, gate them on
 * `localStorage.getItem("cookie-consent") === "accepted"` before firing.
 */
const CookieConsent = () => {
  const t = useTranslations("CookieConsent")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setVisible(true)
      }
    } catch {
      // localStorage unavailable (private browsing, blocked storage) — skip
      // the banner rather than showing it on every single page load.
    }
  }, [])

  const respond = (choice: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // Ignore — worst case the banner reappears next visit.
    }
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div
      className="fixed inset-x-0 z-50 border-t border-gray-200 bg-white bottom-[calc(3rem+env(safe-area-inset-bottom))] small:bottom-0"
      data-testid="cookie-consent-banner"
    >
      <div className="content-container flex flex-col small:flex-row small:items-center gap-4 py-5">
        <p className="flex-1 text-small-regular text-gray-600">
          {t.rich("message", {
            termsLink: (chunks) => (
              <LocalizedClientLink
                href="/content/terms-of-use"
                className="underline text-black"
              >
                {chunks}
              </LocalizedClientLink>
            ),
            privacyLink: (chunks) => (
              <LocalizedClientLink
                href="/content/privacy-policy"
                className="underline text-black"
              >
                {chunks}
              </LocalizedClientLink>
            ),
          })}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            onClick={() => respond("declined")}
            data-testid="cookie-decline-button"
          >
            {t("decline")}
          </Button>
          <Button
            variant="primary"
            onClick={() => respond("accepted")}
            data-testid="cookie-accept-button"
          >
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
