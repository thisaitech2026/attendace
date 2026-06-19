import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";

function getRedirectUrl(request: NextRequest, path: string) {
  return new URL(path, request.url);
}

function setAuthCookie(response: NextResponse, request: NextRequest, token: string) {
  const isSecure = request.nextUrl.protocol === "https:";
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let username = "";
    let password = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      username = String(body.username || "").trim();
      password = String(body.password || "");
    } else {
      const formData = await request.formData();
      username = String(formData.get("username") || "").trim();
      password = String(formData.get("password") || "");
    }

    if (!username || !password) {
      if (contentType.includes("application/json")) {
        return NextResponse.json({ error: "Username and password required" }, { status: 400 });
      }
      return NextResponse.redirect(
        getRedirectUrl(request, "/login?error=missing"),
        { status: 303 }
      );
    }

    const result = await authenticateUser(username, password);
    if (!result) {
      if (contentType.includes("application/json")) {
        return NextResponse.json(
          { error: "Invalid username or password. Use admin/admin123 or rajesh/customer123" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(
        getRedirectUrl(request, "/login?error=invalid"),
        { status: 303 }
      );
    }

    const redirectPath = result.user.role === "ADMIN" ? "/admin" : "/customer";

    if (contentType.includes("application/json")) {
      const response = NextResponse.json({
        user: result.user,
        redirect: redirectPath,
      });
      setAuthCookie(response, request, result.token);
      return response;
    }

    const response = NextResponse.redirect(getRedirectUrl(request, redirectPath), {
      status: 303,
    });
    setAuthCookie(response, request, result.token);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Login failed. Run: npm run db:setup" },
        { status: 500 }
      );
    }
    return NextResponse.redirect(
      getRedirectUrl(request, "/login?error=server"),
      { status: 303 }
    );
  }
}
