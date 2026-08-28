"use client"

import { Table, Text } from "@modules/common/components/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Spinner } from "@medusajs/icons"
import QuantitySelector from "@modules/products/components/quantity-selector"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  if (type === "full") {
    return (
      <div
        className="flex gap-4 border-b border-gray-200 py-4 last:border-0"
        data-testid="product-row"
      >
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="w-20 h-20 shrink-0 small:w-24 small:h-24"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            alt={item.product_title}
          />
        </LocalizedClientLink>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Text
                className="text-black font-medium"
                data-testid="product-title"
              >
                {item.product_title}
              </Text>
              <LineItemOptions
                variant={item.variant}
                data-testid="product-variant"
              />
            </div>
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>

          <div className="flex items-center gap-3">
            <QuantitySelector
              value={item.quantity}
              onChange={changeQuantity}
              min={1}
              max={maxQuantity}
              disabled={updating}
            />
            {updating && <Spinner className="animate-spin" />}
            <DeleteButton id={item.id} data-testid="product-delete-button" />
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </div>
      </div>
    )
  }

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!ps-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="flex w-16"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            alt={item.product_title}
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-start">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      <Table.Cell className="!pe-0">
        <span className="!pe-0 flex flex-col items-end h-full justify-center">
          <span className="flex gap-x-1">
            <Text className="text-ui-fg-muted">{item.quantity}x </Text>
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
