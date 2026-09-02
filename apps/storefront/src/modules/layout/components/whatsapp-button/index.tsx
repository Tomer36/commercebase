import { BUSINESS_CONTACT, WHATSAPP_ENABLED } from "@lib/config/business-info"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { getTranslations } from "next-intl/server"

/**
 * Floating contact button, opposite side from the accessibility widget
 * (which sits at the inline-end corner) so the two never overlap. Uses
 * BUSINESS_CONTACT.phone for the wa.me link — while that's still the
 * placeholder number, this renders but isn't a real working channel yet.
 */
const WhatsAppButton = async () => {
  if (!WHATSAPP_ENABLED) {
    return null
  }

  const t = await getTranslations("Common")
  const digitsOnly = BUSINESS_CONTACT.phone.replace(/\D/g, "")

  return (
    <a
      href={`https://wa.me/${digitsOnly}`}
      target="_blank"
      rel="noreferrer"
      aria-label={t("chatOnWhatsapp")}
      title={t("chatOnWhatsapp")}
      data-testid="whatsapp-button"
      className="fixed start-4 bottom-20 small:bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-150 ease-out hover:opacity-90 active:scale-90"
    >
      <ChatBubbleLeftRight width={22} height={22} />
    </a>
  )
}

export default WhatsAppButton
