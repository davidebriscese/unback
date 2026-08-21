import { ArrowUpRight } from "lucide-react";
import { ApiExample } from "@/components/sections/api-example";
import type { Dictionary } from "@/lib/i18n";
import { GITHUB_URL, OPENAPI_URL } from "@/lib/site";

export function ApiSection({ dictionary }: { dictionary: Dictionary["api"] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold tracking-tight">{dictionary.title}</h2>
      <p className="max-w-2xl text-muted-foreground">{dictionary.body}</p>

      <ApiExample labels={{ copy: dictionary.copy, copied: dictionary.copied }} />

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a
          href={OPENAPI_URL}
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          {dictionary.docsLink}
          <ArrowUpRight className="size-3.5" />
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          {dictionary.githubLink}
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
