import { AbstractPaymentProvider, MedusaError, BigNumber } from "@medusajs/framework/utils"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import type { Logger } from "@medusajs/framework/types"
import { GrowClient, GrowClientOptions } from "./grow-client"

type InjectedDependencies = {
  logger: Logger
}

class GrowPaymentService extends AbstractPaymentProvider<GrowClientOptions> {
  static identifier = "grow"

  protected logger_: Logger
  protected client_: GrowClient

  static validateOptions(options: Record<string, unknown>) {
    if (!options.apiKey || !options.pageCode) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "payment-grow: apiKey and pageCode are required options."
      )
    }
  }

  constructor({ logger }: InjectedDependencies, options: GrowClientOptions) {
    // @ts-ignore
    super(...arguments)

    this.logger_ = logger
    this.client_ = new GrowClient(options)
  }

  // Starts the hosted-page session. The redirect URL returned here is what
  // the storefront's checkout step sends the customer to.
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, data } = input
    const orderReference = (data?.cart_id as string) ?? crypto.randomUUID()

    const { transactionId, redirectUrl } = await this.client_.createPaymentPage(
      Number(amount),
      currency_code,
      orderReference
    )

    return {
      id: transactionId,
      data: { transactionId, redirectUrl },
      status: "pending",
    }
  }

  // Grow confirms payment asynchronously (customer completes it on Grow's
  // hosted page, then Grow calls our webhook) — this can't be confirmed
  // synchronously here, so it always defers. `getWebhookActionAndData`
  // below is what actually authorizes the session once Grow confirms.
  async authorizePayment(_input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    return { status: "pending_authorization" }
  }

  // Grow's hosted-page flow captures on approval (see the mandatory
  // `approveTransaction` step), so there's nothing further to do here in
  // the common case — this just carries the existing data forward.
  // TODO: confirm whether this client's Grow account needs an explicit
  // separate capture call rather than auto-capture-on-approve.
  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return { data: input.data }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: input.data }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const transactionId = input.data?.transactionId as string
    await this.client_.refund(transactionId, Number(input.amount))
    return { data: input.data }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const transactionId = input.data?.transactionId as string
    const status = await this.client_.getStatus(transactionId)
    return { data: { ...input.data, status } }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const transactionId = input.data?.transactionId as string
    const status = await this.client_.getStatus(transactionId)

    // TODO: map Grow's real status strings once confirmed — these are
    // placeholder guesses.
    switch (status) {
      case "approved":
        return { status: "captured" }
      case "pending":
        return { status: "pending" }
      case "failed":
        return { status: "error" }
      default:
        return { status: "pending" }
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: input.data }
  }

  // Grow calls this URL after the customer completes (or abandons) payment
  // on the hosted page. TODO: verify the real payload shape and add
  // signature verification once Grow's webhook secret is available —
  // without it, this trusts any request that hits the endpoint.
  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data } = payload

    try {
      // TODO: confirm real event/status field names from Grow's webhook
      // payload before relying on this in production.
      const transactionId = data.transactionId as string
      const amount = new BigNumber((data.sum as number) ?? 0)

      if (data.status === "approved") {
        await this.client_.approveTransaction(transactionId)
        return {
          action: "authorized",
          data: { session_id: transactionId, amount },
        }
      }

      return {
        action: "not_supported",
        data: { session_id: transactionId, amount },
      }
    } catch (error) {
      this.logger_.error(`payment-grow: failed to process webhook — ${(error as Error).message}`)
      return {
        action: "failed",
        data: { session_id: "", amount: new BigNumber(0) },
      }
    }
  }
}

export default GrowPaymentService
