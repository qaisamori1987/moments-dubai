import Link from "next/link";
import { notFound } from "next/navigation";
import CollectionFilters from "@/components/CollectionFilters";
import ReelStrip from "@/components/ReelStrip";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { commerce } from "@/lib/commerce";

export default async function CollectionPage({ params }: PageProps<"/[locale]/collections/[handle]">) {
  const { locale, handle } = await params;
  if (!isLocale(locale)) notFound();

  const [t, collections, products, reels] = await Promise.all([
    getDictionary(locale),
    commerce.getCollections(locale),
    commerce.getProducts({ locale, collection: handle }),
    commerce.getReels?.({ locale, collection: handle }) ?? Promise.resolve([]),
  ]);

  const collection = collections.find((c) => c.handle === handle);
  if (!collection) notFound();

  const INSTAGRAM = "https://instagram.com/moments.dubai";

  return (
    <>
      <SiteHeader locale={locale} brand={t.brand} nav={t.nav} languageName={t.languageName} langPath={`/collections/${handle}`} />
      <main className="rail pb-24 pt-6">
      <Link href={`/${locale}#collections`} className="text-sm text-mocha transition hover:text-burgundy">
        {locale === "ar" ? "→" : "←"} {t.product.back}
      </Link>

      {/* Editorial header */}
      <header className="mt-6 mb-2">
        <h1 className="font-display text-4xl text-charcoal md:text-5xl">{collection.title}</h1>
        <p className="mt-2 max-w-xl text-mocha">{collection.description}</p>
      </header>

      <CollectionFilters products={products} locale={locale} t={t.filters} />

      {reels.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-charcoal md:text-3xl">{t.reels.title}</h2>
          <p className="mt-1 mb-6 text-sm text-mocha">{collection.title}</p>
          <ReelStrip reels={reels.slice(0, 12)} instagram={INSTAGRAM} label={t.gallery.cta} />
        </section>
      )}
      </main>
      <SiteFooter brand={t.brand} />
    </>
  );
}
