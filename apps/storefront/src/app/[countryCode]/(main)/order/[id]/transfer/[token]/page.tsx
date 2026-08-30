import Divider from "@modules/common/components/divider"
import { Heading, Text } from "@modules/common/components/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"
import { getTranslations } from "next-intl/server"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params
  const t = await getTranslations("TransferPage")

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl-semi text-black">
          {t("requestTitle", { id })}
        </Heading>
        <Text className="text-gray-600">{t("requestBody1", { id })}</Text>
        <Divider />
        <Text className="text-gray-600">{t("requestBody2")}</Text>
        <Text className="text-gray-600">{t("requestBody3")}</Text>
        <Divider />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
