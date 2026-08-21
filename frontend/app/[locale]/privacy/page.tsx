import type { Metadata } from "next";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  localePath,
  locales,
  type Locale,
} from "@/lib/i18n";

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

  return {
    title: `${dictionary.privacy.title} — Unback`,
    description: dictionary.privacy.metaDescription,
    alternates: {
      canonical: localePath(locale, "privacy"),
      languages: {
        ...Object.fromEntries(locales.map((code) => [code, localePath(code, "privacy")])),
        "x-default": localePath(defaultLocale, "privacy"),
      },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolve((await params).locale);
  const dictionary = getDictionary(locale).privacy;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-14">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.title}</h1>
        <p className="text-sm text-muted-foreground">{dictionary.updated}</p>
      </header>

      <p className="text-muted-foreground">{dictionary.intro}</p>

      {dictionary.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          <p className="text-muted-foreground">{section.body}</p>
        </section>
      ))}
    </main>
  );
}
