import { BUSINESS_CONTACT } from "@lib/config/business-info"
import { Envelope, MapPin, Phone } from "@medusajs/icons"
import { Heading } from "@modules/common/components/ui"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact")
  return { title: t("metaTitle") }
}

export default async function ContactPage() {
  const t = await getTranslations("Contact")

  return (
    <div className="content-container py-12">
      <div className="max-w-3xl">
        <Heading level="h1" className="text-3xl-semi text-black mb-6">
          {t("title")}
        </Heading>
        <p className="text-large-regular text-gray-600 mb-8">{t("intro")}</p>

        <div className="flex flex-col gap-3">
          <a
            href={`mailto:${BUSINESS_CONTACT.email}`}
            className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-base-regular text-black w-fit"
          >
            <Envelope />
            {BUSINESS_CONTACT.email}
          </a>
          <a
            href={`tel:${BUSINESS_CONTACT.phone}`}
            className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-base-regular text-black w-fit"
          >
            <Phone />
            {BUSINESS_CONTACT.phone}
          </a>
          <div className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-base-regular text-black w-fit">
            <MapPin />
            {BUSINESS_CONTACT.addressLine1}, {BUSINESS_CONTACT.addressLine2}
          </div>
        </div>
      </div>
    </div>
  )
}
