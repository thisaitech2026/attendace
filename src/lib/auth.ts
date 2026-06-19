import "server-only";
import { cookies } from "next/headers";
import { prisma } from "./db";
import {
  type AuthUser,
  type Role,
  signToken,
  verifyToken,
  verifyPassword,
} from "./jwt";

export type { AuthUser, Role };

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(role?: Role): Promise<AuthUser> {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");
  if (role && user.role !== role) throw new Error("Forbidden");
  return user;
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<{ user: AuthUser; token: string } | null> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;
  const valid = await verifyPassword(password, user.password);
  if (!valid) return null;
  const authUser: AuthUser = {
    id: user.id,
    username: user.username,
    role: user.role as Role,
    customerId: user.customerId,
  };
  return { user: authUser, token: signToken(authUser) };
}

export { hashPassword, verifyPassword, signToken, verifyToken } from "./jwt";
