import { eq } from "drizzle-orm";

import { db } from "../../../../infrastructure/db/client";
import { postsTable } from "../../../../infrastructure/db/schema";
import type { PostDB as Post } from "../../../../shared/types/DB/post";
import type { IPostsDao } from "./IPosts.dao";

export class PostDao implements IPostsDao {
  async create(post: Post): Promise<Post | null> {
    const [createdPost] = await db.insert(postsTable).values(post).returning();
    return createdPost ?? null;
  }

  async delete(postId: string): Promise<boolean> {
    const deletedPost = await db
      .delete(postsTable)
      .where(eq(postsTable.id, postId))
      .returning();
    return deletedPost.length > 0;
  }

  async findById(id: string): Promise<Post | null> {
    const post = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id))
      .limit(1);
    return post[0] ?? null;
  }

  async save(post: Post) {
    const [updatedPost] = await db
      .update(postsTable)
      .set(post)
      .where(eq(postsTable.id, post.id))
      .returning();
    return updatedPost ?? null;
  }
}
