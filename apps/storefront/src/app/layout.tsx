import { getLocale } from "@lib/data/locale-actions"
import { getBaseURL } from "@lib/util/env"
import { isRtl, toUILang } from "@lib/i18n/ui-dictionary"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const currentLocale = await getLocale()
  const lang = toUILang(currentLocale)

  return (
    <html lang={lang} dir={isRtl(lang) ? "rtl" : "ltr"} data-mode="light">
      <body>
        <NextIntlClientProvider>
          <main className="relative">{props.children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
