import {
  AbstractAuthModuleProvider,
  MedusaError,
} from "@medusajs/framework/utils"
import type {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
} from "@medusajs/framework/types"
import type { Logger } from "@medusajs/framework/types"
import { Sms019Client, Sms019ClientOptions } from "./sms019-client"
import { normalizePhone } from "./phone"

type InjectedDependencies = {
  logger: Logger
}

/**
 * A "code sent" isn't a real authentication failure, but Medusa's auth route
 * only understands `{ success, error }` — there's no "pending" state. We
 * surface this sentinel as the `error` string on a `success: false` response
 * (which the route turns into a 401), and the storefront's server action
 * checks for this exact string to know to show the code-entry step instead
 * of treating it as a real error. Do not "fix" this by making it succeed —
 * the customer hasn't proven anything yet at this point.
 */
export const OTP_SENT = "OTP_SENT"

class OtpAuthService extends AbstractAuthModuleProvider {
  static identifier = "otp"
  static DISPLAY_NAME = "Phone (SMS code)"

  protected logger_: Logger
  protected client_: Sms019Client

  static validateOptions(options: Record<string, unknown>) {
    if (!options.username || !options.apiToken || !options.source) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "auth-otp: username, apiToken and source are required options."
      )
    }
  }

  constructor(
    { logger }: InjectedDependencies,
    options: Sms019ClientOptions
  ) {
    // @ts-ignore
    super(...arguments)

    this.logger_ = logger
    this.client_ = new Sms019Client(options)
  }

  async authenticate(
    data: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { phone: rawPhone, code } = data.body ?? {}

    if (!rawPhone || typeof rawPhone !== "string") {
      return { success: false, error: "Phone number is required" }
    }

    const phone = normalizePhone(rawPhone)

    if (!phone) {
      return { success: false, error: "Invalid phone number" }
    }

    // Step 1: no code yet — send one and stop. 019sms owns the code's
    // lifecycle (generation, expiry, retry limits); we don't store anything.
    if (!code) {
      try {
        await this.client_.sendCode(phone)
      } catch (error) {
        this.logger_.error(`auth-otp: failed to send code — ${error.message}`)
        return { success: false, error: "Could not send verification code" }
      }

      return { success: false, error: OTP_SENT }
    }

    if (typeof code !== "string") {
      return { success: false, error: "Code should be a string" }
    }

    let approved: boolean

    try {
      approved = await this.client_.checkCode(phone, code)
    } catch (error) {
      this.logger_.error(`auth-otp: failed to check code — ${error.message}`)
      return { success: false, error: "Could not verify code" }
    }

    if (!approved) {
      return { success: false, error: "Invalid or expired code" }
    }

    // Step 2, approved: find-or-create the identity ourselves — the
    // storefront never calls a separate "register" for this provider.
    try {
      const authIdentity = await authIdentityService.retrieve({
        entity_id: phone,
      })
      return { success: true, authIdentity }
    } catch (error) {
      if (error.type !== MedusaError.Types.NOT_FOUND) {
        return { success: false, error: error.message }
      }
    }

    const authIdentity = await authIdentityService.create({
      entity_id: phone,
    })

    return { success: true, authIdentity }
  }
}

export default OtpAuthService
