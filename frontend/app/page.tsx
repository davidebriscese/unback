"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronsLeftRight,
  CircleAlert,
  Download,
  ImagePlus,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5210";
const MAX_UPLOAD_MB = 15;

type Status = "idle" | "processing" | "done" | "error";
type PreviewBg = "checker" | "white" | "dark";

const previewBgClass: Record<PreviewBg, string> = {
  checker: "checkerboard",
  white: "bg-white",
  dark: "bg-neutral-900",
};

function BeforeAfter({
  originalUrl,
  resultUrl,
  previewBg,
}: {
  originalUrl: string;
  resultUrl: string;
  previewBg: PreviewBg;
}) {
  const [pos, setPos] = useState(50);
  const [ratio, setRatio] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Confronto prima/dopo"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      className="relative mx-auto cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border shadow-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      style={
        ratio
          ? { aspectRatio: `${ratio}`, width: `min(100%, calc(70vh * ${ratio}))` }
          : { width: "100%" }
      }
      onPointerDown={(e) => {
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) moveTo(e.clientX);
      }}
      onPointerUp={(e) => {
        draggingRef.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
      }}
    >
      <div className={`h-full w-full ${previewBgClass[previewBg]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resultUrl}
          alt="Immagine senza sfondo"
          className="h-full w-full"
          draggable={false}
          onLoad={(e) =>
            setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)
          }
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalUrl}
          alt="Immagine originale"
          className="h-full w-full bg-background"
          draggable={false}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-700 shadow-lg ring-1 ring-black/10">
          <ChevronsLeftRight className="size-5" />
        </div>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
        Prima
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
        Dopo
      </span>
    </div>
  );
}

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [previewBg, setPreviewBg] = useState<PreviewBg>("checker");
  const [modelName, setModelName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/healthz`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.model && setModelName(j.model))
      .catch(() => {});
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Il file selezionato non è un'immagine.");
      setStatus("error");
      return;
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`Immagine troppo grande: il limite è ${MAX_UPLOAD_MB}MB.`);
      setStatus("error");
      return;
    }

    setStatus("processing");
    setError(null);
    setOriginalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    const form = new FormData();
    form.append("file", file);
    const started = performance.now();

    try {
      const res = await fetch(`${API_URL}/api/remove-background`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        let message = `Errore del server (${res.status}).`;
        try {
          const body = await res.json();
          if (body?.error) message = body.error;
        } catch {
          // corpo non JSON, teniamo il messaggio generico
        }
        const retryAfter = res.headers.get("retry-after");
        if (retryAfter && (res.status === 429 || res.status === 503)) {
          message += ` Riprova tra ~${retryAfter}s.`;
        }
        throw new Error(message);
      }
      const blob = await res.blob();
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setElapsedMs(Math.round(performance.now() - started));
      setStatus("done");
    } catch (e) {
      setError(
        e instanceof TypeError
          ? `Backend non raggiungibile: è avviato su ${API_URL}?`
          : e instanceof Error
            ? e.message
            : "Errore imprevisto.",
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith("image/"),
      );
      if (file) {
        e.preventDefault();
        void processFile(file);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [processFile]);

  const reset = useCallback(() => {
    setOriginalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setElapsedMs(null);
    setError(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void processFile(file);
    },
    [processFile],
  );

  return (
    <div className="relative isolate flex flex-1 flex-col overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/25 via-fuchsia-500/20 to-purple-500/25 blur-3xl"
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-14">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-3.5 text-primary" />
            no-bg · AI in locale, niente cloud
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Rimuovi lo sfondo{" "}
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              in un istante
            </span>
          </h1>
          <p className="max-w-md text-balance text-muted-foreground">
            Carica una foto e ottieni un PNG con sfondo trasparente, pronto da
            scaricare.
          </p>
        </header>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void processFile(file);
          }}
        />

        {(status === "idle" || status === "error") && (
          <Card className="rounded-3xl">
            <CardContent className="p-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex min-h-72 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                  dragging
                    ? "scale-[0.99] border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ImagePlus className="size-8" />
                </span>
                <span className="text-lg font-semibold">
                  Trascina qui un&apos;immagine
                </span>
                <span className="max-w-sm text-sm text-muted-foreground">
                  oppure clicca per selezionarla, o incolla con{" "}
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                    Ctrl+V
                  </kbd>
                  <br />
                  JPG, PNG, WebP — max {MAX_UPLOAD_MB}MB
                </span>
              </button>
              {status === "error" && error && (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {status === "processing" && originalUrl && (
          <Card className="rounded-3xl">
            <CardContent className="p-3">
              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Anteprima in elaborazione"
                  className="mx-auto block max-h-[60vh] w-auto opacity-50 blur-[2px]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/50">
                  <Loader2 className="size-9 animate-spin text-primary" />
                  <p className="font-medium">Rimozione dello sfondo…</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {status === "done" && originalUrl && resultUrl && (
          <div className="flex flex-col gap-5">
            <BeforeAfter
              originalUrl={originalUrl}
              resultUrl={resultUrl}
              previewBg={previewBg}
            />

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <p className="text-sm text-muted-foreground">
                Trascina il cursore per confrontare
                {elapsedMs !== null && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-medium text-primary">
                      {(elapsedMs / 1000).toFixed(1)}s
                    </span>
                  </>
                )}
              </p>
              <div
                className="flex items-center gap-1.5 rounded-full border bg-card p-1.5 shadow-sm"
                role="group"
                aria-label="Sfondo dell'anteprima"
              >
                {(Object.keys(previewBgClass) as PreviewBg[]).map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setPreviewBg(bg)}
                    aria-label={`Anteprima su sfondo ${
                      bg === "checker" ? "trasparente" : bg === "white" ? "bianco" : "scuro"
                    }`}
                    aria-pressed={previewBg === bg}
                    className={`size-6 rounded-full border ${previewBgClass[bg]} ${
                      previewBg === bg
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="rounded-full px-6"
                nativeButton={false}
                render={<a href={resultUrl} download="no-bg.png" />}
              >
                <Download data-icon="inline-start" />
                Scarica PNG
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6"
                onClick={reset}
              >
                <RotateCcw data-icon="inline-start" />
                Nuova immagine
              </Button>
            </div>
          </div>
        )}

        <footer className="mt-auto pt-10 text-center text-xs text-muted-foreground">
          Elaborazione locale in .NET con ONNX Runtime
          {modelName ? ` · modello ${modelName}` : ""} — nessuna immagine lascia
          il tuo server.
        </footer>
      </main>
    </div>
  );
}
