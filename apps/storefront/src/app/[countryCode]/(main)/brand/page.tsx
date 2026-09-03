import { ChatBubbleLeftRight, GlobeEurope, Heart, Language, SparklesSolid } from "@medusajs/icons"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"
import ProductRow from "@modules/home/components/product-row"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Brand")
  return { title: t("metaTitle") }
}

export default async function BrandPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const t = await getTranslations("Brand")
  const tCommon = await getTranslations("Common")

  const region = await getRegion(countryCode)

  const testimonials = t.raw("testimonials") as { quote: string; author: string }[]
  const stats = t.raw("stats") as { value: string; label: string }[]

  const values = [
    {
      Icon: SparklesSolid,
      title: t("value1Title"),
      body: t("value1Body"),
      ctaHref: "/store",
      ctaLabel: t("shopNow"),
    },
    {
      Icon: Heart,
      title: t("value2Title"),
      body: t("value2Body"),
      ctaHref: "/store",
      ctaLabel: t("shopNow"),
    },
    {
      Icon: ChatBubbleLeftRight,
      title: t("value3Title"),
      body: t("value3Body"),
      ctaHref: "/contact",
      ctaLabel: tCommon("contactUs"),
    },
  ]

  const facts = [
    { Icon: GlobeEurope, label: t("factRegions") },
    { Icon: Language, label: t("factLanguages") },
  ]

  let featuredProducts: Awaited<
    ReturnType<typeof listProductsWithSort>
  >["response"]["products"] = []

  if (region) {
    const { response } = await listProductsWithSort({
      page: 1,
      queryParams: { limit: 8 },
      sortBy: "created_at",
      countryCode,
    })
    featuredProducts = response.products
  }

  const heroImage = featuredProducts[0]?.thumbnail
  const storyImage = featuredProducts[1]?.thumbnail

  return (
    <div>
      <div className="w-full grid grid-cols-1 small:grid-cols-2 small:min-h-[440px]">
        <div className="order-2 small:order-1 bg-accent-soft flex flex-col justify-center gap-6 px-6 py-14 small:px-16">
          <h1 className="font-display font-bold text-[28px] leading-[1.15] small:text-[38px] small:leading-[1.15] text-black text-balance max-w-md">
            {t("title")}
          </h1>
          <Text className="max-w-sm text-large-regular text-gray-600">
            {t("intro", { storeName: tCommon("storeName") })}
          </Text>
        </div>
        <div className="order-1 small:order-2 relative aspect-[4/3] small:aspect-auto bg-gray-50">
          {heroImage && (
            <Image
              src={heroImage}
              alt={tCommon("storeName")}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 50vw"
            />
          )}
        </div>
      </div>

      {/*
        DEMO PLACEHOLDER — Brand.stats (messages/*.json) is fabricated
        content so this base template can be previewed complete. Replace
        with real numbers, or remove this section, before launch.
      */}
      <div className="content-container py-12 border-b border-gray-200">
        <div className="grid grid-cols-2 small:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <span className="font-display text-4xl small:text-5xl font-bold text-accent">
                {value}
              </span>
              <span className="text-small-regular text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {storyImage ? (
        <div className="relative w-full py-20 small:py-28">
          <Image
            src={storyImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="content-container relative">
            <div className="max-w-2xl">
              <span className="text-base-semi text-white/70">
                {t("storyHeading")}
              </span>
              <p className="mt-3 font-display text-[24px] leading-[1.3] small:text-[32px] small:leading-[1.3] text-white">
                {t("storyBody")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="content-container py-16 small:py-24">
          <div className="max-w-2xl">
            <span className="text-base-semi text-gray-500">
              {t("storyHeading")}
            </span>
            <p className="mt-3 font-display text-[24px] leading-[1.3] small:text-[32px] small:leading-[1.3] text-black border-s-4 border-accent ps-5">
              {t("storyBody")}
            </p>
          </div>
        </div>
      )}

      <div className="content-container py-16 border-t border-gray-200">
        <Heading level="h2" className="text-xl-semi text-black text-center mb-10">
          {t("valuesHeading")}
        </Heading>
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {values.map(({ Icon, title, body, ctaHref, ctaLabel }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon width={22} height={22} />
              </span>
              <Text className="text-base-semi text-black">{title}</Text>
              <Text className="text-small-regular text-gray-500">{body}</Text>
              <LocalizedClientLink
                href={ctaHref}
                className="text-small-semi text-accent underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                {ctaLabel}
              </LocalizedClientLink>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-y border-gray-200 bg-gray-50 py-8">
        <div className="content-container flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {facts.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-x-2 text-base-regular text-black">
              <Icon width={20} height={20} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {!!featuredProducts.length && region && (
        <div className="content-container py-16">
          <ProductRow
            title={t("featuredHeading")}
            seeAllHref="/store"
            products={featuredProducts}
            region={region}
          />
        </div>
      )}

      {/*
        DEMO PLACEHOLDER — Brand.testimonials (messages/*.json) is fabricated
        content so this base template can be previewed complete. Replace
        with real customer reviews, or remove this section, before launch.
      */}
      <div className="w-full border-t border-gray-200 bg-gray-50 py-16">
        <div className="content-container">
          <Heading level="h2" className="text-xl-semi text-black text-center mb-10">
            {t("testimonialsHeading")}
          </Heading>
          <div className="grid grid-cols-1 small:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonials.map(({ quote, author }) => (
              <div
                key={author}
                className="flex flex-col gap-4 rounded-large bg-white border border-gray-200 p-6"
              >
                <Text className="text-base-regular text-black">
                  &ldquo;{quote}&rdquo;
                </Text>
                <Text className="text-small-semi text-gray-500">
                  {author}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-200 bg-white py-12">
        <div className="content-container flex flex-col items-center gap-4 text-center">
          <Text className="text-large-regular text-black">{t("ctaText")}</Text>
          <LocalizedClientLink href="/store">
            <Button variant="primary">{t("shopNow")}</Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
