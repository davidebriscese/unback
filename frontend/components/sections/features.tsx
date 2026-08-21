import { Gift, GitFork, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Dictionary } from "@/lib/i18n";

const icons = [Gift, ShieldCheck, GitFork];

export function Features({ dictionary }: { dictionary: Dictionary["features"] }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-center text-2xl font-semibold tracking-tight">{dictionary.title}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {dictionary.items.map((item, index) => {
          const Icon = icons[index] ?? Gift;
          return (
            <Card key={item.title} className="rounded-2xl">
              <CardContent className="flex flex-col gap-2 p-5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
