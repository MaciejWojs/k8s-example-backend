import { Post } from "../../domain/entities/Post.entity";
import type { IPostsRepository } from "../../domain/repositories/IPosts.repository";
import { PostUUID } from "../../domain/value-objects/PostUuid.vo";

export class FindPost {
  constructor(private readonly postsRepository: IPostsRepository) {}

  async execute(postId: string): Promise<Post | null> {
    const post = await this.postsRepository.findById(new PostUUID(postId));
    return post;
  }
}
