"use client";

import { FC, useRef, useState } from "react";
import { formatTimeToNow } from "@/lib/utils";
import { Dot, MessageSquare } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useRouter } from "next/navigation";
import CommentVotes from "./CommentVotes";
import { Comment, CommentVote, User } from "@prisma/client";
import { Button } from "./ui/Button";
import { Session } from "next-auth";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { toast } from "@/hooks/useToast";
import axios from "axios";
import { CommentRequest } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";

interface PostCommentProps {
  comment: Comment & {
    author: User;
    votes: CommentVote[];
  };
  postId: string;
  votesAmt: number;
  session: Session | null;
  currentVote: CommentVote | undefined;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesAmt,
  postId,
  currentVote,
  session,
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const router = useRouter();
  const commentRef = useRef<HTMLDivElement>(null);

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment/`,
        payload
      );
      return data;
    },

    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
      setIsReplying(false);
    },
  });

  return (
    <div className="flex flex-col" ref={commentRef}>
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
        />

        <div className="ml-2 flex items-center gap-x-1">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>

          <Dot />

          <p className="max-h-40 text-xs truncate text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment?.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session?.user) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant={"ghost"}
          size={"xs"}
          aria-label="reply"
        >
          <MessageSquare className="w-4 h-4 mr-1.5" />
          Reply
        </Button>

        {isReplying && (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your reply</Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                value={input}
                placeholder="What are your thoughts"
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="mt-2 flex justify-end gap-x-2">
                <Button
                  tabIndex={-1}
                  variant={"subtle"}
                  onClick={() => {
                    setInput("");
                    setIsReplying(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  isLoading={isLoading}
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input) return;
                    postComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComment;
