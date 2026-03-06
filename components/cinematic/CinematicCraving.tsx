"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const anchorCardData = {
  name: "Sabrina",
  pronouns: "She/Her",
  photo: "/landing/anchor-card-portrait.png",
  bg: "/landing/anchor-card-bg.png",
  stats: [
    { label: "AGE", value: "20" },
    { label: "HGT", value: "5'1" },
    { label: "JOB", value: "Student" },
    { label: "LOC", value: "New York, NY" },
  ],
};

const tickerPills = [
  "🍿 Drive in Movie", "🍜 Late Night Ramen", "🧗 Climbing Gym",
  "🍷 Wine and Paint", "☕ Coffee and Walk", "🎨 Museum Date",
  "🎭 Comedy Show", "🏔️ Sunrise Hike", "🎵 Jazz Night", "🍦 Ice Cream Tour",
];

function AnchorCard({ className }: { className?: string }) {
  return (
    <div className={`relative w-[320px] lg:w-[400px] h-[220px] lg:h-[280px] rounded-[20px] border border-white/20 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] ${className || ""}`}>
      <Image src={anchorCardData.bg} alt="" fill className="object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="relative z-10 flex flex-col justify-between p-6 h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-dm-serif-display text-2xl text-white">{anchorCardData.name}</p>
            <p className="font-dm-sans text-sm text-white/70">{anchorCardData.pronouns}</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <p className="font-dm-sans text-xs text-white">Anchor Card</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-[80px] h-[100px] lg:w-[100px] lg:h-[120px] rounded-[12px] overflow-hidden relative shrink-0 border border-white/10 shadow-lg">
            <Image src={anchorCardData.photo} alt={anchorCardData.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-2 flex-1 font-dm-sans text-xs lg:text-sm text-white/80 tracking-wide">
            {anchorCardData.stats.map((s) => (
              <div key={s.label} className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-white/50">{s.label}</span>
                <span className="text-white text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CinematicCraving() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRevealRef.current || !cardStackRef.current) return;

    const ctx = gsap.context(() => {
      // 1) Scrub text reveal
      const words = textRevealRef.current?.querySelectorAll(".reveal-word");
      if (words) {
        gsap.to(words, {
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 10%",
            scrub: 1.5,
          },
        });
      }

      // 2) 3D Card Unstacking
      const cards = cardStackRef.current?.querySelectorAll(".stacked-card");
      if (cards && cards.length === 3) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardStackRef.current,
            start: "top 70%",
            end: "bottom 40%",
            scrub: 1,
          },
        });

        // initial state
        gsap.set(cards[0], { zIndex: 1, scale: 0.9, y: -40, rotationZ: -4, opacity: 0.4 });
        gsap.set(cards[1], { zIndex: 2, scale: 0.95, y: -20, rotationZ: 2, opacity: 0.7 });
        gsap.set(cards[2], { zIndex: 3, scale: 1, y: 0, rotationZ: 0, opacity: 1 });

        // Unstack animation
        tl.to(cards[0], { x: -180, y: 40, rotationZ: -12, scale: 1, opacity: 1, ease: "power2.out" }, 0)
          .to(cards[1], { x: 180, y: 30, rotationZ: 10, scale: 1, opacity: 1, ease: "power2.out" }, 0)
          .to(cards[2], { y: -20, scale: 1.05, ease: "power2.out" }, 0);
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-40 bg-[#050505] overflow-hidden">
      
      {/* Massive Scrub Text Reveal */}
      <div className="max-w-[1200px] mx-auto px-10 lg:px-24 mb-32 flex flex-col items-center text-center">
        <div ref={textRevealRef} className="font-dm-serif-display text-[clamp(2.5rem,6vw,80px)] leading-[1.1] text-white/20">
          <span className="reveal-word inline-block mr-[0.3em] opacity-10">We're</span>
          <span className="reveal-word inline-block mr-[0.3em] italic text-[#ff96d1]/20">craving</span>
          <span className="reveal-word inline-block opacity-10">human</span>
          <span className="reveal-word inline-block opacity-10">connection.</span>
        </div>
        
        <p className="font-dm-sans text-lg lg:text-xl text-white/60 max-w-[500px] mt-12 text-center leading-relaxed">
          Swipe fatigue is real. Anchor brings you back to the table — literally. Start with a plan, not a pitch.
        </p>
      </div>

      {/* 3D Card Stack */}
      <div ref={cardStackRef} className="relative h-[500px] flex items-center justify-center perspective-1000 mb-20">
        <div className="relative w-[320px] h-[220px] lg:w-[400px] lg:h-[280px]">
          <div className="stacked-card absolute top-0 left-0 w-full h-full transform-style-3d">
            <AnchorCard />
          </div>
          <div className="stacked-card absolute top-0 left-0 w-full h-full transform-style-3d">
            <AnchorCard />
          </div>
          <div className="stacked-card absolute top-0 left-0 w-full h-full transform-style-3d">
            <AnchorCard />
          </div>
        </div>
      </div>

      {/* Deep blurred cinematic ticker */}
      <div className="relative py-10 rotate-[-2deg] scale-110 overflow-hidden bg-black/50 border-y border-white/5 backdrop-blur-xl">
        <div className="flex animate-marquee whitespace-nowrap opacity-60">
          {[...tickerPills, ...tickerPills, ...tickerPills].map((pill, i) => (
            <span
              key={i}
              className="inline-flex items-center justify-center px-6 py-3 mx-4 bg-white/5 rounded-full border border-white/10 font-dm-sans text-sm text-white whitespace-nowrap shrink-0"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
