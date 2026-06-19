import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { redirectResponse, isSecureRequest } from "@/lib/redirect";

function setAuthCookie(response: NextResponse, request: NextRequest, token: string) {
  const isSecure = isSecureRequest(request);
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
      return redirectResponse("/login?error=missing");
    }

    const result = await authenticateUser(username, password);
    if (!result) {
      if (contentType.includes("application/json")) {
        return NextResponse.json(
          { error: "Invalid username or password. Use admin/admin123 or rajesh/customer123" },
          { status: 401 }
        );
      }
      return redirectResponse("/login?error=invalid");
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

    const response = redirectResponse(redirectPath);
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
    return redirectResponse("/login?error=server");
  }
}
