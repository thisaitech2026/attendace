import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rental-management-secret-key-change-in-production"
);

type Role = "ADMIN" | "CUSTOMER";

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return redirectTo(request, "/login");
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as Role;

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return redirectTo(request, "/login");
    }
    if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
      return redirectTo(request, "/login");
    }

    return NextResponse.next();
  } catch {
    const response = redirectTo(request, "/login");
    response.cookies.set("auth-token", "", { httpOnly: true, maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
};
