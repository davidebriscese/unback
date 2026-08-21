import { ChevronDown } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

export function Faq({ dictionary }: { dictionary: Dictionary["faq"] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold tracking-tight">{dictionary.title}</h2>
      <div className="divide-y rounded-2xl border">
        {dictionary.items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium marker:content-none">
              {item.question}
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="pt-2 text-sm text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
