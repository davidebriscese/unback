import { LocaleSwitcher } from "@/components/locale-switcher";
import { LogoMark } from "@/components/logo";
import { ModelBadge } from "@/components/model-badge";
import type { Dictionary, Locale } from "@/lib/i18n";
import { GITHUB_URL } from "@/lib/site";

export function SiteFooter({
  dictionary,
  locale,
}: {
  dictionary: Dictionary["footer"];
  locale: Locale;
}) {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <LogoMark className="size-5" />
            {dictionary.tagline}
          </span>
          <span>{dictionary.privacy}</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <a
              href={`${GITHUB_URL}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {dictionary.license}
            </a>
            <ModelBadge label={dictionary.model} />
          </span>
        </div>
        <LocaleSwitcher active={locale} label={dictionary.language} />
      </div>
    </footer>
  );
}
