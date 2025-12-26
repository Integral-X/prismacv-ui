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
    <section className="py-16 md:py-20 bg-linear-to-b from-[#E8F5E9] to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 text-gray-900">
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
                        "overflow-hidden transition-all duration-500 shadow-lg bg-[#E6F5F6] border-0 p-0 py-2",
                        current === index
                          ? "scale-100 z-10 border-2 border-[#069098]"
                          : "scale-90 opacity-70"
                      )}
                    >
                      <CardContent className="p-0 aspect-3/4 relative bg-[#E6F5F6]">
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
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-4 h-4 rounded-full cursor-pointer transition-all duration-300",
                  current === index
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Browse More Button */}
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 rounded-lg text-base font-medium transition-all"
              asChild
            >
              <a href="#templates">Browse More</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
