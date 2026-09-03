import React from "react"

import { IconProps } from "types/icon"

const TikTok: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M16.5 3c.3 2 1.7 3.6 3.7 3.9v3c-1.4 0-2.7-.4-3.7-1.2v6.6c0 3.1-2.5 5.7-5.7 5.7S5.1 17.4 5.1 14.3c0-3.1 2.5-5.6 5.6-5.7v3.1a2.6 2.6 0 1 0 2.6 2.6V3h3.2z"
        fill={color}
      />
    </svg>
  )
}

export default TikTok
