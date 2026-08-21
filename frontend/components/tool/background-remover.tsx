"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleAlert, Download, ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { BackgroundPicker, type Background } from "@/components/tool/background-picker";
import { BeforeAfterSlider } from "@/components/tool/before-after-slider";
import { SampleStrip } from "@/components/tool/sample-strip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ApiError,
  MAX_UPLOAD_MB,
  removeBackground,
  validateFile,
  type ApiErrorCode,
} from "@/lib/api";
import { compositePng } from "@/lib/composite";
import { t, type Dictionary } from "@/lib/i18n";

type Status = "idle" | "processing" | "done" | "error";

export function BackgroundRemover({ dictionary }: { dictionary: Dictionary["tool"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [background, setBackground] = useState<Background>(null);
  const [preparing, setPreparing] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  // Track the live object URLs so they can be revoked if the component unmounts mid-session.
  const liveUrls = useRef<{ original: string | null; result: string | null }>({
    original: null,
    result: null,
  });
  useEffect(() => {
    liveUrls.current = { original: originalUrl, result: result?.url ?? null };
  });
  useEffect(
    () => () => {
      if (liveUrls.current.original) URL.revokeObjectURL(liveUrls.current.original);
      if (liveUrls.current.result) URL.revokeObjectURL(liveUrls.current.result);
    },
    [],
  );

  const describe = useCallback(
    (code: ApiErrorCode, retryAfter?: number) => {
      const { errors } = dictionary;
      if (code === "tooLarge") return t(errors.tooLarge, { mb: MAX_UPLOAD_MB });
      if (code === "busy" && retryAfter) return t(errors.busyRetry, { s: retryAfter });
      return errors[code];
    },
    [dictionary],
  );

  const process = useCallback(
    async (file: File) => {
      // One image at a time: a paste or drop during processing would race two requests, and the
      // later setResult would win and revoke the other's URL.
      if (inFlight.current) return;

      const invalid = validateFile(file);
      if (invalid) {
        setError(describe(invalid));
        setStatus("error");
        return;
      }

      inFlight.current = true;
      setStatus("processing");
      setError(null);
      setDownloadError(null);
      setOriginalUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(file);
      });

      const started = performance.now();
      try {
        const blob = await removeBackground(file);
        setResult((previous) => {
          if (previous) URL.revokeObjectURL(previous.url);
          return { blob, url: URL.createObjectURL(blob) };
        });
        setElapsedMs(Math.round(performance.now() - started));
        setStatus("done");
      } catch (thrown) {
        setError(
          thrown instanceof ApiError
            ? describe(thrown.code, thrown.retryAfter)
            : dictionary.errors.unknown,
        );
        setStatus("error");
      } finally {
        inFlight.current = false;
      }
    },
    [describe, dictionary],
  );

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((candidate) =>
        candidate.type.startsWith("image/"),
      );
      if (file) {
        event.preventDefault();
        void process(file);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [process]);

  const reset = useCallback(() => {
    setOriginalUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setResult((previous) => {
      if (previous) URL.revokeObjectURL(previous.url);
      return null;
    });
    setElapsedMs(null);
    setError(null);
    setDownloadError(null);
    setBackground(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  async function download() {
    if (!result) return;

    // Transparent downloads hand back exactly what the API produced; a colour is composited here.
    if (!background) {
      save(result.url);
      return;
    }

    setPreparing(true);
    setDownloadError(null);
    try {
      const composited = await compositePng(result.blob, background);
      const url = URL.createObjectURL(composited);
      save(url);
      // Revoke after the download has surely started; revoking synchronously cancels it in Firefox.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      setDownloadError(dictionary.errors.unknown);
    } finally {
      setPreparing(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void process(file);
        }}
      />

      <p aria-live="polite" className="sr-only">
        {status === "processing" ? dictionary.processing : status === "done" ? dictionary.ready : ""}
      </p>

      {(status === "idle" || status === "error") && (
        <>
          <Card className="rounded-3xl">
            <CardContent className="p-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  const file = event.dataTransfer.files?.[0];
                  if (file) void process(file);
                }}
                className={`flex min-h-72 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                  dragging
                    ? "scale-[0.99] border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ImagePlus className="size-8" />
                </span>
                <span className="text-lg font-semibold">{dictionary.dropTitle}</span>
                <span className="max-w-sm text-sm text-muted-foreground">
                  {dictionary.dropHint}{" "}
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {dictionary.pasteKey}
                  </kbd>
                  <br />
                  {t(dictionary.dropFormats, { mb: MAX_UPLOAD_MB })}
                </span>
              </button>

              {status === "error" && error && (
                <p
                  role="alert"
                  className="mt-3 flex items-start gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          <SampleStrip
            label={dictionary.samplesLabel}
            alts={dictionary.samples}
            onPick={(file) => void process(file)}
          />
        </>
      )}

      {status === "processing" && originalUrl && (
        <Card className="rounded-3xl">
          <CardContent className="p-3">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={originalUrl}
                alt={dictionary.originalAlt}
                className="mx-auto block max-h-[60vh] w-auto opacity-50 blur-[2px]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/50">
                <Loader2 className="size-9 animate-spin text-primary" />
                <p className="font-medium">{dictionary.processing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "done" && originalUrl && result && (
        <div className="flex flex-col gap-5">
          <BeforeAfterSlider
            originalUrl={originalUrl}
            resultUrl={result.url}
            background={background}
            labels={{
              before: dictionary.before,
              after: dictionary.after,
              compare: dictionary.compareLabel,
              originalAlt: dictionary.originalAlt,
              resultAlt: dictionary.resultAlt,
            }}
          />

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <p className="text-sm text-muted-foreground">
              {dictionary.compareHint}
              {elapsedMs !== null && (
                <>
                  {" · "}
                  <span className="font-medium text-primary">
                    {(elapsedMs / 1000).toFixed(1)}s
                  </span>
                </>
              )}
            </p>
            <BackgroundPicker
              value={background}
              onChange={setBackground}
              labels={{
                group: dictionary.bgLabel,
                transparent: dictionary.bgTransparent,
                white: dictionary.bgWhite,
                black: dictionary.bgBlack,
                custom: dictionary.bgCustom,
              }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full px-6"
              disabled={preparing}
              onClick={() => void download()}
            >
              <Download data-icon="inline-start" />
              {preparing ? dictionary.preparing : dictionary.download}
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6" onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              {dictionary.reset}
            </Button>
          </div>

          {downloadError && (
            <p role="alert" className="text-center text-sm text-destructive">
              {downloadError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function save(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "unback.png";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
