"use client"
import { setAddresses } from "@lib/data/cart"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid, Spinner } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import { Heading, Text } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const t = useTranslations("Address")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row items-center text-xl-semi text-black gap-x-2"
        >
          {t("shippingAddress")}
          {!isOpen && <CheckCircleSolid className="text-accent" width={20} height={20} />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-accent transition-opacity hover:opacity-70"
              data-testid="edit-address-button"
            >
              {t("edit")}
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-xl-semi text-black gap-x-4 pb-6 pt-8"
                >
                  {t("billingAddress")}
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6" data-testid="submit-address-button">
              {t("continueToDelivery")}
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex flex-col gap-y-4 small:flex-row small:gap-x-8 small:gap-y-0 w-full">
                  <div
                    className="flex flex-col w-full small:w-1/3"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="text-small-semi text-black mb-1">
                      {t("shippingAddress")}
                    </Text>
                    <Text className="text-small-regular text-gray-500">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="text-small-regular text-gray-500">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="text-small-regular text-gray-500">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="text-small-regular text-gray-500">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-full small:w-1/3"
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="text-small-semi text-black mb-1">
                      {t("contact")}
                    </Text>
                    <Text className="text-small-regular text-gray-500">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="text-small-regular text-gray-500">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-full small:w-1/3"
                    data-testid="billing-address-summary"
                  >
                    <Text className="text-small-semi text-black mb-1">
                      {t("billingAddressLabel")}
                    </Text>

                    {sameAsBilling ? (
                      <Text className="text-small-regular text-gray-500">
                        {t("sameAsBillingSummary")}
                      </Text>
                    ) : (
                      <>
                        <Text className="text-small-regular text-gray-500">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="text-small-regular text-gray-500">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </Text>
                        <Text className="text-small-regular text-gray-500">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </Text>
                        <Text className="text-small-regular text-gray-500">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
              </div>
            ) : (
              <div>
                <Spinner className="animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
