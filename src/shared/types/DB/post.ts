import type { postsTable } from "../../../infrastructure/db/schema";

export type PostDB = typeof postsTable.$inferSelect;
