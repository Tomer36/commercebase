import LegalDocument, { LegalSection } from "@modules/common/components/legal-document"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

const interpolate = (value: string, vars: Record<string, string>) =>
  Object.entries(vars).reduce(
    (acc, [key, val]) => acc.replaceAll(`{${key}}`, val),
    value
  )

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PrivacyPolicy")
  return { title: t("title") }
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("PrivacyPolicy")
  const tCommon = await getTranslations("Common")

  const vars = { storeName: tCommon("storeName") }

  const intro = (t.raw("intro") as string[]).map((p) => interpolate(p, vars))
  const sections = (t.raw("sections") as LegalSection[]).map((section) => ({
    title: interpolate(section.title, vars),
    lead: section.lead ? interpolate(section.lead, vars) : undefined,
    bullets: section.bullets?.map((b) => interpolate(b, vars)),
    note: section.note ? interpolate(section.note, vars) : undefined,
  }))

  return <LegalDocument title={t("title")} intro={intro} sections={sections} />
}
