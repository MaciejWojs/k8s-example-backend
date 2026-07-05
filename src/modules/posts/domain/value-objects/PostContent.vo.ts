import { z } from "zod";

export class PostContent {
  constructor(private content: string) {
    const res = z.string().min(1).max(5000).safeParse(content);
    if (!res.success) {
      throw new Error("Content must be between 1 and 5000 characters");
    }
  }

  get value(): string {
    return this.content;
  }
}
