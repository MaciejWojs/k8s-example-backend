import { env } from "bun";
import { reset, seed } from "drizzle-seed";

import { db } from "./client";
import * as schema from "./schema";

async function main() {
  const isDevelopment = env.DEVELOPMENT === "true" || env.DEVELOPMENT === "1";

  if (!isDevelopment) {
    console.warn(
      "Seeding is only allowed in development environment. Aborting."
    );
    return;
  }

  console.info("Resetting and seeding the database...");
  await reset(db, schema);
  await seed(db, schema);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Database seeding failed", error);
    process.exit(1);
  });
}
