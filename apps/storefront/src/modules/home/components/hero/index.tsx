import { retrieveCustomer } from "@lib/data/customer";
import { Button, Heading } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { getTranslations } from "next-intl/server";

const Hero = async () => {
  const t = await getTranslations("Home");
  const tCommon = await getTranslations("Common");
  const customer = await retrieveCustomer().catch(() => null);

  return (
    <div className="w-full border-b border-gray-200 bg-white py-8">
      <div className="content-container flex flex-col items-center gap-3 text-center">
        <Heading level="h1" className="text-3xl-semi text-black">
          {customer?.first_name
            ? t("welcomeBack", { firstName: customer.first_name })
            : tCommon("storeName")}
        </Heading>
        <Heading level="h2" className="text-large-regular text-gray-500">
          {t("heroTagline")}
        </Heading>
        <LocalizedClientLink href="/store">
          <Button variant="primary">{t("shopNow")}</Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default Hero;
