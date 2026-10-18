// Runs `prisma db push` on production deploys only.
// Preview builds (every pull request) share the same DATABASE_URL today, so letting
// them push would change the live database's tables before anyone merged anything.
import { execSync } from "node:child_process";

const env = process.env.VERCEL_ENV;
if (!process.env.DATABASE_URL) {
  console.log("[db] No DATABASE_URL, skipping schema push.");
} else if (env && env !== "production") {
  console.log(`[db] ${env} build: not touching the database schema. It updates when this is merged to main.`);
} else {
  console.log("[db] Production build: syncing the database schema.");
  execSync("prisma db push --skip-generate", { stdio: "inherit" });
}
