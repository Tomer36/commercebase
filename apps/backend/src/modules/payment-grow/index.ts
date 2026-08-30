import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import GrowPaymentService from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [GrowPaymentService],
})
