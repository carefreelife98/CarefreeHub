import { MainCarousel, MainHotPost, MainLatestPost, MainRecapBanner } from "@widgets/main-section"
import { Separator } from "@shared/ui"
import { getFeaturedPosts } from "@shared/lib"

export default function Home() {
  const featuredPosts = getFeaturedPosts(5)

  return (
    <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-16 xl:px-32 gap-10 md:gap-16 py-6 md:py-10">
      <MainRecapBanner />
      <MainCarousel posts={featuredPosts} />
      <div className="w-full flex flex-col md:flex-row items-stretch md:items-start justify-between gap-8 md:gap-4">
        <div className="md:flex-[2] min-w-0">
          <MainLatestPost />
        </div>
        <Separator orientation="horizontal" className="md:hidden" />
        <Separator orientation="vertical" className="hidden md:block h-auto self-stretch" />
        <div className="md:flex-1 flex flex-col items-start justify-start gap-4 md:px-6 min-w-0">
          <MainHotPost />
        </div>
      </div>
    </div>
  )
}
