import Image from "next/image";

/**
 * Media box that shows a real photo when `image` is set, otherwise falls back
 * to the soft gradient `swatch`. Used for every product/collection card so the
 * site degrades gracefully while photos are still being assigned.
 */
export default function Thumb({
  image,
  swatch,
  alt,
  className = "",
  sizes = "(max-width: 1024px) 50vw, 25vw",
  priority = false,
}: {
  image?: string;
  swatch: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={image ? undefined : { background: swatch }}
    >
      {image && (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
    </div>
  );
}
