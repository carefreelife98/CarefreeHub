"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import emblaAutoplay from "embla-carousel-autoplay";

const SLIDE_COUNT = 5;
const AUTOPLAY_DELAY = 3000;

export function MainCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const autoplayPlugin = useRef(emblaAutoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false }));

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const handleMouseEnter = () => {
    autoplayPlugin.current.stop();
  };

  const handleMouseLeave = () => {
    autoplayPlugin.current.play();
  };

  return (
    <div className="w-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel
        setApi={setApi}
        plugins={[autoplayPlugin.current]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
            <CarouselItem key={index}>
              <Card className="rounded-none p-0">
                <CardContent className="flex h-[300px] items-center justify-center p-0">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Progress indicators */}
      <div className="flex gap-2 mt-4 px-4">
        {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
          <Progress
            key={index}
            value={index === current ? 100 : 0}
            className="h-1 flex-1 cursor-pointer"
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
