import type { Post } from "../entities/Post.entity";
import type { PostUUID } from "../value-objects/PostUuid.vo";

export interface IPostsRepository {
  /**
   * Returns a post by its ID.
   *
   * @throws Error If the post is not found.
   */
  findById(post: PostUUID): Promise<Post>;

  /**
   * Saves an existing post.
   *
   * @throws Error If the post is not found or cannot be saved.
   */
  save(post: Post): Promise<Post>;

  /**
   * Creates a new post.
   *
   * @throws Error If the post cannot be created.
   */
  create(post: Post): Promise<Post>;

  /**
   * Deletes a post.
   *
   * @throws Error If the post is not found or cannot be deleted.
   */
  delete(post: Post): Promise<boolean>;

  /**
   * Retrieves a paginated list of posts.
   *
   * @param page The page number (1-based).
   * @param limit The number of posts per page.
   * @returns A promise that resolves to an array of posts.
   * @throws Error If the posts cannot be retrieved.
   */
  getPostsPaginated(page: number, limit: number): Promise<Post[]>;
}
