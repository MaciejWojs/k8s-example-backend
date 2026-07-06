import type { Post } from "../../domain/entities/Post.entity";
import type { PostsRepository } from "../../domain/repositories/Posts.repository";

export class GetPostsPaginated {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(page: number, limit: number): Promise<Post[]> {
    return this.postsRepository.getPostsPaginated(page, limit);
  }
}
