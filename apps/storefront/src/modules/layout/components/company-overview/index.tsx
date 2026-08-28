"use client"

import { Clock, Envelope, MapPin, Phone, User } from "@medusajs/icons"
import {
  BUSINESS_CONTACT,
  BUSINESS_DAYS,
  BUSINESS_HOURS,
  DayHours,
  ONLINE_ORDERS_ALWAYS_OPEN,
} from "@lib/config/business-info"
import Modal from "@modules/common/components/modal"
import { Badge, clx } from "@modules/common/components/ui"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

type CompanyOverviewProps = {
  isOpen: boolean
  close: () => void
  storeName: string
}

const isOpenNow = (now: Date | null, hours: DayHours) => {
  if (!now || !hours) {
    return false
  }

  const current = now.toTimeString().slice(0, 5)
  return current >= hours.open && current < hours.close
}

const CompanyOverview = ({ isOpen, close, storeName }: CompanyOverviewProps) => {
  const t = useTranslations("CompanyOverview")
  const tDays = useTranslations("Days")
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    if (isOpen) {
      setNow(new Date())
    }
  }, [isOpen])

  const todayIndex = now ? (now.getDay() + 6) % 7 : 0
  const todayKey = BUSINESS_DAYS[todayIndex]
  const todayIsOpen = isOpenNow(now, BUSINESS_HOURS[todayKey])

  return (
    <Modal isOpen={isOpen} close={close} size="small" data-testid="company-overview-modal">
      <Modal.Title>{t("title")}</Modal.Title>
      <Modal.Body>
        <div className="flex w-full flex-col gap-6 text-start">
          <h3 className="text-lg font-bold text-black">{storeName}</h3>

          <div className="border-t border-gray-200 pt-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-black">
              <Clock />
              {t("openingHours")}
            </div>
            {now && (
              <Badge
                color={todayIsOpen ? "success" : "neutral"}
                className="mb-3 gap-1.5"
              >
                <span
                  className={clx("h-1.5 w-1.5 rounded-full", {
                    "bg-green-500": todayIsOpen,
                    "bg-gray-400": !todayIsOpen,
                  })}
                />
                {todayIsOpen ? t("currentlyOpen") : t("currentlyClosed")}
              </Badge>
            )}
            <div className="flex flex-col gap-2">
              {BUSINESS_DAYS.map((day) => {
                const hours = BUSINESS_HOURS[day]
                const isToday = day === todayKey

                return (
                  <div
                    key={day}
                    className={clx("flex items-center justify-between text-sm", {
                      "font-bold text-black": isToday,
                      "text-gray-600": !isToday,
                    })}
                  >
                    <span>{tDays(day)}</span>
                    <span>
                      {hours
                        ? t("hoursRange", { from: hours.open, to: hours.close })
                        : t("closed")}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {ONLINE_ORDERS_ALWAYS_OPEN && (
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-3 flex items-center gap-2 font-semibold text-black">
                <Clock />
                {t("onlineOrdersHours")}
              </div>
              <Badge color="success" className="gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                {t("open24Hours")}
              </Badge>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-black">
              <User />
              {t("contactDetails")}
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${BUSINESS_CONTACT.email}`}
                className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm text-black"
              >
                <Envelope />
                {BUSINESS_CONTACT.email}
              </a>
              <a
                href={`tel:${BUSINESS_CONTACT.phone}`}
                className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm text-black"
              >
                <Phone />
                {BUSINESS_CONTACT.phone}
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-black">
              <MapPin />
              {t("address")}
            </div>
            <p className="text-sm text-gray-600">
              {BUSINESS_CONTACT.addressLine1}
            </p>
            <p className="text-sm text-gray-600">
              {BUSINESS_CONTACT.addressLine2}
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CompanyOverview
