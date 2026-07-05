import { Post } from "../../modules/posts/domain/entities/Post.entity";
import { PostContent } from "../../modules/posts/domain/value-objects/PostContent.vo";
import { PostTitle } from "../../modules/posts/domain/value-objects/PostTitle.vo";
import { PostUUID } from "../../modules/posts/domain/value-objects/PostUuid.vo";
import type { PostDB } from "../types/DB/post";

export class PostMapper {
  static toDomain(postDB: PostDB): Post {
    return new Post(
      new PostUUID(postDB.id),
      new PostTitle(postDB.title),
      new PostContent(postDB.content),
      postDB.createdAt,
      postDB.updatedAt
    );
  }

  static toPersistence(post: Post): PostDB {
    return {
      id: post.id.value,
      title: post.title.value,
      content: post.content.value,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
  }
}
