import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { parse } from "fast-csv";
import { users } from "./schema.ts";
import { exit } from "process";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Data {
  [key: string]: {
    name: string;
    cars: string[];
    phone: string;
  };
}

const client = postgres(process.env.POSTGRES_URL || "", {
  max: 1,
});
const db: PostgresJsDatabase = drizzle(client);

const filePath = path.join(__dirname, "data.csv");

let data: Data = {};
fs.createReadStream(filePath)
  .pipe(parse({ headers: false }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => {
    let [name, license, phone] = row;
    console.log(license);
    if (!name || !license || !phone) return;
    phone = phone.replaceAll(/[- ]/gi, "");
    phone = phone[0] !== "0" ? `0${phone}` : phone;
    const licenses = license.replaceAll(/[א-ת :\-]/gi, "").split("/");

    data[phone] = {
      name,
      cars: licenses,
      phone,
    };
  })
  .on("end", async (rowCount: number) => {
    try {
      let inserts = [];
      for (const key in data) {
        const user = data[key];
        inserts.push(
          db
            .insert(users)
            .values({
              name: user.name,
              cars: user.cars,
              phone: user.phone,
            })
            .onConflictDoUpdate({
              target: users.phone,
              set: { cars: user.cars },
            }),
        );
      }
      await Promise.all(inserts);
      return exit(0);
    } catch (e) {
      console.log(e);
    }
  });
