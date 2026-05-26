import Link from "next/link";
import { notFound } from "next/navigation";
import GiftOrderForm from "@/components/GiftOrderForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Thumb from "@/components/Thumb";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { commerce } from "@/lib/commerce";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971526516021";

export default async function ProductPage({ params }: PageProps<"/[locale]/products/[handle]">) {
  const { locale, handle } = await params;
  if (!isLocale(locale)) notFound();

  const [t, product] = await Promise.all([
    getDictionary(locale),
    commerce.getProduct(handle, locale),
  ]);
  if (!product) notFound();

  const isChocolate = product.tags.includes("chocolate");

  return (
    <>
      <SiteHeader locale={locale} brand={t.brand} nav={t.nav} languageName={t.languageName} langPath={`/products/${handle}`} />
      <main className="rail pb-24 pt-6">
      <Link href={`/${locale}#collections`} className="text-sm text-mocha transition hover:text-burgundy">
        {locale === "ar" ? "→" : "←"} {t.product.back}
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Media */}
        <Thumb
          image={product.image}
          swatch={product.swatch}
          alt={product.title}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="aspect-[4/5] w-full rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(124,58,71,0.35)]"
        />

        {/* Details + gifting flow */}
        <div>
          <h1 className="font-display text-4xl text-charcoal md:text-5xl">{product.title}</h1>
          <p className="mt-4 leading-relaxed text-mocha">{product.description}</p>
          {isChocolate && (
            <p className="mt-3 text-xs text-mocha/70">{t.product.allergenNote}</p>
          )}

          <hr className="my-7 border-blush/50" />

          <GiftOrderForm
            product={{ title: product.title }}
            whatsapp={WHATSAPP}
            leadDays={product.tags.includes("ready-to-send") ? 0 : 1}
            t={t.product}
            orderT={t.order}
          />
        </div>
      </div>
      </main>
      <SiteFooter brand={t.brand} />
    </>
  );
}
