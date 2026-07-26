import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

type Db = ReturnType<typeof createDrizzle>;

function createDrizzle(databaseUrl: string) {
  const sqlClient = new SQL(databaseUrl);
  return drizzle({ client: sqlClient, logger: true, jit: true });
}

let dbInstance: Db | undefined;

export function initDb(databaseUrl: string): Db {
  if (!dbInstance) {
    dbInstance = createDrizzle(databaseUrl);
  }
  return dbInstance;
}

function getDb(): Db {
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
