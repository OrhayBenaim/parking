import { nanoid } from "nanoid";
import { SignJWT } from "jose";
import type { APIRoute } from "astro";
import { sql } from "drizzle-orm";
import { db } from "../../db/db";

const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET_KEY);

export const POST: APIRoute = async ({ cookies, request, url }) => {
  try {
    const data = await request.formData();
    const license = data.get("license");
    const phone = data.get("phone");

    const user = await db.execute(sql`
    select phone from users where cars ? ${license} and phone = ${phone} limit 1
    `);

    if (user.rows.length === 0) {
      throw new Error("Invalid username or password");
    }
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .sign(secret);

    // set JWT as a cookie
    cookies.set("pf-token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    });

    // return a successful response
    return Response.redirect(new URL("/home", url));
  } catch (error) {
    console.debug(error);

    return new Response(
      JSON.stringify({
        message: "Login failed",
      }),
      {
        status: 500,
      },
    );
  }
};
