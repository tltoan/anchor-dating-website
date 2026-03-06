"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

export default function CinematicFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const textClipRef1 = useRef<HTMLDivElement>(null);
  const textClipRef2 = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Massive text clip reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });

      tl.fromTo(
        textClipRef1.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none" }
      ).fromTo(
        textClipRef2.current,
        { clipPath: "inset(0 0 0 100%)" },
        { clipPath: "inset(0 0% 0 0%)", ease: "none" },
        "-=0.5"
      );

      // Magnetic button effect on hover
      if (buttonRef.current) {
        const btn = buttonRef.current;
        const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3" });

        const mouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - rect.left - rect.width / 2;
          const relY = e.clientY - rect.top - rect.height / 2;
          xTo(relX * 0.4);
          yTo(relY * 0.4);
        };

        const mouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener("mousemove", mouseMove);
        btn.addEventListener("mouseleave", mouseLeave);
        
        return () => {
          btn.removeEventListener("mousemove", mouseMove);
          btn.removeEventListener("mouseleave", mouseLeave);
        };
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-40 pb-20 bg-[#050505] overflow-hidden flex flex-col items-center">
      
      {/* Decorative top line */}
      <div className="w-px h-32 bg-gradient-to-t from-[#ff96d1]/50 to-transparent absolute top-0" />

      <div className="flex flex-col items-center justify-center text-center z-10 w-full px-4 mb-24">
        <div ref={textClipRef1} className="py-3" style={{ clipPath: "inset(0 100% 0 0)" }}>
          <h2 className="font-dm-serif-display text-[clamp(4rem,14vw,200px)] leading-[1] text-white uppercase tracking-tighter">
            Stop Swiping.
          </h2>
        </div>
        <div ref={textClipRef2} className="py-3" style={{ clipPath: "inset(0 0 0 100%)" }}>
          <h2 className="font-dm-serif-display text-[clamp(4rem,14vw,200px)] leading-[1] text-[#ff96d1] italic uppercase tracking-tighter">
            Start Living.
          </h2>
        </div>
      </div>

      <div className="relative p-12 w-full flex justify-center z-20">
        {/* Magnetic Button Wrapper */}
        <div ref={buttonRef} className="inline-block p-4">
          <Link
            href={process.env.NEXT_PUBLIC_APP_STORE_URL || "#"}
            className="group relative flex items-center justify-center w-[220px] h-[220px] bg-white rounded-full transition-transform duration-500 hover:scale-105"
          >
            <div className="absolute inset-2 border border-black/10 rounded-full group-hover:scale-95 transition-transform duration-500" />
            <span className="font-dm-sans font-medium text-lg text-black text-center max-w-[120px] leading-tight z-10">
              Get Anchor on iOS
            </span>
            <div className="absolute inset-0 bg-[#333] rounded-full transform scale-0 origin-center transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100 mix-blend-difference" />
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mt-32 px-10 lg:px-24 flex flex-col lg:flex-row items-center justify-between z-10 border-t border-white/10 pt-8">
        <p className="font-dm-sans text-xs text-white/40 tracking-widest uppercase mb-4 lg:mb-0">
          © 2026 Anchor Dating
        </p>

        <div className="flex items-center gap-8">
          <Link href="/privacy" className="font-dm-sans text-xs text-white/50 tracking-widest uppercase hover:text-white transition-colors duration-300">
            Privacy
          </Link>
          <Link href="/terms" className="font-dm-sans text-xs text-white/50 tracking-widest uppercase hover:text-white transition-colors duration-300">
            Terms
          </Link>
          <a href="mailto:kyle100@wharton.upenn.edu" className="font-dm-sans text-xs text-white/50 tracking-widest uppercase hover:text-white transition-colors duration-300">
            Contact
          </a>
          <a href="https://instagram.com/anchor.dating" target="_blank" rel="noopener noreferrer" className="font-dm-sans text-xs text-white/50 tracking-widest uppercase hover:text-white transition-colors duration-300">
            Instagram
          </a>
        </div>
      </div>

      {/* Noise overlay specific to footer for extra grit */}
      <div className="absolute inset-0 cinematic-grain opacity-20 pointer-events-none z-0 mix-blend-overlay" />
    </section>
  );
}
