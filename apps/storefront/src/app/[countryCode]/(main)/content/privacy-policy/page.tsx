import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LegalPages")
  return { title: t("privacyPolicyTitle") }
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("LegalPages")

  return (
    <div className="content-container py-12 max-w-3xl">
      <Heading level="h1" className="text-3xl-semi text-black mb-6">
        {t("privacyPolicyTitle")}
      </Heading>
      <p className="text-large-regular text-gray-600">{t("comingSoon")}</p>
    </div>
  )
}
