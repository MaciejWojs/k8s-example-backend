import { Hono } from "hono";

import { envProvider } from "./config/EnvProvider";

console.log("Environment Variables:", envProvider.getConfig());

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
