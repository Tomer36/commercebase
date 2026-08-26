import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const LOCALES = ["en-US", "he-IL", "ar-SA"]

export default async function fix_store_locales({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModuleService = container.resolve(Modules.STORE)

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id"],
  })
  const store = stores[0]

  await storeModuleService.updateStores(store.id, {
    supported_locales: LOCALES.map((locale_code) => ({ locale_code })),
  })

  logger.info("Store supported_locales updated.")
}
