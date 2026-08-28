import { Label } from "@modules/common/components/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"

import { Eye, EyeSlash as EyeOff } from "@medusajs/icons"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched: _touched, required, topLabel, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 text-small-regular font-semibold text-black">{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            className="peer block w-full h-14 px-4 pt-5 pb-2 bg-white border rounded-rounded appearance-none text-base-regular text-black focus:outline-none focus:ring-2 focus:ring-accent border-gray-200 hover:border-gray-300 transition-colors duration-150"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            className="absolute start-4 top-1/2 -translate-y-1/2 text-base-regular text-gray-500 transition-all duration-150 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xsmall-regular peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xsmall-regular"
          >
            {label}
            {required && <span className="text-red-700">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 px-4 focus:outline-none transition-all duration-150 outline-none focus:text-black absolute end-0 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
