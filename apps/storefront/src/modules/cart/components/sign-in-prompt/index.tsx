import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslations } from "next-intl/server"

const SignInPrompt = async () => {
  const t = await getTranslations("SignInPrompt")
  const tAuth = await getTranslations("Auth")

  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          {t("alreadyHaveAccount")}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          {t("betterExperience")}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
            {tAuth("signIn")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
