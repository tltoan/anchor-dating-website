"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Disable scroll while loading
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete();
        },
      });

      // Simulate loading progress
      const progressObj = { value: 0 };
      tl.to(progressObj, {
        value: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          setProgress(Math.round(progressObj.value));
        },
      });

      // Scale text slightly while loading
      tl.to(
        textRef.current,
        {
          scale: 1.05,
          duration: 2.2,
          ease: "none",
        },
        0
      );

      // Exit animation
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
      });
    }, containerRef);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white"
    >
      <div className="absolute inset-0 z-0 cinematic-grain opacity-10 pointer-events-none" />
      
      <div ref={textRef} className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="font-playfair italic font-bold text-3xl tracking-widest uppercase">
          Anchor
        </h1>
        <div className="w-[120px] h-[1px] bg-white/20 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 bottom-0 bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div ref={counterRef} className="font-dm-sans text-xs tracking-[0.2em] font-medium mt-2">
          {progress.toString().padStart(3, "0")} %
        </div>
      </div>
    </div>
  );
}
