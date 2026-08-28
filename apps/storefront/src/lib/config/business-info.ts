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

// Social links the footer renders — left empty by default so the footer
// shows no social icons rather than fabricated URLs. Fill in real ones as
// they become available; the footer skips whichever fields stay empty.
export const SOCIAL_LINKS = {
  instagram: "",
  facebook: "",
  tiktok: "",
}

// Flip to true once a real logo file is added at public/logo.svg — the
// StoreBrandMark component (used by both desktop nav and mobile header)
// then renders that image instead of the text/initial fallback. A ~5-minute
// swap once the client supplies a logo: drop the file in, flip this flag.
export const HAS_CUSTOM_LOGO = false
