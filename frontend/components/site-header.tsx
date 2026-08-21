import { GithubMark } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";
import { GITHUB_URL } from "@/lib/site";

export function SiteHeader({ dictionary }: { dictionary: Dictionary["header"] }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-6 py-3">
        <Logo />
        <div className="ml-auto flex items-center gap-1">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={dictionary.github}
            className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2" })}
          >
            <GithubMark />
            <span className="hidden sm:inline">{dictionary.github}</span>
          </a>
          <ThemeToggle label={dictionary.theme} />
        </div>
      </div>
    </header>
  );
}
