"use client";
import { Button } from "@/src/app/ui/button";
import { Slide } from "./info-slider";

const LearnMoreButton = () => {
  return (
    <Button
      onClick={() => window.open("https://fuxam.com", "_blank")}
      variant={"link"}
      className="text-white"
    >
      {"Learn more"}
    </Button>
  );
};

const createSlide = (index: number, ): Slide => ({
  title: "Slide Title",
  description:"Slide Description",
  image: `/images/login/login_${index}.webp`,
  children: <LearnMoreButton />,
});

export const defaultProcessSlides = () =>
  Array.from({ length: 5 }, (_, index) => createSlide(index));
