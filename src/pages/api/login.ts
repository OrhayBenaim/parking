import { nanoid } from "nanoid";
import { SignJWT } from "jose";
import type { APIRoute } from "astro";

const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET_KEY);

export const POST: APIRoute = async ({ cookies, request, url }) => {
  try {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");

    console.log({ username, password, admin: import.meta.env.ADMIN_PASSWORD });
    if (username !== "admin" || password !== import.meta.env.ADMIN_PASSWORD) {
      throw new Error("Invalid username or password");
    }
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    // set JWT as a cookie
    cookies.set("pf-token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours in seconds
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
