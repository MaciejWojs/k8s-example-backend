import type { PostDB as Post } from "../../../../shared/types/DB/post";

export interface IPostsDao {
  getPostsPaginated(page: number, limit: number): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;
  save(post: Post): Promise<Post | null>;
  create(post: Post): Promise<Post | null>;
  delete(postId: string): Promise<boolean>;
}
