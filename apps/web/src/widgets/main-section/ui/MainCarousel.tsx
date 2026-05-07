"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  Progress,
  type CarouselApi,
} from "@shared/ui"
import emblaAutoplay from "embla-carousel-autoplay"
import type { Post } from "#site/content"
import Link from "next/link"
import Image from "next/image"

const AUTOPLAY_DELAY = 3000

interface MainCarouselProps {
  posts: Post[]
}

export function MainCarousel({ posts }: MainCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  // Lazy state init — emblaAutoplay()는 첫 렌더에 한 번만 평가된다.
  const [plugin] = useState(() =>
    emblaAutoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })
  )

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return

    // 외부 라이브러리(embla)의 초기 상태를 React state에 동기화 — 정당한 예외.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect()
    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  const handleMouseEnter = () => {
    plugin.stop()
  }

  const handleMouseLeave = () => {
    plugin.play()
  }

  return (
    <div className="w-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel setApi={setApi} plugins={[plugin]} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem key={post.slug}>
              <Link href={post.permalink}>
                <Card className="rounded-none p-0 overflow-hidden">
                  <CardContent className="relative flex aspect-[16/9] sm:aspect-[2/1] md:aspect-[21/9] items-end justify-start p-0">
                    {post.thumbnail ? (
                      <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.005_50_/_0.75)] via-[oklch(0.16_0.005_50_/_0.25)] to-transparent" />
                    <div className="relative z-10 p-4 sm:p-6 text-white">
                      <p className="text-xs sm:text-sm opacity-80 mb-1 sm:mb-2 tabular-nums">
                        {new Date(post.date).toLocaleDateString("ko-KR")}
                      </p>
                      <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs sm:text-sm opacity-90 line-clamp-2">
                          {post.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Progress indicators */}
      <div className="flex gap-2 mt-4 px-4">
        {posts.map((post, index) => (
          <Progress
            key={post.slug}
            value={index === current ? 100 : 0}
            className="h-1 flex-1 cursor-pointer"
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
