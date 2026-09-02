import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import AccessibilityWidget from "@modules/layout/components/accessibility-widget"
import CartBadge from "@modules/layout/components/cart-badge"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import MobileTabBar from "@modules/layout/components/mobile-tab-bar"
import WhatsAppButton from "@modules/layout/components/whatsapp-button"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  const cartItemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      <div className="pb-16 small:pb-0">
        {props.children}
        <Footer />
      </div>
      <MobileTabBar cartBadge={<CartBadge count={cartItemCount} />} />
      <AccessibilityWidget />
      <WhatsAppButton />
    </>
  )
}
