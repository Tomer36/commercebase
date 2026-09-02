"use client"

import { requestOtp, verifyOtp } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useActionState } from "react"

const PhoneLogin = () => {
  const t = useTranslations("Auth")
  const tCommon = useTranslations("Common")
  const router = useRouter()

  const [phone, setPhone] = useState<string | null>(null)

  const [sendState, sendAction] = useActionState(requestOtp, null)
  const [verifyState, verifyAction] = useActionState(
    verifyOtp.bind(null, phone ?? ""),
    null
  )

  useEffect(() => {
    if (sendState?.state === "code_sent") {
      setPhone(sendState.phone)
    }
  }, [sendState])

  useEffect(() => {
    if (verifyState?.state === "success" && verifyState.isNewCustomer) {
      router.push("/account/profile")
    }
  }, [verifyState, router])

  const step = phone ? "code" : "phone"

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">{t("welcomeBack")}</h1>

      {step === "phone" && (
        <>
          <p className="text-center text-base-regular text-black mb-8">
            {t("signInPrompt")}
          </p>
          <form className="w-full" action={sendAction}>
            <Input
              label={t("phone")}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              data-testid="phone-input"
            />
            <ErrorMessage
              error={sendState?.state === "error" ? sendState.error : null}
              data-testid="send-otp-error-message"
            />
            <span className="block text-center text-black text-small-regular mt-6">
              {t.rich("agreeToTermsContinue", {
                storeName: tCommon("storeName"),
                privacyLink: (chunks) => (
                  <LocalizedClientLink
                    href="/content/privacy-policy"
                    className="underline"
                  >
                    {chunks}
                  </LocalizedClientLink>
                ),
                termsLink: (chunks) => (
                  <LocalizedClientLink
                    href="/content/terms-of-use"
                    className="underline"
                  >
                    {chunks}
                  </LocalizedClientLink>
                ),
              })}
            </span>
            <SubmitButton data-testid="send-otp-button" className="w-full mt-6">
              {t("sendCode")}
            </SubmitButton>
          </form>
        </>
      )}

      {step === "code" && (
        <>
          <p className="text-center text-base-regular text-black mb-8">
            {t("codeSentTo", { phone: phone ?? "" })}
          </p>
          <form className="w-full" action={verifyAction}>
            <Input
              label={t("enterCode")}
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              data-testid="otp-code-input"
            />
            <ErrorMessage
              error={verifyState?.state === "error" ? verifyState.error : null}
              data-testid="verify-otp-error-message"
            />
            <SubmitButton
              data-testid="verify-otp-button"
              className="w-full mt-6"
            >
              {t("verify")}
            </SubmitButton>
          </form>
          <div className="flex items-center gap-x-4 mt-6 text-small-regular">
            <form action={sendAction}>
              <input type="hidden" name="phone" value={phone ?? ""} />
              <button
                type="submit"
                className="underline text-black"
                data-testid="resend-otp-button"
              >
                {t("resendCode")}
              </button>
            </form>
            <button
              type="button"
              onClick={() => setPhone(null)}
              className="underline text-black"
              data-testid="change-number-button"
            >
              {t("changeNumber")}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default PhoneLogin
