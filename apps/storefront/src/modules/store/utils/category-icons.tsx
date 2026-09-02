import { Gift, Sparkles, Tools } from "@medusajs/icons"

// Top-level category icons, keyed by handle (stable across name changes/
// translations, unlike display name). Falls back to no icon for any
// top-level category added later that isn't mapped here. Shared between
// the mobile CategoryPills tab bar and the desktop sidebar's CategoryFilter
// so both surfaces stay in sync automatically.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CATEGORY_ICONS: Record<string, any> = {
  skincare: Sparkles,
  "gift-sets": Gift,
  "devices-&-tools": Tools,
}
