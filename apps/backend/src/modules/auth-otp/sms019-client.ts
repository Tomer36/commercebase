// Integration with 019sms's OTP API (backed by Telzar 019, a licensed Israeli
// MVNO) — https://docs.019sms.co.il/otp/. This is the one file that knows
// about this vendor; swapping SMS providers later means rewriting this file
// (and its constructor options) — service.ts never talks HTTP directly.
//
// 019sms manages the OTP's full lifecycle itself (generation, expiry, retry
// limits) — the actual code is never returned to us, matching how Twilio
// Verify worked. We just ask it to send a code and later ask it to check one.

const API_URL = "https://019sms.co.il/api"
const TEST_API_URL = "https://019sms.co.il/api/test"

export type Sms019ClientOptions = {
  username: string
  apiToken: string
  source: string
  useTestApi?: boolean
}

// 019sms expects local Israeli numbers ("5XXXXXXX" or "05XXXXXXXX"), not
// E.164. We keep E.164 as our canonical phone format everywhere else
// (auth_identity.entity_id, customer.phone), and only convert here, at the
// vendor boundary.
function toLocalFormat(phoneE164: string): string {
  return phoneE164.startsWith("+972") ? `0${phoneE164.slice(4)}` : phoneE164
}

type Sms019Response = {
  status: number
  message: string
  code?: string
}

export class Sms019Client {
  private username: string
  private apiToken: string
  private source: string
  private apiUrl: string

  constructor(options: Sms019ClientOptions) {
    this.username = options.username
    this.apiToken = options.apiToken
    this.source = options.source
    this.apiUrl = options.useTestApi ? TEST_API_URL : API_URL
  }

  private async post(body: Record<string, unknown>): Promise<Sms019Response> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify(body),
    })

    return (await response.json()) as Sms019Response
  }

  async sendCode(phoneE164: string): Promise<void> {
    const result = await this.post({
      send_otp: {
        user: { username: this.username },
        phone: toLocalFormat(phoneE164),
        source: this.source,
        max_tries: 3,
        valid_time: 10,
        text: "קוד האימות שלך הוא: [code]",
      },
    })

    if (result.status !== 0) {
      throw new Error(`019sms send_otp failed (status ${result.status}): ${result.message}`)
    }
  }

  async checkCode(phoneE164: string, code: string): Promise<boolean> {
    const result = await this.post({
      validate_otp: {
        user: { username: this.username },
        phone: toLocalFormat(phoneE164),
        code,
      },
    })

    if (result.status === 0) {
      return true
    }

    // Status 12 is a normal "wrong code" outcome, not a system error.
    if (result.status === 12) {
      return false
    }

    throw new Error(`019sms validate_otp failed (status ${result.status}): ${result.message}`)
  }
}
