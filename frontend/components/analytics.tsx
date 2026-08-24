import Script from "next/script";
import { ANALYTICS_SCRIPT_URL } from "@/lib/analytics";

/**
 * Always mounted, because whether it measures anything is decided at runtime by the server. The
 * src is same-origin, so it needs no CSP exception of its own; only the gtag.js host it goes on
 * to append does.
 */
export function Analytics() {
  return <Script src={ANALYTICS_SCRIPT_URL} strategy="afterInteractive" />;
}
