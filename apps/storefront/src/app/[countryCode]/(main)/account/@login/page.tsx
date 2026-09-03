import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Common")
  return {
    title: "Sign in",
    description: `Sign in to your ${t("storeName")} account.`,
  }
}

export default function Login() {
  return <LoginTemplate />
}
