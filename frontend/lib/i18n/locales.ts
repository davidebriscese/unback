export const locales = ["en", "de", "es", "fr", "it", "ja", "pt", "ru", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Everything locale-shaped derives from this table: static params, canonical URLs, hreflang
 * alternates, the sitemap and the language switcher. Adding a language means adding one entry
 * here and one dictionary file.
 */
export const localeInfo: Record<Locale, { nativeName: string; ogLocale: string; path: string }> = {
  en: { nativeName: "English", ogLocale: "en_US", path: "/" },
  de: { nativeName: "Deutsch", ogLocale: "de_DE", path: "/de" },
  es: { nativeName: "Español", ogLocale: "es_ES", path: "/es" },
  fr: { nativeName: "Français", ogLocale: "fr_FR", path: "/fr" },
  it: { nativeName: "Italiano", ogLocale: "it_IT", path: "/it" },
  ja: { nativeName: "日本語", ogLocale: "ja_JP", path: "/ja" },
  pt: { nativeName: "Português", ogLocale: "pt_BR", path: "/pt" },
  ru: { nativeName: "Русский", ogLocale: "ru_RU", path: "/ru" },
  zh: { nativeName: "中文", ogLocale: "zh_CN", path: "/zh" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Canonical URL of a page in a locale: the default locale lives at the root ("/", "/privacy"),
 * every other locale under its prefix ("/it", "/it/privacy").
 */
export function localePath(locale: Locale, page = ""): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return page ? `${prefix}/${page}` : prefix || "/";
}
