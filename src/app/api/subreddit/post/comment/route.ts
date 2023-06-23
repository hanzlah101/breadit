import { CommentValidator } from "@/lib/validators/comment";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { postId, text, replyToId } = CommentValidator.parse(body);

    await db.comment.create({
      data: {
        postId,
        text,
        replyToId,
        authorId: session?.user?.id,
      },
    });

    return new Response("OK", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Error posting comment, try again later.", {
      status: 500,
    });
  }
}
