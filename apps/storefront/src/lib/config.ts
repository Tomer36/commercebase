import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

// In dev, the browser may load the storefront via a LAN IP (e.g. testing on
// a phone) rather than localhost. The env var above is only correct for
// whichever machine it was written on, so in the browser we swap in
// whatever host the page actually loaded from, keeping the configured port.
// This avoids hardcoding a LAN IP that breaks the moment DHCP reassigns it.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  try {
    const configuredPort = new URL(MEDUSA_BACKEND_URL).port || "9000"
    MEDUSA_BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:${configuredPort}`
  } catch {}
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  try {
    localeHeader = await getLocaleHeader()
    headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
  } catch {}

  const newHeaders = {
    ...localeHeader,
    ...headers,
  }
  init = {
    ...init,
    headers: newHeaders,
  }
  return originalFetch(input, init)
}
