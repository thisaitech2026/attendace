import "dotenv/config";
import path from "path";
import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  const configured = process.env.DATABASE_URL;
  if (configured && !configured.startsWith("file:./")) {
    return configured;
  }
  const dbFile = path.join(process.cwd(), "dev.db");
  return `file:${dbFile}`;
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: getDatabaseUrl(),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
