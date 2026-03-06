"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const steps = [
  {
    num: "01",
    title: "Post your date idea.",
    desc: "Got a vibe in mind? Post it. A rooftop dinner, a bookstore crawl, a hike at sunrise — whatever you're genuinely excited about. Your idea is the icebreaker.",
    src: "/landing/drop-icon-1.png",
  },
  {
    num: "02",
    title: "They like it. You pick.",
    desc: "When someone likes your date idea, you see their Anchor Card. You're always in control — browse who's interested and choose who you want to match with.",
    src: "/landing/anchor-card-portrait.png",
  },
  {
    num: "03",
    title: "Drop the anchor.",
    desc: "Match made. Now go live it. Chat, finalize details, and actually show up. The date was already planned — you just needed the right person.",
    src: "/landing/drop-icon-2.png",
  },
];

export default function CinematicHowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const visualsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1) Darken background
      gsap.to(containerRef.current, {
        backgroundColor: "#000000",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      // 2) Master Pin Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000", // The "zone" for scrolling. 2000px provides plenty of scrolling space to digest the 3 steps smoothly.
          pin: true, // This perfectly freezes the section
          scrub: 1.2,
        },
      });

      // Initial Setup
      gsap.set(visualsRef.current[1], { opacity: 0, scale: 0.9, y: 80 });
      gsap.set(textsRef.current[1], { opacity: 0, y: 60 });
      
      gsap.set(visualsRef.current[2], { opacity: 0, scale: 0.9, y: 80 });
      gsap.set(textsRef.current[2], { opacity: 0, y: 60 });

      // Progress Tracker Line Animation
      tl.to(scrollTrackRef.current, { height: "100%", ease: "none", duration: 6 }, 0);

      // --- Sequence ---
      
      // Step 1 to 2
      tl.to(visualsRef.current[0], { opacity: 0, scale: 1.05, y: -60, duration: 1, ease: "power2.inOut" }, 1)
        .to(textsRef.current[0], { opacity: 0, y: -40, duration: 1, ease: "power2.inOut" }, 1)
        
        .to(visualsRef.current[1], { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }, 1.5)
        .to(textsRef.current[1], { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 1.5);

      // Step 2 to 3
      tl.to(visualsRef.current[1], { opacity: 0, scale: 1.05, y: -60, duration: 1, ease: "power2.inOut" }, 3.5)
        .to(textsRef.current[1], { opacity: 0, y: -40, duration: 1, ease: "power2.inOut" }, 3.5)
        
        .to(visualsRef.current[2], { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }, 4)
        .to(textsRef.current[2], { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 4)
        
      // Buffer at end
      tl.to({}, { duration: 0.5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#050505] text-white h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* Absolute floating header */}
      <div className="absolute top-0 left-0 w-full pt-20 lg:pt-32 px-10 lg:px-24 z-20 pointer-events-none flex justify-center">
        <div className="w-full max-w-[1000px] flex flex-col items-center text-center">
          <p className="font-dm-sans text-sm tracking-widest uppercase mb-4 text-[#ff96d1]">
            The Process
          </p>
          <h2 className="font-dm-serif-display text-[clamp(2.5rem,5vw,70px)] leading-[1] max-w-[800px] pointer-events-auto shadow-black drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            From idea to <em className="italic text-white">in person</em> in three steps.
          </h2>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 max-w-[1000px] w-full px-10 mt-20 z-10">
        
        {/* Vertical Progress Track (Visual indicator) moved to the left side */}
        <div className="absolute left-4 lg:-left-12 top-0 bottom-0 w-[2px] bg-white/10 hidden lg:block z-0 rounded-full">
            <div ref={scrollTrackRef} className="w-full bg-gradient-to-b from-[#ff96d1] to-[#ff96d1]/20 h-0 rounded-full shadow-[0_0_15px_#ff96d1]" />
        </div>

        {/* Visuals Left */}
        <div className="relative w-[300px] h-[400px] lg:w-[380px] lg:h-[480px] shrink-0 z-10">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { visualsRef.current[i] = el; }}
              className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden bg-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.9)] flex items-center justify-center border border-white/10 backdrop-blur-xl"
            >
              <div className="absolute top-6 left-6 font-dm-sans font-bold text-xs tracking-widest text-[#ff96d1]/80 bg-black/50 px-3 py-1 rounded-full border border-white/10 z-20">
                STEP {step.num}
              </div>
              <Image
                src={step.src}
                alt={step.title}
                fill
                className="object-cover opacity-50 mix-blend-screen scale-110 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2rem] pointer-events-none z-20" />
            </div>
          ))}
        </div>

        {/* Texts Right */}
        <div className="relative w-full lg:w-[450px] h-[300px] lg:h-[350px] z-10 flex border-l-2 lg:border-l-0 pl-6 lg:pl-0 border-white/10">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { textsRef.current[i] = el; }}
              className="absolute inset-0 flex flex-col justify-center bg-black/20 lg:bg-transparent p-6 lg:p-0 rounded-2xl lg:rounded-none backdrop-blur-md lg:backdrop-blur-none border border-white/5 lg:border-none"
            >
              <h3 className="font-dm-serif-display text-[2.5rem] lg:text-[4rem] mb-4 leading-[0.95] text-white tracking-tight drop-shadow-2xl">
                {step.title}
              </h3>
              <p className="font-dm-sans text-lg lg:text-xl font-light leading-relaxed text-white/70">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
