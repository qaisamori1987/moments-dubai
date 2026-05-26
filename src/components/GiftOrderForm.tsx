"use client";

import { useMemo, useState } from "react";

/** The gifting data captured at order time. Maps 1:1 to Shopify cart
 *  line-item attributes when checkout is wired (see implementation plan §4). */
export type GiftAttributes = {
  delivery_date: string;
  delivery_slot: string;
  is_gift: boolean;
  gift_message: string;
  recipient_name: string;
  recipient_phone: string;
  hide_prices: boolean;
};

type SlotKey = "morning" | "afternoon" | "evening";

type T = {
  quantity: string;
  deliveryDate: string;
  deliverySlot: string;
  slots: Record<SlotKey, string>;
  leadNote: string;
  isGift: string;
  giftMessage: string;
  giftMessagePlaceholder: string;
  recipientName: string;
  recipientPhone: string;
  hidePrices: string;
  send: string;
  required: string;
};

type OrderT = {
  intro: string;
  product: string;
  date: string;
  slot: string;
  recipient: string;
  phone: string;
  message: string;
  hidePrices: string;
};

type Props = {
  product: { title: string };
  whatsapp: string;
  /** Days of lead time before the earliest selectable delivery date. 0 = same-day eligible. */
  leadDays?: number;
  /** Same-day cut-off hour in Dubai time (24h). After this, same-day rolls to tomorrow. */
  cutoffHour?: number;
  t: T;
  orderT: OrderT;
};

const DUBAI_TZ = "Asia/Dubai";

/** Current date + hour in Asia/Dubai, regardless of the visitor's device timezone. */
function dubaiNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: DUBAI_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;
  return { y: +parts.year, m: +parts.month, d: +parts.day, hour: +parts.hour };
}

/** Earliest selectable delivery date (Dubai calendar), honoring lead time + same-day cut-off. */
function earliestDeliveryISO(leadDays: number, cutoffHour: number) {
  const { y, m, d, hour } = dubaiNow();
  // A same-day item ordered after the cut-off can't go out today.
  const lead = leadDays === 0 && hour >= cutoffHour ? 1 : leadDays;
  const base = new Date(Date.UTC(y, m - 1, d)); // anchor on the Dubai calendar date
  base.setUTCDate(base.getUTCDate() + lead);
  return base.toISOString().slice(0, 10);
}

const field =
  "w-full rounded-xl border border-blush/60 bg-white/70 px-4 py-2.5 text-sm text-charcoal " +
  "outline-none transition focus:border-rose";
const label = "mb-1 block text-sm font-medium text-mocha";

export default function GiftOrderForm({ product, whatsapp, leadDays = 1, cutoffHour = 14, t, orderT }: Props) {
  const minDate = useMemo(() => earliestDeliveryISO(leadDays, cutoffHour), [leadDays, cutoffHour]);

  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [slot, setSlot] = useState<SlotKey>("morning");
  const [isGift, setIsGift] = useState(true);
  const [giftMessage, setGiftMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [hidePrices, setHidePrices] = useState(true);
  const [error, setError] = useState(false);

  function buildMessage(): string {
    const lines = [
      orderT.intro,
      "",
      `• ${orderT.product}: ${product.title} ×${quantity}`,
      `• ${orderT.date}: ${deliveryDate} (${t.slots[slot]})`,
    ];
    if (isGift) {
      if (recipientName) lines.push(`• ${orderT.recipient}: ${recipientName}`);
      if (recipientPhone) lines.push(`• ${orderT.phone}: ${recipientPhone}`);
      if (giftMessage) lines.push(`• ${orderT.message}: “${giftMessage}”`);
      if (hidePrices) lines.push(`• ${orderT.hidePrices}`);
    }
    return lines.join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Required: a delivery date, plus a recipient name when it's a gift.
    if (!deliveryDate || (isGift && !recipientName.trim())) {
      setError(true);
      return;
    }
    setError(false);
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Quantity + delivery date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="qty">{t.quantity}</label>
          <input
            id="qty"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="date">{t.deliveryDate}</label>
          <input
            id="date"
            type="date"
            min={minDate}
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className={field}
          />
        </div>
      </div>

      {/* Time slot */}
      <div>
        <label className={label} htmlFor="slot">{t.deliverySlot}</label>
        <select id="slot" value={slot} onChange={(e) => setSlot(e.target.value as SlotKey)} className={field}>
          <option value="morning">{t.slots.morning}</option>
          <option value="afternoon">{t.slots.afternoon}</option>
          <option value="evening">{t.slots.evening}</option>
        </select>
      </div>

      <p className="text-xs text-mocha/80">{t.leadNote}</p>

      {/* Gift toggle */}
      <label className="flex items-center gap-3 rounded-xl bg-blush/20 px-4 py-3 text-sm text-charcoal">
        <input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} className="size-4 accent-burgundy" />
        {t.isGift}
      </label>

      {/* Gift details */}
      {isGift && (
        <div className="space-y-4 border-s-2 border-blush ps-4">
          <div>
            <label className={label} htmlFor="rname">{t.recipientName}</label>
            <input id="rname" type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rphone">{t.recipientPhone}</label>
            <input id="rphone" type="tel" inputMode="tel" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="msg">{t.giftMessage}</label>
            <textarea
              id="msg"
              rows={3}
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder={t.giftMessagePlaceholder}
              className={`${field} resize-none`}
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-mocha">
            <input type="checkbox" checked={hidePrices} onChange={(e) => setHidePrices(e.target.checked)} className="size-4 accent-burgundy" />
            {t.hidePrices}
          </label>
        </div>
      )}

      {error && <p className="text-sm text-burgundy">{t.required}</p>}

      <button
        type="submit"
        className="w-full rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-ivory transition hover:opacity-90"
      >
        {t.send}
      </button>
    </form>
  );
}
