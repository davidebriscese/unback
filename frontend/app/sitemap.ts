import type { MetadataRoute } from "next";
import { defaultLocale, localePath, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const pages = ["", "privacy"];

function absolute(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => {
    const languages = {
      ...Object.fromEntries(locales.map((locale) => [locale, absolute(localePath(locale, page))])),
      "x-default": absolute(localePath(defaultLocale, page)),
    };

    return locales.map((locale) => ({
      url: absolute(localePath(locale, page)),
      alternates: { languages },
    }));
  });
}
