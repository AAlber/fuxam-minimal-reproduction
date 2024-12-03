import { create } from "zustand";
import type { CarouselApi } from "@/src/app/ui/carousel";

interface ProcessScreenStore {
  currentScreen: number;
  setCurrentScreen: (screen: number) => void;
  count: number;
  setCount: (count: number) => void;
  carouselApi: CarouselApi;
  setCarouselApi: (api: CarouselApi) => void;
  bgColors: string[];
}

const initialState = {
  currentScreen: 0,
  count: 0,
  carouselApi: undefined,
  bgColors: [
    "bg-fuxam-pink",
    "bg-fuxam-orange",
    "bg-fuxam-yellow",
    "bg-fuxam-green",
    "bg-fuxam-blue",
  ],
};

export const useProcessScreenStore = create<ProcessScreenStore>((set) => ({
  ...initialState,
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setCount: (count) => set({ count }),
  setCarouselApi: (api) => set({ carouselApi: api }),
}));
