import { PostMapper } from "../../../../shared/mappers/Post.mapper";
import type { IPostsDao } from "../../infrastructure/dao/IPosts.dao";
import type { Post } from "../entities/Post.entity";
import type { PostUUID } from "../value-objects/PostUuid.vo";
import type { IPostsRepository } from "./IPosts.repository";

export class PostsRepository implements IPostsRepository {
  constructor(private readonly postDao: IPostsDao) {}

  async create(post: Post): Promise<Post> {
    const tempPost = PostMapper.toPersistence(post);
    const result = await this.postDao.create(tempPost);
    if (!result) {
      throw new Error("Failed to create post");
    }
    return PostMapper.toDomain(result);
  }

  async delete(post: Post): Promise<boolean> {
    const result = await this.postDao.delete(post.id.value);
    if (!result) {
      throw new Error("Failed to delete post");
    }
    return result;
  }

  async findById(post: PostUUID): Promise<Post> {
    const result = await this.postDao.findById(post.value);
    if (!result) {
      throw new Error("Post not found");
    }
    return PostMapper.toDomain(result);
  }

  async getPostsPaginated(page: number, limit: number): Promise<Post[]> {
    const result = await this.postDao.getPostsPaginated(page, limit);
    return result.map(PostMapper.toDomain);
  }

  async save(post: Post): Promise<Post> {
    const tempPost = PostMapper.toPersistence(post);
    const result = await this.postDao.save(tempPost);
    if (!result) {
      throw new Error("Failed to save post");
    }
    return PostMapper.toDomain(result);
  }
}
