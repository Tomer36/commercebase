import { useTranslations } from "next-intl"

type QuantitySelectorProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max,
  disabled,
}: QuantitySelectorProps) => {
  const t = useTranslations("ProductActions")

  const decrement = () => onChange(Math.max(min, value - 1))
  const increment = () => onChange(max ? Math.min(max, value + 1) : value + 1)

  return (
    <div className="flex h-12 w-fit items-stretch divide-x divide-gray-200 rounded-rounded border border-gray-200">
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label={t("decreaseQuantity")}
        className="flex w-10 items-center justify-center text-large-regular text-black disabled:opacity-30"
      >
        −
      </button>
      <span className="flex w-10 items-center justify-center text-large-regular text-black">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || (max !== undefined && value >= max)}
        aria-label={t("increaseQuantity")}
        className="flex w-10 items-center justify-center text-large-regular text-black disabled:opacity-30"
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector
