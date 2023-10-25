import type { APIRoute } from "astro";
import { db } from "../../db/db";
import { notifications } from "../../db/schema";

interface Body {
  phone: string;
  subscription: {
    endpoint: string;
    expirationTime: null;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { subscription, phone } = body as Body;

    await db
      .insert(notifications)
      .values({
        phone,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      })
      .onConflictDoUpdate({
        target: notifications.phone,
        set: {
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      });
    // return a successful response
    return new Response(
      JSON.stringify({
        message: "saved",
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.debug(error);

    return new Response(
      JSON.stringify({
        message: "failed",
      }),
      {
        status: 500,
      },
    );
  }
};
