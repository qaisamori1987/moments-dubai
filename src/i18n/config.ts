export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
// Arabic-first: the brand's audience is predominantly Arabic-speaking
// (see Instagram content pack). "/" lands on /ar; English lives at /en.
export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
