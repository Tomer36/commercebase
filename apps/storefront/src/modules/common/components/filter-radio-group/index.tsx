import { RadioGroup } from "@modules/common/components/ui"
import clsx from "clsx"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: string
  handleChange: (value: string) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-3">
      <span className="px-3 text-base-semi text-black">{title}</span>
      <RadioGroup data-testid={dataTestId} className="gap-y-1">
        {items?.map((i) => {
          const active = i.value === value
          return (
            <label
              key={i.value}
              htmlFor={i.value}
              className={clsx(
                "flex w-full cursor-pointer items-center rounded-large px-3 py-2.5 text-base-regular transition-colors duration-150",
                active
                  ? "bg-accent-soft text-accent font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              )}
            >
              <RadioGroup.Item
                checked={active}
                onChange={() => handleChange(i.value)}
                className="sr-only"
                id={i.value}
                value={i.value}
              />
              <span data-testid="radio-label" data-active={active}>
                {i.label}
              </span>
            </label>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
