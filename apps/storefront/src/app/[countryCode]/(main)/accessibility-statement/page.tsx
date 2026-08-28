import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Accessibility")
  return { title: t("statementMetaTitle") }
}

export default async function AccessibilityStatementPage() {
  const t = await getTranslations("Accessibility")

  return (
    <div className="content-container py-12 max-w-3xl">
      <Heading level="h1" className="text-3xl-semi text-black mb-6">
        {t("statementTitle")}
      </Heading>
      <p className="text-large-regular text-gray-600 mb-6">
        {t("statementIntro")}
      </p>
      <ul className="flex flex-col gap-3 text-base-regular text-gray-600 list-disc ps-5">
        <li>{t("statementItemWidget")}</li>
        <li>{t("statementItemSemantic")}</li>
        <li>{t("statementItemRtl")}</li>
        <li>{t("statementItemKeyboard")}</li>
      </ul>
      <p className="text-base-regular text-gray-600 mt-6">
        {t("statementDisclaimer")}
      </p>
    </div>
  )
}
