import { notFound } from "next/navigation";
import { HeroScrollDemo } from "@/components/HeroScrollDemo";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function ScrollDemoPage({ params }: PageProps<"/[locale]/scroll-demo">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} brand={t.brand} nav={t.nav} languageName={t.languageName} />
      <main>
        <HeroScrollDemo />
      </main>
      <SiteFooter brand={t.brand} />
    </>
  );
}
