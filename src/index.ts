import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";

import { envProvider } from "./config/EnvProvider";
import postsRouter from "./modules/posts/api/posts.routes";

const _appConfig = envProvider.getConfig();

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
