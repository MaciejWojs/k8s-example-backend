import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

type Db = ReturnType<typeof createDrizzle>;

/**
 * Bun SQL can treat the URL pathname (database name) as a Unix socket path when that
 * path exists in the container (e.g. WORKDIR /app + database `app`). Use an options
 * object so TCP is used. See oven-sh/bun#27713.
 */
function createSqlClient(databaseUrl: string) {
  const dbUrl = databaseUrl.trim();
  const parsed = new URL(dbUrl);
  const sslmode = parsed.searchParams.get("sslmode");
  const tls =
    sslmode === "disable"
      ? false
      : sslmode === "require" ||
          sslmode === "verify-ca" ||
          sslmode === "verify-full"
        ? true
        : undefined;

  return new SQL({
    adapter: "postgres",
    hostname: parsed.hostname,
    port: Number(parsed.port) || 5432,
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, "") || "postgres",
    tls
  });
}

function createDrizzle(databaseUrl: string) {
  if (!databaseUrl.trim()) {
    throw new Error("Database URL is not provided. Please set DATABASE_URL.");
  }
  const sqlClient = createSqlClient(databaseUrl);
  return drizzle({ client: sqlClient, logger: true, jit: true });
}

let dbInstance: Db | undefined;

export function initDb(databaseUrl: string): Db {
  if (!dbInstance) {
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
