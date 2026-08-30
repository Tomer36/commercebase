// Integration with Grow (formerly Meshulam), an Israeli hosted-checkout
// payment gateway — https://grow-il.readme.io/. This is the one file that
// knows about this vendor; swapping payment providers later means rewriting
// this file (and its constructor options) — service.ts never talks HTTP
// directly.
//
// Confirmed vendor quirks (from Grow's own docs) that shaped this client:
// - Requests are FormData, not JSON.
// - Calls must be made server-side only (never from the storefront).
// - After the customer completes payment on Grow's hosted page, a separate
//   "approve" call is required server-side to finalize the transaction —
//   easy to miss, and skipping it is a commonly reported integration bug.
//
// TODO: the exact endpoint paths, field names, and response shapes below
// are placeholders pending Grow's current API reference for this specific
// client's account (sandbox vs. live base URL, required page/terminal
// codes, etc.) — verify each against https://grow-il.readme.io/ before
// going live.

const LIVE_BASE_URL = "https://api.grow-il.com" // TODO: confirm real base URL
const SANDBOX_BASE_URL = "https://sandbox.grow-il.com" // TODO: confirm real sandbox URL

export type GrowClientOptions = {
  apiKey: string
  pageCode: string
  useSandbox?: boolean
}

export type GrowCreatePageResult = {
  transactionId: string
  redirectUrl: string
}

export class GrowClient {
  private apiKey: string
  private pageCode: string
  private baseUrl: string

  constructor(options: GrowClientOptions) {
    this.apiKey = options.apiKey
    this.pageCode = options.pageCode
    this.baseUrl = options.useSandbox ? SANDBOX_BASE_URL : LIVE_BASE_URL
  }

  private async postForm(path: string, fields: Record<string, string>): Promise<any> {
    const body = new FormData()
    body.append("apiKey", this.apiKey)
    body.append("pageCode", this.pageCode)
    for (const [key, value] of Object.entries(fields)) {
      body.append(key, value)
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      body,
    })

    return response.json()
  }

  // Creates the hosted payment page the customer gets redirected to.
  async createPaymentPage(
    amount: number,
    currencyCode: string,
    orderReference: string
  ): Promise<GrowCreatePageResult> {
    // TODO: real path + field names (this shape is a reasonable guess based
    // on Grow's documented "payment page" concept, not verified against a
    // live account).
    const result = await this.postForm("/payments/create", {
      sum: amount.toString(),
      currency: currencyCode.toUpperCase(),
      orderReference,
    })

    return {
      transactionId: result.transactionId,
      redirectUrl: result.url,
    }
  }

  // The mandatory post-redirect confirmation step — without this call the
  // transaction stays unconfirmed on Grow's side even though the customer
  // completed payment.
  async approveTransaction(transactionId: string): Promise<void> {
    // TODO: confirm real path/fields for the "approveTransaction" step.
    await this.postForm("/payments/approve", { transactionId })
  }

  async refund(transactionId: string, amount: number): Promise<void> {
    // TODO: confirm real path/fields for refunds.
    await this.postForm("/payments/refund", {
      transactionId,
      sum: amount.toString(),
    })
  }

  async getStatus(transactionId: string): Promise<string> {
    // TODO: confirm real path/fields and the vendor's actual status values.
    const result = await this.postForm("/payments/status", { transactionId })
    return result.status
  }
}
