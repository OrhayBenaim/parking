import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { sql } from "@vercel/postgres";
import * as dotenv from "dotenv";

dotenv.config();

export const db = drizzle(sql);

await migrate(db, { migrationsFolder: "./drizzle" });
