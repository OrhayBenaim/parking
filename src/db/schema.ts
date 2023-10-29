import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import jsonb from "./jsonb.ts";

export const users = pgTable(
  "users",
  {
    phone: text("phone").notNull(),
    email: text("email"),
    name: text("name").notNull(),
    cars: jsonb("cars").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: unique("user_pk").on(table.phone),
  }),
);
