"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import CinematicSmoothScroll from "@/components/cinematic/CinematicSmoothScroll";
import CinematicPreloader from "@/components/cinematic/CinematicPreloader";
import Header from "@/components/landing/Header";

import CinematicHero from "@/components/cinematic/CinematicHero";
import CinematicHowItWorks from "@/components/cinematic/CinematicHowItWorks";
import CinematicCraving from "@/components/cinematic/CinematicCraving";
import CinematicTheDrop from "@/components/cinematic/CinematicTheDrop";
import CinematicFooter from "@/components/cinematic/CinematicFooter";

export default function CinematicPage() {
  const [loading, setLoading] = useState(true);
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
    <>
      {loading && <CinematicPreloader onComplete={() => setLoading(false)} />}
      
      <CinematicSmoothScroll>
        <div
          ref={pageRef}
          className="cinematic-bg cinematic-wrapper cinematic-grain landing-cursor-glow"
          style={{ minHeight: "100vh" }}
        >
          <Header />
          <CinematicHero />
          <CinematicHowItWorks />
          <CinematicCraving />
          <CinematicTheDrop />
          <CinematicFooter />
        </div>
      </CinematicSmoothScroll>
    </>
  );
}
