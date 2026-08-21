"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

export function BeforeAfterSlider({
  originalUrl,
  resultUrl,
  background,
  labels,
}: {
  originalUrl: string;
  resultUrl: string;
  /** A CSS colour, or null for the transparency checkerboard. */
  background: string | null;
  labels: { before: string; after: string; compare: string; originalAlt: string; resultAlt: string };
}) {
  const [position, setPosition] = useState(50);
  const [ratio, setRatio] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const element = containerRef.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100)));
  }, []);

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={labels.compare}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      className="relative mx-auto cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border shadow-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      style={
        ratio
          ? { aspectRatio: `${ratio}`, width: `min(100%, calc(68vh * ${ratio}))` }
          : { width: "100%" }
      }
      onPointerDown={(event) => {
        draggingRef.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        moveTo(event.clientX);
      }}
      onPointerMove={(event) => {
        if (draggingRef.current) moveTo(event.clientX);
      }}
      onPointerUp={(event) => {
        draggingRef.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") setPosition((value) => Math.max(0, value - 5));
        if (event.key === "ArrowRight") setPosition((value) => Math.min(100, value + 5));
      }}
    >
      <div
        className={`h-full w-full ${background ? "" : "checkerboard"}`}
        style={background ? { backgroundColor: background } : undefined}
      >
        <img
          src={resultUrl}
          alt={labels.resultAlt}
          className="h-full w-full"
          draggable={false}
          onLoad={(event) =>
            setRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)
          }
        />
      </div>

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img
          src={originalUrl}
          alt={labels.originalAlt}
          className="h-full w-full bg-background"
          draggable={false}
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-700 shadow-lg ring-1 ring-black/10">
          <ChevronsLeftRight className="size-5" />
        </div>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
        {labels.before}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
        {labels.after}
      </span>
    </div>
  );
}
