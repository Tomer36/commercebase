import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { BUSINESS_CONTACT, SOCIAL_LINKS } from "@lib/config/business-info";
import { EXCLUDED_CATEGORY_HANDLES } from "@lib/util/excluded-categories";
import { Text, clx } from "@modules/common/components/ui";
import { getTranslations } from "next-intl/server";

import LocalizedClientLink from "@modules/common/components/localized-client-link";

export default async function Footer() {
  const [{ collections }, allCategories, t, tCommon] = await Promise.all([
    listCollections({ fields: "*products" }),
    listCategories(),
    getTranslations("Footer"),
    getTranslations("Common"),
  ]);

  const socialEntries = Object.entries(SOCIAL_LINKS).filter(([, url]) => url);

  const productCategories = allCategories.filter(
    (category) => !EXCLUDED_CATEGORY_HANDLES.includes(category.handle ?? "")
  );

  return (
    <footer className="hidden small:block border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-40">
          <div>
            <LocalizedClientLink
              href="/"
              className="text-xl-semi text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            >
              {tCommon("storeName")}
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-10 medium:gap-x-16 grid grid-cols-2 small:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-small-semi text-ui-fg-base">
                  {t("categories")}
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
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
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ui-fg-base",
                            children && "text-small-semi"
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
                                    className="hover:text-ui-fg-base"
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
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-small-semi text-ui-fg-base">
                  {t("collections")}
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
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
              <span className="text-small-semi text-ui-fg-base">
                {t("contact")}
              </span>
              <ul className="grid grid-cols-1 gap-2 text-ui-fg-subtle">
                <li>
                  <a
                    className="hover:text-ui-fg-base"
                    href={`mailto:${BUSINESS_CONTACT.email}`}
                  >
                    {BUSINESS_CONTACT.email}
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-ui-fg-base"
                    href={`tel:${BUSINESS_CONTACT.phone}`}
                  >
                    {BUSINESS_CONTACT.phone}
                  </a>
                </li>
                {socialEntries.length > 0 && (
                  <li className="flex flex-col gap-2 mt-2">
                    {socialEntries.map(([platform, url]) => (
                      <a
                        key={platform}
                        className="hover:text-ui-fg-base capitalize"
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {platform}
                      </a>
                    ))}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 w-full mb-16 text-ui-fg-muted">
          <ul className="flex gap-x-6 text-small-regular">
            <li>
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/content/privacy-policy"
              >
                {t("privacyPolicy")}
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/content/terms-of-use"
              >
                {t("termsOfUse")}
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
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
