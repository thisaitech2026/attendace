const { existsSync } = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const dbPath = path.join(process.cwd(), "dev.db");

if (!existsSync(dbPath)) {
  console.log("Database not found. Running setup...");
  execSync("npx prisma db push && npx tsx prisma/seed.ts", {
    stdio: "inherit",
    env: process.env,
  });
}
