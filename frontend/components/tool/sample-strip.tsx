"use client";

import { loadSample, samples, type SampleId } from "@/lib/samples";

export function SampleStrip({
  label,
  alts,
  onPick,
}: {
  label: string;
  alts: Record<SampleId, string>;
  onPick: (file: File) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
      <span>{label}</span>
      <div className="flex gap-2">
        {samples.map((sample) => (
          <button
            key={sample.id}
            type="button"
            title={alts[sample.id]}
            onClick={() => void loadSample(sample.src).then(onPick)}
            className="size-14 overflow-hidden rounded-xl border transition-all hover:scale-105 hover:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <img src={sample.src} alt={alts[sample.id]} className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
