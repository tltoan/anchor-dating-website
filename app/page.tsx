"use client";

import { useEffect, useRef, useCallback } from "react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CravingSection from "@/components/landing/CravingSection";
import TheDropSection from "@/components/landing/TheDropSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTAFooter from "@/components/landing/CTAFooter";

export default function Page() {
  const pageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!pageRef.current) return;
    pageRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
    pageRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <SmoothScroll>
      <div
        ref={pageRef}
        className="landing-grain landing-cursor-glow"
        style={{
          backgroundImage:
            "linear-gradient(-85deg, #231910 3.6%, #3e3e3e 90.4%)",
          minHeight: "100vh",
        }}
      >
        <Header />
        <HeroSection />
        <HowItWorksSection />
        <CravingSection />
        <TheDropSection />
        <TestimonialsSection />
        <CTAFooter />
      </div>
    </SmoothScroll>
  );
}
