import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function StoryPage({ params }: PageProps<"/[locale]/story"> ) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const s = t.story;

  return (
    <>
      <SiteHeader locale={locale} brand={t.brand} nav={t.nav} languageName={t.languageName} langPath="/story" />

      <main className="rail pb-20">
        {/* Lead */}
        <section className="max-w-2xl py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{s.kicker}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.15] text-charcoal md:text-5xl">{s.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-mocha">{s.lead}</p>
        </section>

        {/* Editorial image + body */}
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div
            className="aspect-[4/5] w-full rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(124,58,71,0.35)]"
            style={{ background: "linear-gradient(150deg, #f5ede3, #e8c9c1 55%, #d9a8a0)" }}
            aria-hidden
          />
          <div className="space-y-5 text-mocha">
            <p className="leading-relaxed">{s.p1}</p>
            <p className="leading-relaxed">{s.p2}</p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <h2 className="font-display text-3xl text-charcoal">{s.valuesTitle}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {s.values.map((v) => (
              <div key={v.t} className="rounded-2xl bg-cream/60 p-6">
                <h3 className="font-display text-xl text-burgundy">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mocha">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gratitude + CTA */}
        <section className="rounded-[2rem] bg-blush/25 px-6 py-12 text-center">
          <p className="mx-auto max-w-xl font-display text-2xl text-charcoal">{s.gratitude}</p>
          <Link
            href={`/${locale}#collections`}
            className="mt-6 inline-block rounded-full bg-burgundy px-7 py-3 text-sm text-ivory transition hover:opacity-90"
          >
            {s.cta}
          </Link>
        </section>
      </main>

      <SiteFooter brand={t.brand} />
    </>
  );
}
