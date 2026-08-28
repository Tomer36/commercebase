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
      <span className="text-sm font-medium text-black">{title}</span>
      <RadioGroup data-testid={dataTestId} className="gap-y-2">
        {items?.map((i) => {
          const active = i.value === value
          return (
            <label
              key={i.value}
              htmlFor={i.value}
              className="flex cursor-pointer items-center gap-x-2"
            >
              <span
                className={clsx(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                  active ? "border-accent" : "border-gray-300"
                )}
              >
                {active && (
                  <span className="h-2 w-2 rounded-full bg-accent" />
                )}
              </span>
              <RadioGroup.Item
                checked={active}
                onChange={() => handleChange(i.value)}
                className="sr-only"
                id={i.value}
                value={i.value}
              />
              <span
                className={clsx(
                  "text-sm",
                  active ? "text-black" : "text-gray-500"
                )}
                data-testid="radio-label"
                data-active={active}
              >
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
