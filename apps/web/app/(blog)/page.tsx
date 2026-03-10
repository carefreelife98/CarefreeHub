import { MainCarousel, MainHotPost, MainLatestPost, MainRecapBanner } from "@widgets/main-section"
import { Separator } from "@shared/ui"
import { getFeaturedPosts } from "@shared/lib"

export default function Home() {
  const featuredPosts = getFeaturedPosts(5)

  return (
    <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-16 xl:px-32 gap-16 py-8">
      <MainRecapBanner />
      <MainCarousel posts={featuredPosts} />
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
