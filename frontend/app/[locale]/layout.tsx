import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics";
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
import { GITHUB_URL, SITE_URL } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/** Applies the stored theme before the first paint, so there is no flash of the wrong one. */
const themeScript = `try{var t=localStorage.theme;if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export const dynamicParams = false;

export const generateStaticParams = localeParams;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

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
  const image = { url: "/og.png", width: 1200, height: 630, alt: dictionary.meta.ogAlt };

  return {
    metadataBase: new URL(SITE_URL),
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    applicationName: "Unback",
    appleWebApp: { capable: true, title: "Unback", statusBarStyle: "black-translucent" },
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
      // Advertise the sibling languages to scrapers.
      alternateLocale: locales.filter((code) => code !== locale).map((code) => localeInfo[code].ogLocale),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      images: [image],
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
  const url = new URL(localeInfo[locale].path, SITE_URL).toString();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Unback",
        url,
        description: dictionary.meta.description,
        applicationCategory: "DesignApplication",
        operatingSystem: "Any",
        inLanguage: locale,
        sameAs: [GITHUB_URL],
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: dictionary.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a
          href="#tool"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          {dictionary.header.skipToTool}
        </a>
        <SiteHeader dictionary={dictionary.header} />
        {children}
        <SiteFooter dictionary={dictionary.footer} locale={locale} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
