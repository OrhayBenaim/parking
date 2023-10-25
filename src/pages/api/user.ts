import type { APIRoute } from "astro";
import { sql } from "drizzle-orm";
import { db } from "../../db/db";

export const POST: APIRoute = async ({ request }) => {
  const params = await request.formData();
  const license = params.get("license");

  if (!license) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 },
    );
  }

  const [user] = await db.execute(sql`
  select * from users where cars ? ${license} limit 1
  `);
  return new Response(JSON.stringify(user), {
    status: 200,
  });
};
