/**
 * Client for the Unback API. In production the app is served by the backend itself, so requests go
 * to the same origin; in development they cross over to the dotnet process.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:5210" : "");

export const MAX_UPLOAD_MB = 15;

/** Keys of `dictionary.tool.errors`: the server's own English prose is never shown to users. */
export type ApiErrorCode =
  | "notImage"
  | "tooLarge"
  | "badImage"
  | "tooManyPixels"
  | "busy"
  | "dailyLimit"
  | "network"
  | "unknown";

/** Maps the API's stable error codes onto the messages we have translations for. */
const SERVER_CODES: Record<string, ApiErrorCode> = {
  missing_file: "notImage",
  unsupported_media_type: "notImage",
  file_too_large: "tooLarge",
  payload_too_large: "tooLarge",
  invalid_image: "badImage",
  too_many_pixels: "tooManyPixels",
  rate_limited: "busy",
  daily_limit_reached: "dailyLimit",
  server_busy: "busy",
};

export class ApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly retryAfter?: number,
  ) {
    super(code);
    this.name = "ApiError";
  }
}

/** Rejects a file the API would reject anyway, without spending a request on it. */
export function validateFile(file: File): ApiErrorCode | null {
  if (!file.type.startsWith("image/")) return "notImage";
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return "tooLarge";
  return null;
}

export async function removeBackground(file: File): Promise<Blob> {
  const body = new FormData();
  body.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/v1/remove`, { method: "POST", body });
  } catch {
    throw new ApiError("network");
  }

  if (!response.ok) {
    throw new ApiError(SERVER_CODES[await serverCode(response)] ?? "unknown", retryAfter(response));
  }

  return response.blob();
}

export async function fetchHealth(): Promise<{ model: string; version: string } | null> {
  try {
    const response = await fetch(`${API_BASE}/healthz`);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

async function serverCode(response: Response): Promise<string> {
  try {
    return (await response.json())?.code ?? "";
  } catch {
    return "";
  }
}

function retryAfter(response: Response): number | undefined {
  const seconds = Number(response.headers.get("retry-after"));
  return Number.isFinite(seconds) && seconds > 0 ? seconds : undefined;
}
