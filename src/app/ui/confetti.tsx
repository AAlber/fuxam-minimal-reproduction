"use client";
import React, { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

type ConfettiProps = {
  children: (props: { bomb: () => void }) => React.ReactNode;
};

export const Confetti: React.FC<ConfettiProps> = ({ children }) => {
  const [show, setShow] = useState(false);

  const bomb = () => {
    setShow(true);
    setTimeout(() => setShow(false), 4000);
  };

  return (
    <>
      <div className="relative flex w-full items-center justify-center">
        {show && (
          <ConfettiExplosion
            duration={4000}
            force={0.9}
            particleCount={200}
            particleSize={10}
            zIndex={1000}
            id="block-finish-confetti"
          />
        )}
      </div>
      {children({ bomb })}
    </>
  );
};
