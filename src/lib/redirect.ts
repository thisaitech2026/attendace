import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Same-origin redirect using a relative path.
 * Absolute redirects break in cloud previews when Host headers differ
 * from the URL shown in the browser (e.g. localhost vs *.agent.cvm.dev).
 */
export function redirectResponse(path: string, status = 303): NextResponse {
  const response = new NextResponse(null, { status });
  response.headers.set("Location", path);
  return response;
}

export function isSecureRequest(request: NextRequest): boolean {
  return (
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"
  );
}
