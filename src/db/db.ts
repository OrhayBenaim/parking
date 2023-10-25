import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { sql } from "@vercel/postgres";

export const db = drizzle(sql);

await migrate(db, { migrationsFolder: "./drizzle" });
