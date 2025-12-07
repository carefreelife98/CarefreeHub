import { ChevronRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SimplePost } from "../common/post/SimplePost";

export function MainHotPost() {

  const posts = [
    {
      title: "Post 1",
      createdBy: "John Doe",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 2",
      createdBy: "John Doe",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 3",
      createdBy: "John Doe",
      linkUrl: "https://www.google.com",
    },
  ];

  return (
    <div className="w-full flex flex-col items-start justify-start gap-4">
      <div className="w-full flex flex-row items-center justify-between">
        <span className="text-sm whitespace-nowrap font-bold text-muted-foreground">인기 게시글</span>
      </div>

      <div className="w-full">
        {posts.map((post, idx) => (
          <SimplePost key={idx} title={post.title} createdBy={post.createdBy} linkUrl={post.linkUrl} />
        ))}
      </div>
    </div>
  )
}