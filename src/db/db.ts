import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const client = postgres(import.meta.env.DATABASE_URL);
export const db: PostgresJsDatabase = drizzle(client);

await migrate(db, { migrationsFolder: "./drizzle" });
