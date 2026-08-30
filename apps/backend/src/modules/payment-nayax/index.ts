import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import NayaxPaymentService from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [NayaxPaymentService],
})
