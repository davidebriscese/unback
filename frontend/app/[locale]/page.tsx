import { Sparkles } from "lucide-react";
import { ApiSection } from "@/components/sections/api-section";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { BackgroundRemover } from "@/components/tool/background-remover";
import { defaultLocale, getDictionary, isLocale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(isLocale(locale) ? locale : defaultLocale);

  return (
    <div className="relative isolate flex flex-1 flex-col overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/25 via-fuchsia-500/20 to-purple-500/25 blur-3xl"
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-16 px-6 py-14">
        <section className="flex flex-col gap-8">
          <header className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="size-3.5 text-primary" />
              {dictionary.hero.badge}
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {dictionary.hero.titleLead}{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                {dictionary.hero.titleAccent}
              </span>
            </h1>
            <p className="max-w-lg text-balance text-muted-foreground">
              {dictionary.hero.subtitle}
            </p>
          </header>

          <BackgroundRemover dictionary={dictionary.tool} />
        </section>

        <Features dictionary={dictionary.features} />
        <ApiSection dictionary={dictionary.api} />
        <Faq dictionary={dictionary.faq} />
      </main>
    </div>
  );
}
