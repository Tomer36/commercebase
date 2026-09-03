# apps/storefront/AGENTS.md

Next.js (App Router) storefront for the Medusa backend in `apps/backend`. Trilingual (Hebrew/Arabic/English), RTL-first, i18n via `next-intl`. Built as a reusable base — the two pillars are the Brand page (`/brand`) and the product catalog (`/store`, `/categories`, `/collections`, `/products/[handle]`), not a single-client site.

## Duplicating this base for a new business

Everything a new client needs to change lives in a small number of places. Nothing else in the codebase should need touching — if it does, that's a portability bug (see "Common mistakes" below).

1. **Copy** — `messages/en.json`, `he.json`, `ar.json`. This is the only source of user-facing text: `Common.storeName`, the whole `Brand` namespace (hero, story, values, stats, testimonials — all of it is demo copy meant to be rewritten), nav labels, everything. Changing `Common.storeName` alone renames the store everywhere, including page `<title>`s — every page metadata call goes through `getTranslations("Common")` → `t("storeName")`, never a literal string.
2. **Business facts** — `src/lib/config/business-info.ts`. Contact info, hours, social links, and feature toggles (`HAS_CUSTOM_LOGO`, `WHATSAPP_ENABLED`). Comments in the file mark which values are placeholder vs. structural config.
3. **Visual identity** — `src/styles/globals.css` (`--accent`/`--accent-foreground`/`--accent-soft` CSS variables) and `tailwind.config.js` (`colors.black`, `colors.gray` ramp, `fontFamily.display`/`fontFamily.sans`). Swapping these re-themes the whole site without touching component code.
4. **Logo** — drop a real file at `public/logo.svg` and flip `HAS_CUSTOM_LOGO` to `true` in `business-info.ts`.
5. **Product catalog** — lives in the Medusa backend (`apps/backend`), not in storefront code. Never hardcode prices, product names, or category structure in `.tsx` files — see the backend-driven-data rule below.
6. **Category icons** (optional, cosmetic only) — `src/modules/store/utils/category-icons.tsx` maps category *handles* to icons for the store's category pills. A new client's categories that aren't in the map just render without a custom icon; add entries there if you want icons for the new taxonomy.

## Demo placeholder content

Search for `DEMO PLACEHOLDER` (comments in `business-info.ts` and JSX comments in `brand/page.tsx`) to find fabricated-but-clearly-marked content added so the base can be previewed complete: testimonials, stats row, social links, WhatsApp button. Replace or remove each before a real client launches — never let fabricated testimonials/numbers ship as if real.

## Common mistakes

- Hardcoding the store name or any business copy directly in a `.tsx` file instead of `messages/*.json` — found and fixed once already (5 page-metadata files had a literal `"Cosmetics Store"` string that bypassed `Common.storeName` entirely; a client rename would have silently missed them).
- Fabricating commerce data (prices, currency, stock) in the UI — the Medusa backend/admin is the only source of truth; UI passes must not change working pricing/data logic.
- Combining a `components`-layer utility (e.g. `.content-container`) with a conflicting `utilities`-layer class (e.g. `max-w-2xl`) on the *same element* — Tailwind's utilities layer silently wins regardless of class order. Nest the conflicting utility in a child element instead.
- Adding a demo/placeholder section without a `DEMO PLACEHOLDER` comment — the whole point of the convention is that these are easy to grep for before launch.
