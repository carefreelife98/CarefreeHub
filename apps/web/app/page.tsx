"use client"

import { MainCarousel } from "@/components/main/MainCarousel";
import { MainHotPost } from "@/components/main/MainHotPost";
import { MainLatestPost } from "@/components/main/MainLatestPost";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center px-32 gap-16 py-8">
      <MainCarousel />
      <div className="w-full flex flex-row items-start justify-between gap-4 h-full">
        <div className="flex-[2] flex-col">
          <MainLatestPost />
        </div>
        <Separator orientation="vertical" className="h-full" />
        <div className="flex-1 flex flex-col h-full items-start justify-start gap-4 px-6">
          <MainHotPost />
        </div>
      </div>
    </div>
  )
}
