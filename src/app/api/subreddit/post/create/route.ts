import { getAuthSession } from "@/lib/auth";
import { PostValidator } from "@/lib/validators/post";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content, subredditId } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session?.user?.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("Subscribe to post", {
        status: 409,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        subredditId: subredditId,
        authorId: session?.user?.id,
      },
    });

    return new Response("Ok", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Error creating post", { status: 500 });
  }
}
