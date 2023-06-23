"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { Dot, MessageSquare } from "lucide-react";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";
import Link from "next/link";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  subredditName: string;
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
  post: Post & {
    author: User;
    votes: Vote[];
  };
}

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmt,
  currentVote,
  votesAmt,
}) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          postId={post?.id}
          initialVoteAmount={votesAmt}
          initialVote={currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName && (
              <div className="flex items-center gap-x-1">
                <a
                  href={`/r/${subredditName}`}
                  className="underline text-zinc-900 text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>

                <Dot />

                <span className="text-gray-700">
                  Posted by u/{post.author.username}
                </span>

                <Dot />

                {formatTimeToNow(new Date(post.createdAt))}
              </div>
            )}
          </div>

          <Link
            href={`/r/${subredditName}/post/${post.id}`}
            className="text-lg font-semibold py-2 leading-6 text-gray-900"
          >
            {post.title}
          </Link>

          <div
            ref={pRef}
            className="relative text-sm max-h-40 w-full overflow-clip"
          >
            <EditorOutput content={post.content} />

            {pRef.current?.clientHeight === 160 && (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {commentAmt} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
