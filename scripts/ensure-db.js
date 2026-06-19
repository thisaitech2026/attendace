const { existsSync, copyFileSync } = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const root = process.cwd();
const envPath = path.join(root, ".env");
const envExamplePath = path.join(root, ".env.example");
const dbPath = path.join(root, "dev.db");

function run(cmd) {
  execSync(cmd, { stdio: "inherit", cwd: root, env: process.env });
}

function hasAdminUser() {
  if (!existsSync(dbPath)) return false;

  try {
    const Database = require("better-sqlite3");
    const db = new Database(dbPath, { readonly: true });
    const row = db.prepare('SELECT id FROM User WHERE username = ?').get("admin");
    db.close();
    return !!row;
  } catch {
    return false;
  }
}

async function main() {
  if (!existsSync(envPath) && existsSync(envExamplePath)) {
    console.log("Creating .env from .env.example...");
    copyFileSync(envExamplePath, envPath);
  }

  require("dotenv").config({ path: envPath });

  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = `file:${dbPath}`;
  }

  if (!hasAdminUser()) {
    console.log("Setting up database and seeding demo credentials...");
    run("npx prisma db push");
    run("npx tsx prisma/seed.ts");
    console.log("Database ready. Demo logins: admin/admin123, rajesh/customer123");
  }
}

main().catch((error) => {
  console.error("Database setup failed:", error);
  process.exit(1);
});
