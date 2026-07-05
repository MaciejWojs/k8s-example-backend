import { z } from "zod";

export class PostTitle {
  readonly #value: string;

  constructor(title: string) {
    const res = z.string().min(1).max(255).safeParse(title);
    if (!res.success) {
      throw new Error("Title must be between 1 and 255 characters");
    }
    this.#value = title;
  }

  get value(): string {
    return this.#value;
  }
}
