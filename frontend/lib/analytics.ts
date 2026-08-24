/**
 * Analytics is the server's decision, not the build's. The backend serves /analytics.js, which is
 * empty unless whoever runs the instance configured a measurement ID - so one image ships to
 * everyone and nothing is measured until someone opts in with their own property. Nothing here
 * knows or embeds an ID.
 */
import { API_BASE } from "@/lib/api";

export const ANALYTICS_SCRIPT_URL = `${API_BASE}/analytics.js`;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 accepts scalars as event parameters; anything else is dropped server-side anyway. */
type EventParams = Record<string, string | number | boolean>;

/**
 * Fire-and-forget. A no-op whenever the tag never loaded - unconfigured instance, dev, or a
 * blocker - so call sites never have to know whether analytics exists.
 *
 * Only ever send derived, non-identifying facts: which control was used, how long inference took,
 * which error code came back. Never a file name, never image content.
 */
export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
