import { reset } from "drizzle-seed";

import { EnvProvider } from "../../config/EnvProvider";
import { initDb } from "./client";
import * as schema from "./schema";

async function main() {
  const env = (await EnvProvider.getInstance()).getConfig();
  const db = initDb(env.DATABASE_URL);
  console.info("Resetting the database...");
  await reset(db, schema);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Database reset failed", error);
    process.exit(1);
  });
}
