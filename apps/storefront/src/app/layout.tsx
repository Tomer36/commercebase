import { getLocale } from "@lib/data/locale-actions"
import { getBaseURL } from "@lib/util/env"
import { isRtl, toUILang } from "@lib/i18n/ui-dictionary"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { Rubik, Unbounded } from "next/font/google"
import CookieConsent from "@modules/layout/components/cookie-consent"
import "styles/globals.css"

// Single webfont covering all three storefront locales (Latin/Hebrew/Arabic)
// with matched metrics, so no per-locale font switching is needed.
const rubik = Rubik({
  subsets: ["latin", "hebrew", "arabic"],
  variable: "--font-sans",
  display: "swap",
})

// Display face for headings only (Latin glyphs — Unbounded has no Hebrew/
// Arabic cut). Used sparingly via the shared Heading component; Hebrew/
// Arabic headings fall through to Rubik automatically per the font-family
// fallback chain in tailwind.config.js.
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const currentLocale = await getLocale()
  const lang = toUILang(currentLocale)

  return (
    <html
      lang={lang}
      dir={isRtl(lang) ? "rtl" : "ltr"}
      data-mode="light"
      className={`${rubik.variable} ${unbounded.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <main className="relative">{props.children}</main>
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
