import type { ReactNode } from "react";
import ProcessScreenContentHeader from "./header";
import { InfoSlider } from "./info-slider";
import { Content } from "./screen-content";

const ProcessScreen = ({ children }: { children: ReactNode }) => {
  return (
    <div className="forced-whitemode-blue flex h-screen w-screen bg-white">
      {children}
    </div>
  );
};

ProcessScreen.ContentHeader = ProcessScreenContentHeader;
ProcessScreen.InfoSlider = InfoSlider;
ProcessScreen.Content = Content;

export default ProcessScreen;
