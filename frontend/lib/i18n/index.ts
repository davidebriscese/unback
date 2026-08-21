import { de } from "./de";
import { en, type Dictionary } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { ja } from "./ja";
import { pt } from "./pt";
import { ru } from "./ru";
import { zh } from "./zh";
import { locales, type Locale } from "./locales";

const dictionaries: Record<Locale, Dictionary> = { en, de, es, fr, it, ja, pt, ru, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Feeds `generateStaticParams` on every route segmented by locale. */
export function localeParams() {
  return locales.map((locale) => ({ locale }));
}

/** Fills `{name}` placeholders: `t("up to {mb}MB", { mb: 15 })`. */
export function t(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
export * from "./locales";
