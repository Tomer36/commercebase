"use client"

import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { Input } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const ProductSearch = () => {
  const t = useTranslations("Store")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") ?? "")

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((searchParams.get("q") ?? "") === value) {
        return
      }

      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("q", value)
      } else {
        params.delete("q")
      }

      params.delete("page")

      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    }, 400)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Input
      className="h-10 border-transparent bg-gray-50 focus:bg-white"
      startIcon={<MagnifyingGlass width={18} height={18} />}
      endIcon={value ? <XMark width={14} height={14} /> : undefined}
      onEndIconClick={() => setValue("")}
      endIconLabel={t("clearSearch")}
      placeholder={t("searchPlaceholder")}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      data-testid="product-search-input"
    />
  )
}

export default ProductSearch
