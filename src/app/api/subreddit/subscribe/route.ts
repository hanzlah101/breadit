import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session?.user?.id,
      },
    });

    if (subscriptionExists) {
      return new Response("You are already subscribed to this subreddit.", {
        status: 409,
      });
    }

    await db.subscription.create({
      data: {
        subredditId,
        userId: session?.user?.id,
      },
    });

    return new Response(subredditId, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid POST request data passed", { status: 422 });
    }

    return new Response("Couldn't subscribe, try again later.", {
      status: 500,
    });
  }
}