"use client"

import { Button, clx } from "@modules/common/components/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  size = "medium",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | null
  size?: "small" | "medium" | "large"
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      size={size}
      // Default (medium) submit buttons render at h-12 to match the
      // storefront's other primary commerce CTAs (add to cart, go to
      // checkout) — explicit small/large callers are unaffected.
      className={clx(size === "medium" && "h-12", className)}
      type="submit"
      isLoading={pending}
      variant={variant || "primary"}
      data-testid={dataTestId}
    >
      {children}
    </Button>
  )
}
