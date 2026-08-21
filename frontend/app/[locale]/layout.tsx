import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  localeInfo,
  localeParams,
  locales,
  type Locale,
} from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/** Applies the stored theme before the first paint, so there is no flash of the wrong one. */
const themeScript = `try{var t=localStorage.theme;if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export const dynamicParams = false;

export const generateStaticParams = localeParams;

function resolve(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolve((await params).locale);
  const dictionary = getDictionary(locale);
  const { path, ogLocale } = localeInfo[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    applicationName: "Unback",
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(locales.map((code) => [code, localeInfo[code].path])),
        "x-default": localeInfo[defaultLocale].path,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Unback",
      url: path,
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      locale: ogLocale,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: dictionary.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.title,
      description: dictionary.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = resolve((await params).locale);
  const dictionary = getDictionary(locale);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Unback",
    url: new URL(localeInfo[locale].path, SITE_URL).toString(),
    description: dictionary.meta.description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteHeader dictionary={dictionary.header} />
        {children}
        <SiteFooter dictionary={dictionary.footer} locale={locale} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
