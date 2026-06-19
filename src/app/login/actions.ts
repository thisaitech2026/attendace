"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  try {
    const result = await authenticateUser(username, password);
    if (!result) {
      return {
        error: "Invalid username or password. Try admin/admin123 or rajesh/customer123",
      };
    }

    const headersList = await headers();
    const proto = headersList.get("x-forwarded-proto") || "http";
    const isSecure = proto === "https";

    const cookieStore = await cookies();
    cookieStore.set("auth-token", result.token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    redirect(result.user.role === "ADMIN" ? "/admin" : "/customer");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Login action error:", error);
    return { error: "Login failed. Run: npm run db:setup" };
  }
}
