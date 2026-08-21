import { en, type Dictionary } from "./en";
import { it } from "./it";
import { locales, type Locale } from "./locales";

const dictionaries: Record<Locale, Dictionary> = { en, it };

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
