import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

const sqlClient = new SQL(process.env.DATABASE_URL!);
export const db = drizzle({ client: sqlClient });
