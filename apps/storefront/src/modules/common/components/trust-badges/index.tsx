import { ArrowPath as Refresh, ShieldCheck } from "@medusajs/icons"
import FastDelivery from "@modules/common/icons/fast-delivery"
import { useTranslations } from "next-intl"

const TrustBadges = () => {
  const t = useTranslations("TrustBadges")

  const items = [
    { key: "securePayment", label: t("securePayment"), icon: <ShieldCheck width={16} height={16} /> },
    { key: "fastDelivery", label: t("fastDelivery"), icon: <FastDelivery size="16" /> },
    { key: "easyReturns", label: t("easyReturns"), icon: <Refresh width={16} height={16} /> },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-small-regular text-gray-500">
      {items.map(({ key, label, icon }) => (
        <div key={key} className="flex items-center gap-x-1.5">
          {icon}
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default TrustBadges
