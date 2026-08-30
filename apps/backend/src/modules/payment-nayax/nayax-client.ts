// Integration with Nayax's hosted-payment-page API (Lynx) —
// https://developerhub.nayax.com/. This is the one file that knows about
// this vendor; swapping payment providers later means rewriting this file
// (and its constructor options) — service.ts never talks HTTP directly.
//
// Confirmed vendor behavior (from Nayax's own docs):
// - Checkout happens on Nayax's Hosted Payment Page (iframe or an "Initiate
//   Payment Form") — the merchant site is never PCI-scoped.
// - Refunds go through the Lynx API and land in a pending/approval state
//   rather than completing immediately — a refund call here does not mean
//   money has actually moved yet.
//
// TODO: the endpoint paths and request/response shapes below (aside from
// the refund fields, which are confirmed from Nayax's Lynx API docs) are
// placeholders pending this client's actual Nayax merchant/site setup —
// verify against https://developerhub.nayax.com/ before going live.

const BASE_URL = "https://api.nayax.com" // TODO: confirm real base URL (Lynx vs. Cortina API)

export type NayaxClientOptions = {
  apiKey: string
  siteId: string
}

export type NayaxCreateSessionResult = {
  transactionId: string
  hostedPageUrl: string
}

export class NayaxClient {
  private apiKey: string
  private siteId: string

  constructor(options: NayaxClientOptions) {
    this.apiKey = options.apiKey
    this.siteId = options.siteId
  }

  private async post(path: string, body: Record<string, unknown>): Promise<any> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ SiteId: this.siteId, ...body }),
    })

    return response.json()
  }

  // Creates the hosted-payment-page session the customer gets redirected to.
  async createSession(
    amount: number,
    currencyCode: string,
    orderReference: string
  ): Promise<NayaxCreateSessionResult> {
    // TODO: confirm real path + field names for session creation.
    const result = await this.post("/payment/session", {
      Amount: amount,
      CurrencyCode: currencyCode.toUpperCase(),
      OrderReference: orderReference,
    })

    return {
      transactionId: result.TransactionId,
      hostedPageUrl: result.HostedPageUrl,
    }
  }

  async getStatus(transactionId: string): Promise<string> {
    // TODO: confirm real path/fields and the vendor's actual status values.
    const result = await this.post("/payment/status", { TransactionId: transactionId })
    return result.Status
  }

  // Confirmed field names from Nayax's Lynx "Request Refunds" API. Refunds
  // land in a pending state — a notification email goes out and the refund
  // requires separate approval/decline on Nayax's side, it does not
  // complete synchronously.
  async requestRefund(
    transactionId: string,
    machineAuTime: string,
    amount: number,
    reason: string,
    notifyEmails: string[]
  ): Promise<void> {
    await this.post("/lynx/refunds", {
      TransactionId: transactionId,
      MachineAuTime: machineAuTime,
      RefundAmount: amount,
      RefundReason: reason,
      RefundEmailList: notifyEmails,
    })
  }
}
