"use client";

import Link from "next/link";
import { useState } from "react";
import Thumb from "@/components/Thumb";
import type { Product } from "@/lib/commerce";

type FiltersT = {
  occasion: string;
  recipient: string;
  all: string;
  boy: string;
  girl: string;
  empty: string;
};

type Props = {
  products: Product[];
  locale: string;
  t: FiltersT;
  /** When provided (e.g. on the Shop-all page), shows an occasion filter. */
  occasions?: { handle: string; title: string }[];
};

type Recipient = "all" | "boy" | "girl";

export default function CollectionFilters({ products, locale, t, occasions }: Props) {
  const [recipient, setRecipient] = useState<Recipient>("all");
  const [occasion, setOccasion] = useState<string>("all");

  // Only offer recipient chips that actually exist in this collection.
  const hasBoy = products.some((p) => p.tags.includes("boy"));
  const hasGirl = products.some((p) => p.tags.includes("girl"));
  const showRecipient = hasBoy || hasGirl;

  const filtered = products.filter((p) => {
    const occasionOk = occasion === "all" || p.collections.includes(occasion);
    const recipientOk = recipient === "all" || p.tags.includes(recipient);
    return occasionOk && recipientOk;
  });

  const chip = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-xs transition ${
      active
        ? "bg-burgundy text-ivory"
        : "border border-blush text-mocha hover:bg-blush/30"
    }`;

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-blush/40 py-4">
        {occasions && occasions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-mocha">{t.occasion}:</span>
            <button onClick={() => setOccasion("all")} className={chip(occasion === "all")}>{t.all}</button>
            {occasions.map((o) => (
              <button key={o.handle} onClick={() => setOccasion(o.handle)} className={chip(occasion === o.handle)}>
                {o.title}
              </button>
            ))}
          </div>
        )}
        {showRecipient && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-mocha">{t.recipient}:</span>
            <button onClick={() => setRecipient("all")} className={chip(recipient === "all")}>{t.all}</button>
            {hasBoy && <button onClick={() => setRecipient("boy")} className={chip(recipient === "boy")}>{t.boy}</button>}
            {hasGirl && <button onClick={() => setRecipient("girl")} className={chip(recipient === "girl")}>{t.girl}</button>}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-mocha">{t.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {filtered.map((p) => (
            <Link key={p.id} href={`/${locale}/products/${p.handle}`} className="group">
              <Thumb
                image={p.image}
                swatch={p.swatch}
                alt={p.title}
                className="aspect-[4/5] w-full rounded-2xl transition group-hover:scale-[1.02]"
              />
              <h3 className="mt-3 font-display text-lg text-charcoal">{p.title}</h3>
              <p className="line-clamp-2 text-sm text-mocha">{p.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
