export type UILang = "en" | "he" | "ar"

const RTL_LANGS: UILang[] = ["he", "ar"]

/**
 * Locale codes are stored as full BCP 47 tags (e.g. "he-IL") in the
 * `_medusa_locale` cookie. UI message files are only maintained per
 * base language, so we key everything by the language subtag.
 */
export function toUILang(localeCode: string | null | undefined): UILang {
  const base = localeCode?.split("-")[0]?.toLowerCase()
  if (base === "he" || base === "ar") {
    return base
  }
  return "en"
}

export function isRtl(lang: UILang): boolean {
  return RTL_LANGS.includes(lang)
}
