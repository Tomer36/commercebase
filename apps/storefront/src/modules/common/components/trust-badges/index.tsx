import { ArrowPath as Refresh, ShieldCheck } from "@medusajs/icons"
import FastDelivery from "@modules/common/icons/fast-delivery"
import { useTranslations } from "next-intl"

/**
 * `bordered` adds this component's own top divider/spacing — needed when it
 * stands alone (home page, product actions, checkout payment) but redundant
 * when it's already inside a bordered/padded parent section (footer).
 */
const TrustBadges = ({ bordered = true }: { bordered?: boolean }) => {
  const t = useTranslations("TrustBadges")

  const items = [
    { key: "securePayment", label: t("securePayment"), icon: <ShieldCheck width={18} height={18} /> },
    { key: "fastDelivery", label: t("fastDelivery"), icon: <FastDelivery size="18" /> },
    { key: "easyReturns", label: t("easyReturns"), icon: <Refresh width={18} height={18} /> },
  ]

  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-small-regular text-gray-600 ${
        bordered ? "border-t border-gray-100 pt-4" : ""
      }`}
    >
      {items.map(({ key, label, icon }) => (
        <div key={key} className="flex items-center gap-x-2">
          {icon}
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default TrustBadges
