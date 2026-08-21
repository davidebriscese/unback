/**
 * Public identity of this deployment. NEXT_PUBLIC_* values are inlined at build time, so a
 * self-hosted build without them still works — only canonical URLs fall back to the placeholder.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unback.app";

export const GITHUB_URL = "https://github.com/davidebriscese/unback";

export const OPENAPI_URL = "/openapi/v1.json";
