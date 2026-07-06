import { Hono } from "hono";

import { envProvider } from "./config/EnvProvider";
import postsRouter from "./modules/posts/api/posts.routes";

const _appConfig = envProvider.getConfig();

const app = new Hono().basePath("/api/v1");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/posts", postsRouter);

export default app;
