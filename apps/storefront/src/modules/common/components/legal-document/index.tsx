import { Heading, Text } from "@modules/common/components/ui"

export type LegalSection = {
  title: string
  lead?: string
  bullets?: string[]
  note?: string
}

/**
 * Shared renderer for Privacy Policy / Terms of Use — both are structured
 * the same way (a title, an intro, then numbered sections each with an
 * optional lead sentence, a bullet list, and/or a callout note). Content
 * comes from next-intl's t.raw() so it stays fully translatable per
 * locale, not hardcoded here.
 */
const LegalDocument = ({
  title,
  intro,
  sections,
}: {
  title: string
  intro?: string[]
  sections: LegalSection[]
}) => {
  return (
    <div className="content-container py-12">
      <div className="max-w-3xl flex flex-col gap-10">
        <Heading level="h1" className="text-3xl-semi text-black">
          {title}
        </Heading>

        {!!intro?.length && (
          <div className="flex flex-col gap-3">
            {intro.map((paragraph, i) => (
              <Text key={i} className="text-base-regular text-gray-600">
                {paragraph}
              </Text>
            ))}
          </div>
        )}

        {sections.map((section, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Heading level="h2" className="text-large-semi text-black">
              {section.title}
            </Heading>
            {section.lead && (
              <Text className="text-base-regular text-gray-600">
                {section.lead}
              </Text>
            )}
            {!!section.bullets?.length && (
              <ul className="flex flex-col gap-2 list-disc ps-5 text-base-regular text-gray-600">
                {section.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            )}
            {section.note && (
              <p className="text-base-semi text-accent bg-accent-soft rounded-large px-4 py-3">
                {section.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LegalDocument
