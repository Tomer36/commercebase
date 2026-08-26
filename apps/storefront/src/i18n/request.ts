import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"
import { toUILang } from "@lib/i18n/ui-dictionary"

export default getRequestConfig(async () => {
  const store = await cookies()
  const locale = toUILang(store.get("_medusa_locale")?.value)

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
