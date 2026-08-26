"use client";

import { Menu } from "@base-ui/react/menu";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Languages } from "lucide-react";
import { isLocale, localeInfo, localePath, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * A dropdown rather than a row of links: nine languages do not fit a footer line, and a native
 * select cannot be themed. Items stay real anchors, so middle-click and open-in-new-tab work and
 * switching language is a full page load - which is correct when the whole document changes.
 */
export function LocaleSwitcher({ active, label }: { active: Locale; label: string }) {
  // Stay on the same page when switching: /it/privacy → /de/privacy. The locale prefix is stripped
  // either way, so the exported "/en/privacy" and the served "/privacy" produce the same links.
  const segments = (usePathname() ?? "/").split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) segments.shift();
  const page = segments.join("/");

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={label}
        className="inline-flex items-center gap-2 w-fit place-self-end md:place-self-auto rounded-lg border bg-card px-2.5 py-1.5 text-sm shadow-sm transition-colors outline-none select-none hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted"
      >
        <Languages className="size-4 shrink-0" />
        {localeInfo[active].nativeName}
        <ChevronDown className="size-3.5 shrink-0 opacity-60 transition-transform data-popup-open:rotate-180" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="top" align="end" sideOffset={6} className="z-30 outline-none">
          <Menu.Popup className="max-h-[min(24rem,var(--available-height))] origin-[var(--transform-origin)] overflow-y-auto rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg outline-none transition-[transform,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            {locales.map((locale) => (
              <Menu.LinkItem
                key={locale}
                href={localePath(locale, page)}
                hrefLang={locale}
                aria-current={locale === active ? "true" : undefined}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none select-none data-highlighted:bg-muted",
                  locale === active ? "font-medium" : "text-muted-foreground",
                )}
              >
                <Check
                  className={cn("size-3.5 shrink-0", locale === active ? "text-primary" : "invisible")}
                />
                {localeInfo[locale].nativeName}
              </Menu.LinkItem>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
