import type { APIRoute } from "astro";
import { sql } from "drizzle-orm";
import { db } from "../../db/db";
import { mp } from "../../services/mixpanel";

export const POST: APIRoute = async ({ request, locals, url, cookies }) => {
  const params = await request.formData();
  let license = params.get("license");
  const image = params.get("image");
  if (!license && !image) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 },
    );
  }

  if (!locals.phone) {
    cookies.delete("pf-token");
    return Response.redirect(new URL("/login", url));
  }

  mp.track("search", {
    distinct_id: locals.phone,
    type: !license && image ? "image" : "license",
  });

  if (!license && image) {
    let body = new FormData();
    body.append("upload", image);
    const plate = await fetch(
      "https://api.platerecognizer.com/v1/plate-reader/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${import.meta.env.PLATE_RECOGNIZER_TOKEN}`,
        },
        body: body,
      },
    ).then((res) => res.json());

    const [result] = plate.results;
    license = result.plate;
  }

  const user = await db.execute(sql`
  select * from users where cars ? ${license} limit 1
  `);
  if (user.rows.length === 0) {
    return new Response(
      JSON.stringify({
        message: "User not found",
      }),
      { status: 401 },
    );
  }

  return new Response(JSON.stringify(user.rows[0]), {
    status: 200,
  });
};
