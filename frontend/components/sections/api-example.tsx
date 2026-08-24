"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";

const noopSubscribe = () => () => {};

/**
 * Shows the command against the host the visitor is actually on, so a self-hosted instance
 * documents itself. The exported HTML carries the canonical URL until hydration.
 */
export function ApiExample({ labels }: { labels: { copy: string; copied: string } }) {
  const origin = useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => SITE_URL,
  );
  const [copied, setCopied] = useState(false);

  const command = `curl -F "file=@photo.jpg" ${origin}/api/v1/remove -o unback.png`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      trackEvent("api_snippet_copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission): leave the button unchanged.
    }
  }

  return (
    <div className="relative rounded-2xl border bg-muted/40">
      <pre className="overflow-x-auto p-4 pr-24 text-sm">
        <code className="font-mono">{command}</code>
      </pre>
      <Button
        variant="outline"
        size="sm"
        className="absolute right-2 top-2 gap-1.5"
        onClick={() => void copy()}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? labels.copied : labels.copy}
      </Button>
    </div>
  );
}
