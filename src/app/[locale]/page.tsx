import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroScrollDemo } from "@/components/HeroScrollDemo";
import ReelStrip from "@/components/ReelStrip";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Thumb from "@/components/Thumb";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { commerce } from "@/lib/commerce";

// Moments' public order line (0526516021) in international form.
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971526516021";
const INSTAGRAM = "https://instagram.com/moments.dubai";
const GALLERY = [
  "18147108499421893",
  "17919704670046943",
  "18041065223476889",
  "17850425364438516",
  "17884153638496654",
  "18020437643823681",
  "17887409982356529",
  "18063042317689271",
].map((id) => `/images/posts/${id}.jpg`);

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getDictionary(locale);
  const [collections, products, reels] = await Promise.all([
    commerce.getCollections(locale),
    commerce.getProducts({ locale }),
    commerce.getReels?.({ locale, featuredOnly: true }) ?? Promise.resolve([]),
  ]);

  return (
    <>
      <SiteHeader locale={locale} brand={t.brand} nav={t.nav} languageName={t.languageName} />
      <main>
      {/* Hero */}
      <section className="rail grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl leading-[1.15] text-balance text-charcoal sm:text-5xl md:text-6xl">
            {t.hero.tagline}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mocha">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}#collections`}
              className="rounded-full bg-burgundy px-7 py-3 text-sm text-ivory transition hover:opacity-90"
            >
              {t.hero.cta}
            </Link>
            <Link
              href={`/${locale}#collections`}
              className="rounded-full border border-rose px-7 py-3 text-sm text-burgundy transition hover:bg-blush/30"
            >
              {t.hero.ctaBuild}
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(124,58,71,0.35)]">
          <video
            src="/videos/hero.mp4"
            poster="/images/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Delivery promise */}
      <section className="bg-cream/70 py-4">
        <div className="rail flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm">
          <span className="font-medium text-burgundy">{t.delivery.promise}</span>
          <span className="text-mocha">·</span>
          <span className="text-mocha">{t.delivery.note}</span>
        </div>
      </section>

      {/* Scroll showcase — a signature reel framed in a brand device */}
      <section className="rail">
        <HeroScrollDemo
          eyebrow={t.showcase.eyebrow}
          title={t.showcase.title}
          titleAccent={t.showcase.titleAccent}
        />
      </section>

      {/* Collections */}
      <section id="collections" className="rail py-16">
        <h2 className="font-display text-3xl text-charcoal md:text-4xl">{t.collections.title}</h2>
        <p className="mt-2 text-mocha">{t.collections.subtitle}</p>
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {collections.map((c) => (
            <Link key={c.id} href={`/${locale}/collections/${c.handle}`} className="group">
              <Thumb
                image={c.image}
                swatch={c.swatch}
                alt={c.title}
                className="aspect-square w-full rounded-2xl transition group-hover:scale-[1.02]"
              />
              <h3 className="mt-3 font-display text-xl text-charcoal">{c.title}</h3>
              <p className="text-sm text-mocha">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="rail pb-20">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.filter((p) => p.featured).map((p) => (
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
      </section>

      {/* Reels */}
      <section className="rail pb-16">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-3xl text-charcoal md:text-4xl">{t.reels.title}</h2>
          <Link href={INSTAGRAM} className="text-sm text-burgundy underline-offset-4 hover:underline">
            {t.gallery.cta}
          </Link>
        </div>
        <div className="mt-8">
          <ReelStrip reels={reels} instagram={INSTAGRAM} label={t.gallery.cta} />
        </div>
      </section>

      {/* From our Instagram */}
      <section className="rail pb-20">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-3xl text-charcoal md:text-4xl">{t.gallery.title}</h2>
          <Link href={INSTAGRAM} className="text-sm text-burgundy underline-offset-4 hover:underline">
            {t.gallery.cta}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GALLERY.map((src) => (
            <Link key={src} href={INSTAGRAM} className="group" aria-label={t.gallery.cta}>
              <Thumb
                image={src}
                swatch="#f5ede3"
                alt={t.brand}
                sizes="(max-width: 640px) 50vw, 25vw"
                className="aspect-square w-full rounded-xl transition group-hover:scale-[1.02]"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <Link
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t.whatsappPrefill)}`}
        className="fixed bottom-5 end-5 rounded-full bg-sage px-5 py-3 text-sm text-ivory shadow-lg transition hover:opacity-90"
      >
        {t.whatsapp}
      </Link>

      </main>
      <SiteFooter brand={t.brand} />
    </>
  );
}
