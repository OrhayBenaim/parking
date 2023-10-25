import type { APIRoute } from "astro";
import { db } from "../../db/db";
import { notifications, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import webpush from "web-push";

interface Body {
  phone: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { phone } = body as Body;

    const subscriptions = await db
      .selectDistinct()
      .from(notifications)
      .where(eq(notifications.phone, phone))
      .execute();

    if (subscriptions.length === 0) {
      throw new Error("No subscription found");
    }

    const [subscription] = subscriptions;

    const payload = JSON.stringify({
      title: "You are blocking a car",
      options: {
        body: "Please go to the parking lot to move you're car",
      },
    });
    // Customize how the push service should attempt to deliver the push message.
    // And provide authentication information.
    webpush.setVapidDetails(
      import.meta.env.VAPID_SUBJECT,
      import.meta.env.VAPID_PUBLIC_KEY,
      import.meta.env.VAPID_PRIVATE_KEY,
    );

    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.auth,
        p256dh: subscription.p256dh,
      },
    };
    await webpush.sendNotification(pushSubscription, payload);

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
