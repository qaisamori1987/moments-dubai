import { notFound } from "next/navigation";
import CollectionFilters from "@/components/CollectionFilters";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { commerce } from "@/lib/commerce";

export default async function ShopPage({ params }: PageProps<"/[locale]/shop"> ) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [t, collections, products] = await Promise.all([
    getDictionary(locale),
    commerce.getCollections(locale),
    commerce.getProducts({ locale }),
  ]);

  const occasions = collections.map((c) => ({ handle: c.handle, title: c.title }));

  return (
    <>
      <SiteHeader locale={locale} brand={t.brand} nav={t.nav} languageName={t.languageName} langPath="/shop" />

      <main className="rail pb-24 pt-6">
        <header className="mb-2">
          <h1 className="font-display text-4xl text-charcoal md:text-5xl">{t.nav.shop}</h1>
          <p className="mt-2 max-w-xl text-mocha">{t.collections.subtitle}</p>
        </header>

        <CollectionFilters products={products} locale={locale} t={t.filters} occasions={occasions} />
      </main>

      <SiteFooter brand={t.brand} />
    </>
  );
}
