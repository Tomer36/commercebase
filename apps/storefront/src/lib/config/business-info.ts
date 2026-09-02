// Placeholder business info for the "Company Overview" contact panel.
// None of the values below are real — replace every one of them with the
// client's actual details before launch (see conversation for what's needed).

export type DayHours = { open: string; close: string } | null

export const BUSINESS_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const

export type BusinessDay = (typeof BUSINESS_DAYS)[number]

export const BUSINESS_HOURS: Record<BusinessDay, DayHours> = {
  monday: { open: "08:00", close: "18:00" },
  tuesday: { open: "08:00", close: "18:00" },
  wednesday: { open: "08:00", close: "18:00" },
  thursday: { open: "08:00", close: "18:00" },
  friday: { open: "08:00", close: "13:00" },
  saturday: null,
  sunday: null,
}

export const ONLINE_ORDERS_ALWAYS_OPEN = true

export const BUSINESS_CONTACT = {
  email: "info@example.com",
  phone: "+000-00-000-0000",
  addressLine1: "Street address",
  addressLine2: "City",
}

// DEMO PLACEHOLDER — set to each platform's root URL (not a fake specific
// account) purely so the base template's "Follow Us" UI can be previewed
// complete. Replace with the client's real profile URLs before launch, or
// set back to "" to have the footer skip whichever platform isn't used.
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  tiktok: "https://tiktok.com",
}

// Flip to true once a real logo file is added at public/logo.svg — the
// StoreBrandMark component (used by both desktop nav and mobile header)
// then renders that image instead of the text/initial fallback. A ~5-minute
// swap once the client supplies a logo: drop the file in, flip this flag.
export const HAS_CUSTOM_LOGO = false

// Flip to false to hide the floating WhatsApp contact button entirely (not
// every client uses WhatsApp for support). Uses BUSINESS_CONTACT.phone —
// while that's still the placeholder number, the button renders but isn't
// a real, working contact channel yet.
export const WHATSAPP_ENABLED = true

// Demo testimonials (fabricated content, to preview the base template
// complete) live in messages/*.json as Brand.testimonials, not here — they
// need real per-locale translations like the rest of the site's copy, not
// a single English-only JS array. See the Brand page for the DEMO comment.
