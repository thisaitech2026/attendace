import type { NextRequest } from "next/server";

/**
 * Build a browser-safe redirect URL.
 * The dev server binds to 0.0.0.0, but browsers cannot open that host.
 * Prefer proxy/client host headers when present.
 */
export function getRedirectUrl(request: NextRequest, path: string): URL {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = request.headers.get("host");
  const host = forwardedHost?.split(",")[0].trim() || hostHeader || "localhost:3000";

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto
    ? `${forwardedProto}:`
    : request.nextUrl.protocol;

  const safeHost = host.replace(/^0\.0\.0\.0(?=:|$)/, "localhost");

  return new URL(path, `${protocol}//${safeHost}`);
}

export function isSecureRequest(request: NextRequest): boolean {
  return (
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"
  );
}
