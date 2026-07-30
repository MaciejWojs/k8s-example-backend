import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

type Db = ReturnType<typeof createDrizzle>;

function createDrizzle(databaseUrl: string) {
  const dbUrl = databaseUrl.trim();
  if (!dbUrl) {
    throw new Error("Database URL is not provided. Please set DATABASE_URL.");
  }
  const sqlClient = new SQL(dbUrl);
  return drizzle({ client: sqlClient, logger: true, jit: true });
}

let dbInstance: Db | undefined;

export function initDb(databaseUrl: string): Db {
  console.info("Initializing database client...");
  console.info("Database connection URL:", databaseUrl.slice(0, 20) + "...");
  if (!dbInstance) {
    console.info("Creating new database client...");
    dbInstance = createDrizzle(databaseUrl);
  }
  return dbInstance;
}

export function getDb(): Db {
  if (!dbInstance) {
    throw new Error(
      "Database client not initialized. Call initDb() after EnvProvider.getInstance()."
    );
  }
  return dbInstance;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  }
});
