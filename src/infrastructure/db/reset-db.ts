import { reset } from "drizzle-seed";

import { db } from "./client";
import * as schema from "./schema";

async function main() {
  console.info("Resetting the database...");
  await reset(db, schema);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Database reset failed", error);
    process.exit(1);
  });
}
