"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import { HttpTypes } from "@medusajs/types"
import ProductSearch from "@modules/store/components/product-search"
import CategoryFilter from "./category-filter"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  categories?: HttpTypes.StoreProductCategory[]
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  search = false,
  categories,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateQueryParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)

      params.delete("page")

      const queryString = params.toString()
      const currentQuery = searchParams.toString()
      const nextPath = queryString ? `${pathname}?${queryString}` : pathname
      const currentPath = currentQuery
        ? `${pathname}?${currentQuery}`
        : pathname

      if (nextPath !== currentPath) {
        router.push(nextPath)
      }
    },
    [pathname, router, searchParams]
  )

  const setQueryParams = (name: string, value: string) =>
    updateQueryParams((params) => params.set(name, value))

  return (
    <div className="flex flex-col gap-12 py-4 mb-8 small:px-0 ps-6 small:pe-8 small:min-w-[250px] small:ms-7">
      {search && <ProductSearch />}
      {!!categories?.length && <CategoryFilter categories={categories} />}
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </div>
  )
}

export default RefinementList
