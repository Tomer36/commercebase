"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const t = useTranslations("OrderDetails")

  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        {t("confirmationSentTo")}{" "}
        <span
          className="text-black font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        {t("orderDate")}{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-accent">
        {t("orderNumber")}{" "}
        <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-small-regular gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              {t("orderStatus")}{" "}
              <span className="text-gray-500" data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              {t("paymentStatus")}{" "}
              <span
                className="text-gray-500"
                sata-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
