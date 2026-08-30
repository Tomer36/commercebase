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
import { NayaxClient, NayaxClientOptions } from "./nayax-client"

type InjectedDependencies = {
  logger: Logger
}

class NayaxPaymentService extends AbstractPaymentProvider<NayaxClientOptions> {
  static identifier = "nayax"

  protected logger_: Logger
  protected client_: NayaxClient

  static validateOptions(options: Record<string, unknown>) {
    if (!options.apiKey || !options.siteId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "payment-nayax: apiKey and siteId are required options."
      )
    }
  }

  constructor({ logger }: InjectedDependencies, options: NayaxClientOptions) {
    // @ts-ignore
    super(...arguments)

    this.logger_ = logger
    this.client_ = new NayaxClient(options)
  }

  // Starts the hosted-page session. `hostedPageUrl` is what the storefront's
  // checkout step sends the customer to (iframe or full redirect).
  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, data } = input
    const orderReference = (data?.cart_id as string) ?? crypto.randomUUID()

    const { transactionId, hostedPageUrl } = await this.client_.createSession(
      Number(amount),
      currency_code,
      orderReference
    )

    return {
      id: transactionId,
      data: { transactionId, hostedPageUrl },
      status: "pending",
    }
  }

  // Nayax confirms payment asynchronously (customer completes it on the
  // hosted page, then Nayax calls our webhook) — this can't be confirmed
  // synchronously here, so it always defers. `getWebhookActionAndData`
  // below is what actually authorizes the session once Nayax confirms.
  async authorizePayment(_input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    return { status: "pending_authorization" }
  }

  // TODO: confirm whether this client's Nayax account auto-captures on
  // authorization or needs an explicit separate capture call.
  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return { data: input.data }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: input.data }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  // Nayax refunds require both the original transaction ID and its
  // `machineAuTime`, which we expect to have been stored on the payment's
  // `data` when the webhook confirmed the charge (see
  // getWebhookActionAndData below). Refunds land in a pending/approval
  // state on Nayax's side, not completed instantly.
  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const transactionId = input.data?.transactionId as string
    const machineAuTime = input.data?.machineAuTime as string

    await this.client_.requestRefund(
      transactionId,
      machineAuTime,
      Number(input.amount),
      "Refund requested via Medusa admin",
      [] // TODO: which address(es) should Nayax notify on this refund?
    )

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

    // TODO: map Nayax's real status strings once confirmed — these are
    // placeholder guesses.
    switch (status) {
      case "Approved":
        return { status: "captured" }
      case "Pending":
        return { status: "pending" }
      case "Declined":
        return { status: "error" }
      default:
        return { status: "pending" }
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: input.data }
  }

  // Nayax calls this URL after the customer completes (or abandons) payment
  // on the hosted page. TODO: verify the real payload shape and add
  // signature verification once Nayax's webhook secret is available —
  // without it, this trusts any request that hits the endpoint.
  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data } = payload

    try {
      // TODO: confirm real field names from Nayax's webhook payload before
      // relying on this in production.
      const transactionId = data.TransactionId as string
      const amount = new BigNumber((data.Amount as number) ?? 0)

      if (data.Status === "Approved") {
        // OPEN QUESTION: refunds need both transactionId AND
        // machineAuTime (see nayax-client.ts), but Medusa's
        // WebhookActionData type only carries `session_id`/`amount` back
        // to the Payment record — there's no field here to smuggle
        // machineAuTime through. Before going live, confirm with Nayax's
        // docs/support whether refunds can be requested with just
        // transactionId, or find another place to persist machineAuTime
        // (e.g. writing it to the order/payment's metadata directly from
        // this handler via the container, rather than via this return
        // value).
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
      this.logger_.error(`payment-nayax: failed to process webhook — ${(error as Error).message}`)
      return {
        action: "failed",
        data: { session_id: "", amount: new BigNumber(0) },
      }
    }
  }
}

export default NayaxPaymentService
