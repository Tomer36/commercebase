"use client"

import { clx } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

const STEPS = ["address", "delivery", "payment", "review"] as const

const StepIndicator = () => {
  const t = useTranslations("CheckoutSteps")
  const searchParams = useSearchParams()
  const currentStep = searchParams.get("step") ?? "address"
  const currentIndex = STEPS.indexOf(currentStep as (typeof STEPS)[number])

  return (
    <div className="flex items-center" data-testid="checkout-step-indicator">
      {STEPS.map((step, index) => {
        const isCurrent = index === currentIndex
        const isCompleted = currentIndex > index
        return (
          <div key={step} className="flex flex-1 items-center">
            <div
              className={clx(
                "flex h-9 flex-1 items-center justify-center rounded-full text-small-regular transition-colors",
                {
                  "bg-accent-soft text-accent font-semibold":
                    isCurrent || isCompleted,
                  "bg-gray-100 text-gray-500": !isCurrent && !isCompleted,
                }
              )}
            >
              {t(step)}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={clx("h-px w-4 shrink-0 small:w-8", {
                  "bg-accent": isCompleted,
                  "bg-gray-200": !isCompleted,
                })}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepIndicator
