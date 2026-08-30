import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Different client deployments of this codebase use different payment
// gateways (Grow for one, Nayax for another) — each provider is only
// registered if its own credentials are actually set, so a deployment that
// only configures one of them never crashes at boot over the other's
// missing env vars (each service's own `validateOptions` throws on missing
// required options). `pp_system_default` (Medusa's built-in no-op provider)
// is always registered by the payment module regardless of this list —
// it's unconditional in Medusa's own loader, not something this array can
// accidentally remove.
const paymentProviders: Array<{
  resolve: string
  id: string
  options: Record<string, unknown>
}> = []

if (process.env.GROW_API_KEY && process.env.GROW_PAGE_CODE) {
  paymentProviders.push({
    resolve: "./src/modules/payment-grow",
    id: "grow",
    options: {
      apiKey: process.env.GROW_API_KEY,
      pageCode: process.env.GROW_PAGE_CODE,
      useSandbox: process.env.GROW_USE_SANDBOX === "true",
    },
  })
}

if (process.env.NAYAX_API_KEY && process.env.NAYAX_SITE_ID) {
  paymentProviders.push({
    resolve: "./src/modules/payment-nayax",
    id: "nayax",
    options: {
      apiKey: process.env.NAYAX_API_KEY,
      siteId: process.env.NAYAX_SITE_ID,
    },
  })
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
      // Declaring the auth module below replaces Medusa's default provider
      // list entirely (the last-declared module wins, it isn't merged), so
      // both "emailpass" and "otp" have to be registered explicitly and
      // scoped per actor type here — otherwise admin login breaks too.
      authMethodsPerActor: {
        user: ["emailpass"],
        customer: ["otp"],
      },
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/translation",
    },
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
          {
            resolve: "./src/modules/auth-otp",
            id: "otp",
            options: {
              username: process.env.SMS019_USERNAME,
              apiToken: process.env.SMS019_API_TOKEN,
              source: process.env.SMS019_SOURCE,
              useTestApi: process.env.SMS019_USE_TEST_API === "true",
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: paymentProviders,
      },
    },
  ],
})
