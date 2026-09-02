import { retrieveCustomer } from "@lib/data/customer";
import { Button } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const Hero = async ({
  heroImage,
}: {
  heroImage?: string | null;
}) => {
  const t = await getTranslations("Home");
  const tCommon = await getTranslations("Common");
  const tFooter = await getTranslations("Footer");
  const customer = await retrieveCustomer().catch(() => null);

  return (
    <div className="w-full grid grid-cols-1 small:grid-cols-2 small:min-h-[440px]">
      <div className="order-2 small:order-1 bg-accent text-accent-foreground flex flex-col justify-center gap-5 px-6 py-14 small:px-16">
        <p className="text-base-semi opacity-80">
          {customer?.first_name
            ? t("welcomeBack", { firstName: customer.first_name })
            : tCommon("storeName")}
        </p>
        <h1 className="font-display font-bold text-[28px] leading-[1.15] small:text-[38px] small:leading-[1.15] text-balance max-w-md">
          {t("heroHeadline")}
        </h1>
        <p className="max-w-sm text-large-regular opacity-90">
          {t("heroTagline")}
        </p>
        <div className="flex flex-wrap items-center gap-6 mt-2">
          <LocalizedClientLink href="/store">
            <Button
              variant="secondary"
              size="large"
              className="bg-white text-black border-transparent hover:bg-white/90"
            >
              {t("shopNow")}
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/brand"
            className="text-base-semi underline decoration-white/50 underline-offset-4 hover:decoration-white transition-colors"
          >
            {tFooter("ourStory")}
          </LocalizedClientLink>
        </div>
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
  );
};

export default Hero;
