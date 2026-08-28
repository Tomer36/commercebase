import { getLocale } from "@lib/data/locale-actions"
import { listLocales } from "@lib/data/locales"
import { retrieveCustomer } from "@lib/data/customer"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
// TODO: Re-add Toaster component when needed
import AccountLayout from "@modules/account/templates/account-layout"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const [customer, regions, locales, currentLocale] = await Promise.all([
    retrieveCustomer().catch(() => null),
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <AccountLayout
      customer={customer}
      regions={regions}
      locales={locales}
      currentLocale={currentLocale}
    >
      {customer ? dashboard : login}
      {/* TODO: Re-add Toaster component when needed */}
    </AccountLayout>
  )
}
