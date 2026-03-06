"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const EASE = {
  sectionReveal: "power3.out",
  textWipe: "power2.inOut",
  elementPop: "back.out(1.4)",
  smooth: "power2.out",
} as const;
