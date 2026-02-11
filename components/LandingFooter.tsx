"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface LandingWaitlistInputProps {
  placeholder?: string;
  buttonLabel?: string;
  onSubmit?: (value: string) => void;
  className?: string;
}

export const LandingWaitlistInput: React.FC<LandingWaitlistInputProps> = ({
  placeholder = "name@gmail.com",
  buttonLabel = "Join Waitlist",
  onSubmit,
  className,
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(value.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-xl items-center rounded-full bg-[#7299ff] py-1 shadow-md shadow-slate-300/60 md:py-2 h-12 ${className || ""}`}
    >
      <input
        type="email"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent px-4 text-sm text-white placeholder:text-white/70 outline-none md:text-base"
        style={{ paddingLeft: "1rem" }}
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-black px-5 py-2 text-xs font-medium tracking-wide text-white transition hover:bg-neutral-900 md:px-2 md:py-2 md:text-sm w-28 h-12 cursor-pointer"
      >
        {buttonLabel}
      </button>
    </form>
  );
};

const orbitIcons = [
  // Icons are placed evenly around a circle using polar coordinates
  // to avoid any overlap at different screen sizes.
  {
    src: "/anchor-icons/anchor.png",
    alt: "Anchor illustration",
    size: 80,
    angleDeg: 0,
  },
  {
    src: "/anchor-icons/notification.png",
    alt: "Notification illustration",
    size: 72,
    angleDeg: 30,
  },
  {
    src: "/anchor-icons/height_verification.png",
    alt: "Height verification illustration",
    size: 82,
    angleDeg: 60,
  },
  {
    src: "/anchor-icons/anchor.png",
    alt: "Anchor illustration",
    size: 80,
    angleDeg: 90,
  },
  {
    src: "/anchor-icons/notification.png",
    alt: "Notification illustration",
    size: 76,
    angleDeg: 120,
  },
  {
    src: "/anchor-icons/height_verification.png",
    alt: "Height verification illustration",
    size: 82,
    angleDeg: 150,
  },
  {
    src: "/anchor-icons/anchor.png",
    alt: "Anchor illustration",
    size: 80,
    angleDeg: 180,
  },
  {
    src: "/anchor-icons/notification.png",
    alt: "Notification illustration",
    size: 72,
    angleDeg: 210,
  },
  {
    src: "/anchor-icons/height_verification.png",
    alt: "Height verification illustration",
    size: 78,
    angleDeg: 240,
  },
  {
    src: "/anchor-icons/anchor.png",
    alt: "Anchor illustration",
    size: 80,
    angleDeg: 270,
  },
  {
    src: "/anchor-icons/notification.png",
    alt: "Notification illustration",
    size: 76,
    angleDeg: 300,
  },
  {
    src: "/anchor-icons/height_verification.png",
    alt: "Height verification illustration",
    size: 82,
    angleDeg: 330,
  },
];

const IconOrbit: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative h-105 w-105 md:h-130 md:w-130"
        style={{ transformOrigin: "center center" }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {orbitIcons.map((icon, index) => {
          const angle = icon.angleDeg;
          // Use a single radius in all directions so the path is a true circle,
          // and make it larger so icons sit farther away from the centered content.
          const radius = 235;

          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
              }}
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={icon.size}
                height={icon.size}
                className="blur-[1px]"
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

const LandingFooter: React.FC = () => {
  return (
    <footer className="relative w-full">
      <div className="relative mx-auto flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20 md:py-24">
        {/* Rotating icon orbit */}
        <IconOrbit />

        {/* Central content */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center md:gap-8">
          {/* Logo card */}
          <Image
            src="/anchor-header-logo.png"
            alt="Anchor"
            width={100}
            height={100}
            className="shadow-[0_18px_40px_rgba(0,0,0,0.12)] rounded-2xl"
          />

          <p className="max-w-xl text-base text-neutral-900 md:text-lg">
            On <span className="font-bold">Anchor</span>, every match is a{" "}
            <span className="font-bold italic">date</span>
          </p>

          <LandingWaitlistInput />
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
