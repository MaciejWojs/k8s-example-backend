import { randomUUID } from "crypto";
import { z } from "zod";

export class PostUUID {
  readonly #value: string;

  constructor(value: string = randomUUID()) {
    const result = z.uuid().safeParse(value);

    if (!result.success) {
      throw new Error("Invalid UUID");
    }

    this.#value = value;
  }

  equals(other: PostUUID): boolean {
    return this.#value === other.value;
  }

  toString(): string {
    return this.#value;
  }

  get value(): string {
    return this.#value;
  }
}
