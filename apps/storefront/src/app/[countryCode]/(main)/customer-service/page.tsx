import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CustomerService")
  return { title: t("metaTitle") }
}

export default async function CustomerServicePage() {
  const t = await getTranslations("CustomerService")

  return (
    <div className="content-container py-12 max-w-3xl">
      <Heading level="h1" className="text-3xl-semi text-black mb-6">
        {t("title")}
      </Heading>
      <p className="text-large-regular text-gray-600 mb-8">{t("intro")}</p>
      <p className="text-base-regular text-gray-600">
        {t("contactPrompt")}{" "}
        <LocalizedClientLink href="/contact" className="underline text-black">
          {t("contactLink")}
        </LocalizedClientLink>
        .
      </p>
    </div>
  )
}
