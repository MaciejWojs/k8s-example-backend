import { Hono } from "hono";

import { PostMapper } from "../../../shared/mappers/Post.mapper";
import { GetPostsPaginated } from "../application/use-case/getPostsPaginated";
import { PostsRepository } from "../domain/repositories/Posts.repository";
import { PostDao } from "../infrastructure/dao/Posts.dao";

const postsRouter = new Hono();

postsRouter.get("/", async (c) => {
  const page = parseInt(c.req.query("page") || "-1");
  const limit = parseInt(c.req.query("limit") || "-1");

  const dao = new PostDao();
  const repository = new PostsRepository(dao);
  const getPostsPaginated = new GetPostsPaginated(repository);
  console.log(`Fetching posts with page: ${page}, limit: ${limit}`);

  const postsDomain = await getPostsPaginated.execute(page, limit);
  const posts = postsDomain.map((post) => PostMapper.toDTO(post));
  console.log("Retrieved posts:", posts);

  return c.json(posts);
});

export default postsRouter;
