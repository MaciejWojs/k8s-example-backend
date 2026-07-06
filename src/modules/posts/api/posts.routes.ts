import { Hono } from "hono";

const postsRouter = new Hono();

postsRouter.get("/", (c) => {
  return c.text("Hello Posts!");
});

export default postsRouter;
