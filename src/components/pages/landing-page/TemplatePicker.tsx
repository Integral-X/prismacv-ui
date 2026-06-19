"use client";

import * as React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const templateImages = [
  "/images/landing-page/cv_1.svg",
  "/images/landing-page/cv_2.svg",
  "/images/landing-page/cv_3.svg",
  "/images/landing-page/cv_1.svg",
  "/images/landing-page/cv_2.svg",
];

export const TemplatePicker = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-linear-to-b from-surface-elevated to-surface-page py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 text-content-primary">
          Pick the Perfect Resume Template
        </h2>

        {/* Carousel Container */}
        <div className="mx-auto max-w-6xl relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              loop: true,
              align: "center",
              slidesToScroll: 1,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4 py-8">
              {templateImages.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-full md:basis-1/3"
                >
                  <div className="relative">
                    <Card
                      className={cn(
                        "overflow-hidden border-0 bg-surface-card p-0 py-2 shadow-lg transition-all duration-500",
                        current === index
                          ? "scale-100 z-10 border-2 border-primary"
                          : "scale-90 opacity-70"
                      )}
                    >
                      <CardContent className="relative aspect-3/4 bg-surface-card p-0">
                        <Image
                          src={image}
                          alt={`Resume template ${index + 1}`}
                          fill
                          className="object-contain"
                          priority={index === 0}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {templateImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "group min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={current === index ? "true" : undefined}
              >
                <span
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    current === index
                      ? "bg-primary scale-125"
                      : "bg-border group-hover:bg-border-strong"
                  )}
                />
              </button>
            ))}
          </div>

          {/* Browse More Button */}
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 rounded-lg text-base font-medium transition-all"
              asChild
            >
              <a href="/signup">Browse More</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
