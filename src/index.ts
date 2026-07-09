import { sleep } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";

import { envProvider } from "./config/EnvProvider";
import { runMigrations } from "./infrastructure/db/migrate";
import { seedDatabase } from "./infrastructure/db/seed";
import postsRouter from "./modules/posts/api/posts.routes";

const appConfig = envProvider.getConfig();

console.info("Waiting for the database to be ready...");
await sleep(2000);
await runMigrations(appConfig);
await seedDatabase(appConfig);

const app = new Hono().basePath("/api/v1");

app.use(
  "*",
  cors({
    origin: "*"
  })
);
app.use("*", logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/posts", postsRouter);

showRoutes(app);

export default app;
