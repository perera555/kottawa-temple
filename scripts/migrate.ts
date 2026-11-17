/**
 * Applies SQL migrations in ./drizzle to DATABASE_URL.
 * Runs automatically before `next build` (skipped when DATABASE_URL is missing).
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({ path: ".env.local" });
config();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] DATABASE_URL not set - skipping migrations.");
    return;
  }
  const isLocal = /localhost|127\.0\.0\.1/.test(url);
  const client = postgres(url, { max: 1, prepare: false, ssl: isLocal ? false : "require" });
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  await client.end();
  console.log("[migrate] Database is up to date.");
}

main().catch((err) => {
  console.error("[migrate] failed:", err);
  process.exit(1);
});
