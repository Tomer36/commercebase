import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const t = useTranslations("ProductActions")

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm text-black">{t("selectPrefix", { title })}</span>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const selected = v === current
          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "flex h-10 items-center justify-center rounded-full border px-4 text-sm transition-colors",
                selected
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-gray-200 bg-white text-black hover:border-gray-400"
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
