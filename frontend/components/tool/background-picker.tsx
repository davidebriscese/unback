"use client";

import { Pipette } from "lucide-react";
import { cn } from "@/lib/utils";

/** null means "keep the transparency", any other value is a CSS colour used for the download too. */
export type Background = string | null;

export function BackgroundPicker({
  value,
  onChange,
  labels,
}: {
  value: Background;
  onChange: (background: Background) => void;
  labels: { group: string; transparent: string; white: string; black: string; custom: string };
}) {
  const presets: { background: Background; label: string; className: string }[] = [
    { background: null, label: labels.transparent, className: "checkerboard" },
    { background: "#ffffff", label: labels.white, className: "bg-white" },
    { background: "#111111", label: labels.black, className: "bg-neutral-900" },
  ];

  const isCustom = value !== null && !presets.some((preset) => preset.background === value);

  return (
    <div
      role="group"
      aria-label={labels.group}
      className="flex items-center gap-1.5 rounded-full border bg-card p-1.5 shadow-sm"
    >
      {presets.map((preset) => (
        <button
          key={preset.label}
          type="button"
          onClick={() => onChange(preset.background)}
          aria-label={preset.label}
          title={preset.label}
          aria-pressed={value === preset.background}
          className={cn(
            "size-6 rounded-full border",
            preset.className,
            value === preset.background
              ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
              : "opacity-70 hover:opacity-100",
          )}
        />
      ))}

      <label
        title={labels.custom}
        className={cn(
          "relative flex size-6 cursor-pointer items-center justify-center rounded-full border",
          isCustom
            ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
            : "opacity-70 hover:opacity-100",
        )}
        style={isCustom ? { backgroundColor: value } : undefined}
      >
        {!isCustom && <Pipette className="size-3.5 text-muted-foreground" />}
        <span className="sr-only">{labels.custom}</span>
        <input
          type="color"
          value={typeof value === "string" ? value : "#7c3aed"}
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}
