"use client";

import ProcessScreen from "./components/process-screen";
import { defaultProcessSlides } from "./components/process-screen/functions";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProcessScreen>
      <ProcessScreen.InfoSlider slides={defaultProcessSlides()} />
      <ProcessScreen.Content>{children}</ProcessScreen.Content>
    </ProcessScreen>
  );
}
