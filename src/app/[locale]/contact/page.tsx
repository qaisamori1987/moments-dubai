import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971526516021";
const INSTAGRAM = "https://instagram.com/moments.dubai";
const FACEBOOK = "https://facebook.com/moments.4.gifts";

export default async function ContactPage({ params }: PageProps<"/[locale]/contact"> ) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const c = t.contact;
  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.whatsappPrefill)}`;

  return (
    <>
      <SiteHeader locale={locale} brand={t.brand} nav={t.nav} languageName={t.languageName} langPath="/contact" />

      <main className="rail pb-20">
        <section className="max-w-2xl py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{c.kicker}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.15] text-charcoal md:text-5xl">{c.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-mocha">{c.lead}</p>

          {/* Primary actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={waHref} className="rounded-full bg-sage px-7 py-3 text-sm text-ivory transition hover:opacity-90">
              {c.whatsappCta}
            </Link>
            <Link href={`tel:+${WHATSAPP}`} className="rounded-full border border-rose px-7 py-3 text-sm text-burgundy transition hover:bg-blush/30">
              {c.callCta}
            </Link>
          </div>
        </section>

        {/* Details */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-cream/60 p-6">
            <h2 className="text-xs font-medium uppercase tracking-wider text-mocha/70">{c.phoneLabel}</h2>
            <p className="mt-2 font-display text-xl text-charcoal" dir="ltr">{c.phone}</p>
          </div>
          <div className="rounded-2xl bg-cream/60 p-6">
            <h2 className="text-xs font-medium uppercase tracking-wider text-mocha/70">{c.locationLabel}</h2>
            <p className="mt-2 text-charcoal">{c.location}</p>
          </div>
          <div className="rounded-2xl bg-cream/60 p-6">
            <h2 className="text-xs font-medium uppercase tracking-wider text-mocha/70">{c.deliveryLabel}</h2>
            <p className="mt-2 text-charcoal">{c.delivery}</p>
          </div>
        </section>

        {/* Social */}
        <section className="mt-10">
          <h2 className="text-xs font-medium uppercase tracking-wider text-mocha/70">{c.followLabel}</h2>
          <div className="mt-3 flex gap-4 text-sm">
            <Link href={INSTAGRAM} className="text-burgundy underline-offset-4 transition hover:underline">Instagram</Link>
            <Link href={FACEBOOK} className="text-burgundy underline-offset-4 transition hover:underline">Facebook</Link>
          </div>
        </section>
      </main>

      <SiteFooter brand={t.brand} />
    </>
  );
}
