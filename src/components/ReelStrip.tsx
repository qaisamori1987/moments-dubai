import Image from "next/image";
import Link from "next/link";
import type { Reel } from "@/lib/commerce/types";

/**
 * A row of categorized reels. Featured reels (with an encoded `video`) play
 * inline; the rest render their poster and link out to Instagram. Used on the
 * home page (featured) and on each collection page (that collection's reels).
 */
export default function ReelStrip({
  reels,
  instagram,
  label,
}: {
  reels: Reel[];
  instagram: string;
  label: string;
}) {
  if (reels.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {reels.map((r) =>
        r.video ? (
          <video
            key={r.id}
            src={r.video}
            poster={r.poster}
            controls
            preload="none"
            playsInline
            aria-label={r.title}
            className="aspect-[9/16] w-full rounded-xl bg-cream object-cover"
          />
        ) : (
          <Link
            key={r.id}
            href={instagram}
            aria-label={`${r.title} — ${label}`}
            className="group relative block aspect-[9/16] w-full overflow-hidden rounded-xl bg-cream"
          >
            <Image
              src={r.poster}
              alt={r.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 grid place-items-center bg-charcoal/10 opacity-0 transition group-hover:opacity-100">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ivory/90 text-burgundy">▶</span>
            </span>
          </Link>
        )
      )}
    </div>
  );
}
