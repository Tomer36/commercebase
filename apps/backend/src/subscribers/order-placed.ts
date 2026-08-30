import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, OrderWorkflowEvents } from "@medusajs/framework/utils"
import { Resend } from "resend"

// No official Medusa v2 notification module for Resend exists (unlike
// SendGrid), so this talks to Resend directly rather than going through the
// notification module — see the "how to proceed" conversation for why
// Resend was chosen (free indefinitely at this store's volume vs. SendGrid's
// paid-after-trial pricing).
function formatMoney(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)
}

function buildEmailHtml(order: {
  display_id: number
  currency_code: string
  total: number
  items: { title: string; quantity: number; total: number }[]
  shipping_address?: { first_name?: string; last_name?: string } | null
}): string {
  const customerName = order.shipping_address?.first_name
    ? `${order.shipping_address.first_name} ${order.shipping_address.last_name ?? ""}`.trim()
    : "there"

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">${item.title} × ${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${formatMoney(item.total, order.currency_code)}</td>
        </tr>`
    )
    .join("")

  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#111827;">
      <h1 style="font-size:20px;">Thank you, ${customerName}!</h1>
      <p>Your order #${order.display_id} has been placed successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${itemRows}
        <tr>
          <td style="padding:12px 0;font-weight:600;">Total</td>
          <td style="padding:12px 0;font-weight:600;text-align:right;">${formatMoney(order.total, order.currency_code)}</td>
        </tr>
      </table>
    </div>`
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    logger.warn(
      "order-placed subscriber: RESEND_API_KEY is not set, skipping confirmation email."
    )
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    filters: { id: data.id },
    fields: [
      "display_id",
      "email",
      "currency_code",
      "total",
      "items.title",
      "items.quantity",
      "items.total",
      "shipping_address.first_name",
      "shipping_address.last_name",
    ],
  })

  if (!order?.email) {
    logger.warn(`order-placed subscriber: order ${data.id} has no email, skipping.`)
    return
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to: order.email,
    subject: `Order confirmation #${order.display_id}`,
    html: buildEmailHtml(order as any),
  })

  if (error) {
    logger.error(`order-placed subscriber: failed to send confirmation email — ${error.message}`)
  }
}

export const config: SubscriberConfig = {
  event: OrderWorkflowEvents.PLACED,
}
