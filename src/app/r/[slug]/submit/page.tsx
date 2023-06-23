import Editor from "@/components/Editor";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
  });

  if (!subreddit) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-3">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h2 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h2>

          <p className="ml-2 mt-1 truncate text-sm text-gray-500">r/{slug}</p>
        </div>
      </div>

      <Editor subredditId={subreddit?.id} />
    </div>
  );
};

export default Page;
