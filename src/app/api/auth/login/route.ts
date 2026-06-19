import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const result = await authenticateUser(username, password);
    if (!result) {
      return NextResponse.json(
        { error: "Invalid username or password. Use admin/admin123 or rajesh/customer123" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user: result.user,
      redirect: result.user.role === "ADMIN" ? "/admin" : "/customer",
    });

    const isSecure = request.nextUrl.protocol === "https:";

    response.cookies.set("auth-token", result.token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Run: npm run db:setup" },
      { status: 500 }
    );
  }
}
