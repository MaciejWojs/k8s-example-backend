import { env } from "bun";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/infrastructure/db/schema.ts",
  dialect: "postgresql",
  migrations: {
    schema: "public"
  },
  dbCredentials: {
    url: env.DATABASE_URL!
  }
});
