import { ChevronRightIcon } from "lucide-react";
import { ThumbnailPost } from "../common/post/ThumbnailPost";
import { Button } from "../ui/button";
import Link from "next/link";

export function MainLatestPost() {
  const posts = [
    {
      title: "Post 1",
      description: "Description 1",
      createdAt: "2021년 1월 1일",
      createdBy: "John Doe",
      updatedAt: "2021년 1월 1일",
      thumbnailUrl: "https://picsum.photos/200/300",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 1",
      description: "Description 1",
      createdAt: "2021년 1월 1일",
      createdBy: "John Doe",
      updatedAt: "2021년 1월 1일",
      thumbnailUrl: "https://picsum.photos/200/300",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 1",
      description: "Description 1",
      createdAt: "2021년 1월 1일",
      createdBy: "John Doe",
      updatedAt: "2021년 1월 1일",
      thumbnailUrl: "https://picsum.photos/200/300",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 1",
      description: "Description 1",
      createdAt: "2021년 1월 1일",
      createdBy: "John Doe",
      updatedAt: "2021년 1월 1일",
      thumbnailUrl: "https://picsum.photos/200/300",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 1",
      description: "Description 1",
      createdAt: "2021년 1월 1일",
      createdBy: "John Doe",
      updatedAt: "2021년 1월 1일",
      thumbnailUrl: "https://picsum.photos/200/300",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 1",
      description: "Description 1",
      createdAt: "2021년 1월 1일",
      createdBy: "John Doe",
      updatedAt: "2021년 1월 1일",
      thumbnailUrl: "https://picsum.photos/200/300",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 1",
      description: "Description 1",
      createdAt: "2021년 1월 1일",
      createdBy: "John Doe",
      updatedAt: "2021년 1월 1일",
      thumbnailUrl: "https://picsum.photos/200/300",
      linkUrl: "https://www.google.com",
    },
    {
      title: "Post 1",
      description: "Description 1",
      createdAt: "2021년 1월 1일",
      createdBy: "John Doe",
      updatedAt: "2021년 1월 1일",
      thumbnailUrl: "https://picsum.photos/200/300",
      linkUrl: "https://www.google.com",
    },
  ];
  return (
    <div>
      <div className="w-full flex flex-row items-center justify-between">
        <h1 className="text-xl whitespace-nowrap font-bold text-muted-foreground">최근 게시글</h1>
        <Button variant="ghost" size="sm">
          <Link href="/posts" className="flex flex-row items-center justify-center gap-2">
            <span>전체 보기</span>
            <ChevronRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="w-full">
        {posts.map((post, idx) => (
          <ThumbnailPost key={idx} title={post.title} description={post.description} createdAt={post.createdAt} createdBy={post.createdBy} updatedAt={post.updatedAt} thumbnailUrl={post.thumbnailUrl} linkUrl={post.linkUrl} />
        ))}
      </div>
    </div>
  )
}