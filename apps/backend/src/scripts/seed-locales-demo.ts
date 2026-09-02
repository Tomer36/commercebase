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
  "vitamin-c-brightening-serum": {
    "he-IL": {
      title: "סרום ויטמין C מבהיר",
      description:
        "מוצר בדיקה - סרום נוגד חמצון שמטפל בעמימות ובגוון עור לא אחיד.",
    },
    "ar-SA": {
      title: "سيروم فيتامين سي المفتح",
      description:
        "منتج اختبار - سيروم مضاد للأكسدة يعالج البهتان وعدم توحد لون البشرة.",
    },
  },
  "retinol-renewal-serum": {
    "he-IL": {
      title: "סרום רטינול לחידוש העור",
      description:
        "מוצר בדיקה - סרום רטינול לשימוש לילי לשיפור מרקם העור וקמטים עדינים.",
    },
    "ar-SA": {
      title: "سيروم الريتينول للتجديد",
      description:
        "منتج اختبار - سيروم ريتينول ليلي لتحسين ملمس البشرة والخطوط الدقيقة.",
    },
  },
  "foaming-cleanser": {
    "he-IL": {
      title: "מנקה קצף יומי",
      description: "מוצר בדיקה - מנקה קצף יומי לעור רגיל עד שמן.",
    },
    "ar-SA": {
      title: "منظف رغوي يومي",
      description: "منتج اختبار - منظف رغوي يومي للبشرة العادية إلى الدهنية.",
    },
  },
  "micellar-water": {
    "he-IL": {
      title: "מי מיצלה",
      description: "מוצר בדיקה - מי מיצלה ללא שטיפה להסרת איפור.",
    },
    "ar-SA": {
      title: "ماء ميسيلار",
      description: "منتج اختبار - ماء ميسيلار بدون شطف لإزالة المكياج.",
    },
  },
  "daily-moisture-cream": {
    "he-IL": {
      title: "קרם לחות יומי",
      description: "מוצר בדיקה - קרם לחות יומי קליל לכל סוגי העור.",
    },
    "ar-SA": {
      title: "كريم ترطيب يومي",
      description: "منتج اختبار - كريم ترطيب يومي خفيف لجميع أنواع البشرة.",
    },
  },
  "night-repair-cream": {
    "he-IL": {
      title: "קרם לילה משקם",
      description: "מוצר בדיקה - קרם לילה עשיר לעור יבש.",
    },
    "ar-SA": {
      title: "كريم ليلي مجدد",
      description: "منتج اختبار - كريم ليلي غني للبشرة الجافة.",
    },
  },
  "led-facial-device": {
    "he-IL": {
      title: "מכשיר LED לפנים",
      description: "מוצר בדיקה - מכשיר טיפולי אור LED לשימוש ביתי.",
    },
    "ar-SA": {
      title: "جهاز LED للوجه",
      description: "منتج اختبار - جهاز علاج بالضوء LED للاستخدام المنزلي.",
    },
  },
  "jade-facial-roller": {
    "he-IL": {
      title: "גלגלת יאדה לפנים",
      description: "מוצר בדיקה - גלגלת יאדה לעיסוי לימפתי.",
    },
    "ar-SA": {
      title: "أسطوانة اليشم للوجه",
      description: "منتج اختبار - أسطوانة يشم لتدليك الجهاز الليمفاوي.",
    },
  },
  "skincare-starter-kit": {
    "he-IL": {
      title: "ערכת התחלה לטיפוח עור",
      description: "מוצר בדיקה - סט אוצר של מנקה, סרום וקרם לחות.",
    },
    "ar-SA": {
      title: "طقم بداية للعناية بالبشرة",
      description: "منتج اختبار - مجموعة مختارة من المنظف والسيروم ومرطب.",
    },
  },
  "radiance-gift-box": {
    "he-IL": {
      title: "קופסת מתנה לזוהר",
      description: "מוצר בדיקה - קופסת מתנה הכוללת סרום מבהיר וקרם לחות.",
    },
    "ar-SA": {
      title: "علبة هدايا للإشراقة",
      description:
        "منتج اختبار - علبة هدايا تحتوي على سيروم مفتح وكريم ترطيب.",
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
      try {
        await translationModuleService.createTranslations({
          reference_id: product.id,
          reference: "product",
          locale_code,
          translations,
        })
      } catch (e) {
        logger.warn(
          `Translation for ${product.handle} (${locale_code}) may already exist, skipping: ${(e as Error).message}`
        )
      }
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
      try {
        await translationModuleService.createTranslations({
          reference_id: category.id,
          reference: "product_category",
          locale_code,
          translations: { name },
        })
      } catch (e) {
        logger.warn(
          `Translation for ${category.name} (${locale_code}) may already exist, skipping: ${(e as Error).message}`
        )
      }
    }
  }

  logger.info("Finished seeding locales and translations.")
}
