import { migrate } from "drizzle-orm/bun-sql/migrator";

import type { ENV } from "../../config/env";
import { db } from "./client";

/**
 * Executes database schema migrations using Drizzle ORM's built-in migrator.
 *
 * This function scans the `./drizzle` folder for migration files and applies them to the database.
 * If migrations are disabled via environment variable, it logs an info message and returns early.
 * In case of migration failure, the application continues startup but logs a warning for manual review.
 *
 * @param env - Environment configuration object containing runtime settings.
 *              Migrations will only run if `env.PERFORM_DATABASE_MIGRATIONS` is truthy.
 * @returns Promise<void>
 */
export async function runMigrations(env: ENV) {
  if (!env.PERFORM_DATABASE_MIGRATIONS) {
    console.info(
      "Database migrations are disabled. Skipping migration process."
    );
    return;
  }
  console.info("Running database migrations...");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
  } catch (error) {
    console.error("Database migration failed", error);
    console.warn(
      "Continuing with the application startup despite migration failure. Please check the database state and resolve any issues."
    );
  }
}
