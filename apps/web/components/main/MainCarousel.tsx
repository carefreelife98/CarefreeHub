"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CardContent } from "../ui/card"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel"
import { Card } from "../ui/card"
import { Progress } from "../ui/progress"
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
  const autoplayPlugin = useRef(emblaAutoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false }))

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return

    onSelect()
    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  const handleMouseEnter = () => {
    autoplayPlugin.current.stop()
  }

  const handleMouseLeave = () => {
    autoplayPlugin.current.play()
  }

  return (
    <div className="w-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel
        setApi={setApi}
        plugins={[autoplayPlugin.current]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem key={post.slug}>
              <Link href={post.permalink}>
                <Card className="rounded-none p-0 overflow-hidden">
                  <CardContent className="relative flex h-[300px] items-end justify-start p-0">
                    {post.thumbnail ? (
                      <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-6 text-white">
                      <p className="text-sm opacity-80 mb-2">
                        {new Date(post.date).toLocaleDateString("ko-KR")}
                      </p>
                      <h3 className="text-2xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      {post.description && (
                        <p className="text-sm opacity-90 line-clamp-2">{post.description}</p>
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
