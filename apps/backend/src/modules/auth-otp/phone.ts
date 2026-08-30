const ISRAEL_COUNTRY_CODE = "+972"

/**
 * Normalizes a phone number to E.164. Accepts either an already-international
 * value ("+<country><number>") or a local Israeli number starting with "0"
 * (e.g. "050-123-4567"), which is what most customers will actually type.
 * Returns null if the input doesn't look like a valid phone number.
 */
export function normalizePhone(raw: string): string | null {
  const cleaned = raw.trim().replace(/[\s\-()]/g, "")

  if (cleaned.startsWith("+")) {
    return /^\+[1-9]\d{7,14}$/.test(cleaned) ? cleaned : null
  }

  if (/^0\d{8,9}$/.test(cleaned)) {
    return `${ISRAEL_COUNTRY_CODE}${cleaned.slice(1)}`
  }

  return null
}
