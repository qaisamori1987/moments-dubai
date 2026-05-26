import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { dir, isLocale, locales } from "@/i18n/config";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return locale === "ar"
    ? {
        title: "لحظات — هدايا مخصّصة وتوزيعات مواليد في دبي",
        description:
          "هدايا فاخرة مخصّصة وتوزيعات مواليد وشوكولاتة بالأسماء، صُنعت بكل حب — توصيل لجميع أنحاء الإمارات.",
      }
    : {
        title: "Moments — Personalised Gifts & Baby Favors in Dubai",
        description:
          "Personalised luxury gifts, newborn keepsakes and named chocolate favors, handmade with love and delivered across the UAE.",
      };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const fontVars = `${cormorant.variable} ${inter.variable} ${tajawal.variable}`;

  return (
    <html lang={locale} dir={dir(locale)} className={fontVars}>
      <body
        className={`${locale === "ar" ? "font-arabic" : "font-body"} overflow-x-hidden bg-ivory text-charcoal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
