import "server-only";
import type { Locale } from "./config";

// Dynamic imports keep translation JSON on the server only — never shipped
// to the client bundle (see Next.js i18n guide).
const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
