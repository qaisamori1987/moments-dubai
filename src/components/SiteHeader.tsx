import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

type Nav = { shop: string; build: string; story: string; contact: string };

type Props = {
  locale: Locale;
  brand: string;
  nav: Nav;
  languageName: string;
  /** Path after the locale to keep the language toggle on the current page. */
  langPath?: string;
  showNav?: boolean;
};

export default function SiteHeader({ locale, brand, nav, languageName, langPath = "", showNav = true }: Props) {
  const other = locale === "ar" ? "en" : "ar";
  const linkCls = "transition hover:text-burgundy";

  return (
    <header className="rail flex items-center justify-between py-5">
      <Link href={`/${locale}`} className="flex items-center gap-2.5">
        <Image src="/logo.png" alt={brand} width={64} height={32} priority className="h-8 w-auto" />
        <span className="font-display text-2xl tracking-wide text-burgundy">{brand}</span>
      </Link>

      {showNav && (
        <nav className="hidden gap-7 text-sm text-mocha sm:flex">
          <Link href={`/${locale}/shop`} className={linkCls}>{nav.shop}</Link>
          <Link href={`/${locale}/story`} className={linkCls}>{nav.story}</Link>
          <Link href={`/${locale}/contact`} className={linkCls}>{nav.contact}</Link>
        </nav>
      )}

      <Link
        href={`/${other}${langPath}`}
        className="rounded-full border border-gold/50 px-4 py-1.5 text-xs text-mocha transition hover:bg-gold/10"
      >
        {languageName}
      </Link>
    </header>
  );
}
