import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { BUSINESS_CONTACT, SOCIAL_LINKS } from "@lib/config/business-info";
import { EXCLUDED_CATEGORY_HANDLES } from "@lib/util/excluded-categories";
import TrustBadges from "@modules/common/components/trust-badges";
import Facebook from "@modules/common/icons/facebook";
import Instagram from "@modules/common/icons/instagram";
import TikTok from "@modules/common/icons/tiktok";
import { Text, clx } from "@modules/common/components/ui";
import { getTranslations } from "next-intl/server";

import LocalizedClientLink from "@modules/common/components/localized-client-link";

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: TikTok,
} as const;

export default async function Footer() {
  const [{ collections }, allCategories, t, tCommon, tContact, tCustomerService] =
    await Promise.all([
      listCollections({ fields: "*products" }),
      listCategories(),
      getTranslations("Footer"),
      getTranslations("Common"),
      getTranslations("Contact"),
      getTranslations("CustomerService"),
    ]);

  const socialEntries = Object.entries(SOCIAL_LINKS).filter(([, url]) => url);

  const productCategories = allCategories.filter(
    (category) => !EXCLUDED_CATEGORY_HANDLES.includes(category.handle ?? "")
  );

  // One unified grid instead of a brand block and a link-columns block
  // pushed to opposite ends of the row (`justify-between` on a max-w-1440px
  // container reads as two disconnected islands with a huge dead gap
  // between them on wide screens). Column count adapts to whether a
  // Collections column actually exists, so an empty store never leaves a
  // orphaned blank grid track.
  const columnCount = 2 + (productCategories.length > 0 ? 1 : 0) + (collections.length > 0 ? 1 : 0)

  return (
    <footer className="border-t border-gray-200 w-full">
      <div className="content-container flex flex-col w-full">
        <div
          className={clx(
            "hidden small:grid grid-cols-2 gap-x-10 gap-y-10 py-16",
            columnCount >= 4 ? "small:grid-cols-4" : "small:grid-cols-3"
          )}
        >
          <div className="flex flex-col gap-y-2">
            <LocalizedClientLink
              href="/"
              className="text-xl-semi text-black hover:text-gray-600 uppercase"
            >
              {tCommon("storeName")}
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/brand"
              className="text-small-regular text-gray-600 hover:text-black w-fit"
            >
              {t("ourStory")}
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account"
              className="text-small-regular text-gray-600 hover:text-black w-fit"
            >
              {tCommon("account")}
            </LocalizedClientLink>
          </div>
          {productCategories.length > 0 && (
            <div className="flex flex-col gap-y-2">
              <span className="text-small-semi text-black">
                {t("categories")}
              </span>
              <ul
                className="grid grid-cols-1 gap-2 text-small-regular"
                data-testid="footer-categories"
              >
                {productCategories?.slice(0, 6).map((c) => {
                  if (c.parent_category) {
                    return;
                  }

                  const children =
                    c.category_children?.map((child) => ({
                      name: child.name,
                      handle: child.handle,
                      id: child.id,
                    })) || null;

                  return (
                    <li className="flex flex-col gap-2 text-gray-600" key={c.id}>
                      <LocalizedClientLink
                        className={clx(
                          "hover:text-black",
                          children && "text-small-semi text-black"
                        )}
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                      {children && (
                        <ul className="grid grid-cols-1 ms-3 gap-2">
                          {children &&
                            children.map((child) => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  className="hover:text-black"
                                  href={`/categories/${child.handle}`}
                                  data-testid="category-link"
                                >
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {collections.length > 0 && (
            <div className="flex flex-col gap-y-2">
              <span className="text-small-semi text-black">
                {t("collections")}
              </span>
              <ul
                className={clx(
                  "grid grid-cols-1 gap-2 text-small-regular text-gray-600",
                  {
                    "grid-cols-2": collections.length > 3,
                  }
                )}
              >
                {collections?.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="hover:text-black"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col gap-y-2">
            <span className="text-small-semi text-black">{t("contact")}</span>
            <ul className="grid grid-cols-1 gap-2 text-small-regular text-gray-600">
              <li>
                <a
                  className="hover:text-black"
                  href={`mailto:${BUSINESS_CONTACT.email}`}
                >
                  {BUSINESS_CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-black"
                  href={`tel:${BUSINESS_CONTACT.phone}`}
                >
                  {BUSINESS_CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 py-6 flex flex-col small:flex-row small:items-center small:justify-between gap-4">
          <TrustBadges bordered={false} />
          {socialEntries.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-small-semi text-black">
                {t("followUs")}
              </span>
              <div className="flex items-center gap-2">
                {socialEntries.map(([platform, url]) => {
                  const Icon = SOCIAL_ICONS[platform as keyof typeof SOCIAL_ICONS]
                  if (!Icon) {
                    return null
                  }
                  return (
                    <a
                      key={platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-black hover:bg-black hover:text-white"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={platform}
                    >
                      <Icon size="16" />
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-4 w-full border-t border-gray-200 py-6 text-gray-400">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-small-regular">
            <li>
              <LocalizedClientLink
                className="hover:text-black"
                href="/contact"
              >
                {tContact("title")}
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                className="hover:text-black"
                href="/customer-service"
              >
                {tCustomerService("title")}
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                className="hover:text-black"
                href="/content/privacy-policy"
              >
                {t("privacyPolicy")}
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                className="hover:text-black"
                href="/content/terms-of-use"
              >
                {t("termsOfUse")}
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                className="hover:text-black"
                href="/accessibility-statement"
              >
                {t("accessibilityStatement")}
              </LocalizedClientLink>
            </li>
          </ul>
          <Text className="text-small-regular">
            {tCommon("copyright", {
              year: new Date().getFullYear(),
              storeName: tCommon("storeName"),
            })}
          </Text>
        </div>
      </div>
    </footer>
  );
}
