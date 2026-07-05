import type { PostContent } from "../value-objects/PostContent.vo";
import type { PostTitle } from "../value-objects/PostTitle.vo";
import type { PostUUID } from "../value-objects/PostUuid.vo";

export class Post {
  readonly #content: PostContent;

  readonly #createdAt: Date;

  readonly #id: PostUUID;

  readonly #title: PostTitle;

  readonly #updatedAt: Date;

  constructor(
    id: PostUUID,
    title: PostTitle,
    content: PostContent,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.#id = id;
    this.#title = title;
    this.#content = content;
    this.#createdAt = createdAt || new Date();
    this.#updatedAt = updatedAt || new Date();
  }

  get content(): PostContent {
    return this.#content;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get id(): PostUUID {
    return this.#id;
  }

  get title(): PostTitle {
    return this.#title;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }
}
