import { localeInfo, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Plain anchors on purpose: the canonical English URL is "/" — not a route in the exported app —
 * and a full reload is the right behaviour when the document language changes.
 */
export function LocaleSwitcher({ active, label }: { active: Locale; label: string }) {
  return (
    <nav aria-label={label} className="flex items-center gap-1">
      {locales.map((locale) => (
        <a
          key={locale}
          href={localeInfo[locale].path}
          hrefLang={locale}
          aria-current={locale === active ? "true" : undefined}
          className={cn(
            "rounded-md px-2 py-1 transition-colors",
            locale === active
              ? "bg-muted font-medium text-foreground"
              : "hover:bg-muted hover:text-foreground",
          )}
        >
          {localeInfo[locale].nativeName}
        </a>
      ))}
    </nav>
  );
}
