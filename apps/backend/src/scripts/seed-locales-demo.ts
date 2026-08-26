import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const LOCALES = ["en-US", "he-IL", "ar-SA"]

const PRODUCT_TRANSLATIONS: Record<
  string,
  Record<string, { title: string; description: string }>
> = {
  "hydrating-serum": {
    "he-IL": {
      title: "סרום לחות",
      description:
        "מוצר בדיקה - סרום קל משקל ללחות העור עם חומצה היאלורונית.",
    },
    "ar-SA": {
      title: "سيروم مرطب",
      description:
        "منتج اختبار - سيروم مرطب خفيف الوزن يحتوي على حمض الهيالورونيك.",
    },
  },
  "gentle-cleanser": {
    "he-IL": {
      title: "מנקה עדין",
      description: "מוצר בדיקה - מנקה פנים יומי עדין לעור רגיש.",
    },
    "ar-SA": {
      title: "منظف لطيف",
      description: "منتج اختبار - منظف وجه يومي لطيف للبشرة الحساسة.",
    },
  },
}

const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  Skincare: { "he-IL": "טיפוח עור", "ar-SA": "العناية بالبشرة" },
  Cleansers: { "he-IL": "מנקים", "ar-SA": "منظفات" },
  Serums: { "he-IL": "סרומים", "ar-SA": "سيرومات" },
  Moisturizers: { "he-IL": "קרמי לחות", "ar-SA": "مرطبات" },
}

export default async function seed_locales_demo({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModuleService = container.resolve(Modules.STORE)
  const translationModuleService = container.resolve(Modules.TRANSLATION)

  logger.info("Configuring store supported locales...")
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id"],
  })
  const store = stores[0]

  await storeModuleService.updateStores({
    id: store.id,
    supported_locales: LOCALES.map((locale_code) => ({ locale_code })),
  })

  logger.info("Activating translation settings for product and category...")
  try {
    await translationModuleService.createTranslationSettings([
      { entity_type: "product", fields: ["title", "description"], is_active: true },
      { entity_type: "product_category", fields: ["name", "description"], is_active: true },
    ])
  } catch (e) {
    logger.warn(`Translation settings may already exist, skipping: ${(e as Error).message}`)
  }

  logger.info("Creating product translations...")
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: Object.keys(PRODUCT_TRANSLATIONS) },
  })

  for (const product of products) {
    const localeMap = PRODUCT_TRANSLATIONS[product.handle!]
    if (!localeMap) continue
    for (const [locale_code, translations] of Object.entries(localeMap)) {
      await translationModuleService.createTranslations({
        reference_id: product.id,
        reference: "product",
        locale_code,
        translations,
      })
    }
  }

  logger.info("Creating category translations...")
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: Object.keys(CATEGORY_TRANSLATIONS) },
  })

  for (const category of categories) {
    const localeMap = CATEGORY_TRANSLATIONS[category.name]
    if (!localeMap) continue
    for (const [locale_code, name] of Object.entries(localeMap)) {
      await translationModuleService.createTranslations({
        reference_id: category.id,
        reference: "product_category",
        locale_code,
        translations: { name },
      })
    }
  }

  logger.info("Finished seeding locales and translations.")
}
