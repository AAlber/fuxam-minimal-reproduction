"use client";

import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef } from "react";
import { Carousel, CarouselContent } from "@/src/app/ui/carousel";
import { useMousePosition } from "../hooks";
import { useProcessScreenStore } from "../zustand";
import { SliderItem } from "./slider-item";
import { SliderPagination } from "./slider-pagination";
export type Slide = {
  image: string;
  title: string;
  description: string;
  children: JSX.Element;
  imageSize?: string;
};

export type InfoSliderProps = {
  slides: Slide[];
};


export const InfoSlider = (props: InfoSliderProps) => {
  const mousePosition = useMousePosition();
  const { carouselApi, setCarouselApi, setCurrentScreen, setCount } =
    useProcessScreenStore();

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnFocusIn: false, startPaused: false }),
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      setCount(carouselApi.scrollSnapList().length);
      setCurrentScreen(carouselApi.selectedScrollSnap() + 1);
    };

    onSelect();
    carouselApi.on("reInit", onSelect).on("select", onSelect);
  }, [carouselApi]);

  return (
    <div className="relative hidden h-full w-[52%] flex-col md:flex">
      <Carousel
        className="h-full"
        opts={{
          watchDrag: false,
          loop: true,
        }}
        plugins={[plugin.current]}
        setApi={setCarouselApi}
      >
        <CarouselContent className="">
          {props.slides.map((slide, index) => (
            <SliderItem
              key={index}
              slide={slide}
              index={index}
              mousePosition={mousePosition}
            />
          ))}
        </CarouselContent>
      </Carousel>
      <SliderPagination />
    </div>
  );
};
