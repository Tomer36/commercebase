import { Container } from "@modules/common/components/ui"
import clsx from "clsx"
import Image from "next/image"
import React from "react"
import { twMerge } from "tailwind-merge"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  alt?: string | null
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  alt,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={twMerge(clsx(
        "relative w-full overflow-hidden p-0 bg-gray-50 border border-gray-200 rounded-large transition-colors duration-150 group-hover:border-accent",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[4/3]": !isFeatured,
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      ))}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder
        image={initialImage}
        hoverImage={images && images.length > 1 ? images[1]?.url : undefined}
        size={size}
        alt={alt}
      />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  hoverImage,
  size,
  alt,
}: Pick<ThumbnailProps, "size" | "alt"> & {
  image?: string
  hoverImage?: string
}) => {
  return image ? (
    <>
      <Image
        src={image}
        alt={alt || "Product image"}
        className={twMerge(clsx(
          "absolute inset-0 object-cover object-center transition-opacity duration-200",
          { "group-hover:opacity-0": !!hoverImage }
        ))}
        draggable={false}
        quality={50}
        sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
        fill
      />
      {hoverImage && (
        <Image
          src={hoverImage}
          alt={alt || "Product image"}
          className="absolute inset-0 object-cover object-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          draggable={false}
          quality={50}
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          fill
        />
      )}
    </>
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
