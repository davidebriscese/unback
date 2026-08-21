"use client";

import { useEffect, useState } from "react";
import { fetchHealth } from "@/lib/api";

/** Names the model actually loaded on this instance. Fails soft: renders nothing if unreachable. */
export function ModelBadge({ label }: { label: string }) {
  const [model, setModel] = useState<string | null>(null);

  useEffect(() => {
    void fetchHealth().then((health) => health && setModel(health.model));
  }, []);

  if (!model) return null;

  return (
    <span>
      {label}: <code className="font-mono">{model}</code>
    </span>
  );
}
