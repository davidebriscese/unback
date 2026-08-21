import type { MetadataRoute } from "next";
import { localeInfo, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const alternates = Object.fromEntries(
  locales.map((locale) => [locale, new URL(localeInfo[locale].path, SITE_URL).toString()]),
);

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: new URL(localeInfo[locale].path, SITE_URL).toString(),
    alternates: { languages: alternates },
  }));
}
