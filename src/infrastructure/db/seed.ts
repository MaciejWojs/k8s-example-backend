import { reset, seed } from "drizzle-seed";

import type { ENV } from "../../config/env";
import { getDb } from "./client";
import * as schema from "./schema";

/**
 * Seeds the database by resetting existing data and populating it with initial records.
 *
 * @param env - The environment configuration object containing environment-specific settings.
 *              Seeding will only proceed if `env.DEVELOPMENT` is true and `env.PERFORM_DATABASE_SEEDING` is enabled.
 * @returns Promise<void>
 */
export async function seedDatabase(env: ENV) {
  if (!env.DEVELOPMENT) {
    console.warn(
      "Seeding is only allowed in development environment. Aborting."
    );
    return;
  }
  if (!env.PERFORM_DATABASE_SEEDING) {
    console.info("Database seeding is disabled. Skipping seeding process.");
    return;
  }

  console.info("Resetting and seeding the database...");
  const database = getDb();
  await reset(database, schema);
  await seed(database, schema);
}

if (require.main === module) {
  const { EnvProvider } = await import("../../config/EnvProvider");
  const { initDb } = await import("./client");
  const env = (await EnvProvider.getInstance()).getConfig();
  console.log("database url", env.DATABASE_URL.slice(0, 15) + "...");
  initDb(env.DATABASE_URL);
  seedDatabase(env).catch((error) => {
    console.error("Database seeding failed", error);
    process.exit(1);
  });
}
