"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

function PerspectivePhoneMockup() {
  return (
    <div className="relative w-[300px] h-[600px] lg:w-[350px] lg:h-[700px] bg-[#0c0c0c] border-[14px] border-[#222] rounded-[50px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
      
      {/* Glare overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-50 mix-blend-screen" />
      
      {/* Dynamic island */}
      <div className="absolute top-[15px] left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-full z-40 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

      {/* Content wrapper */}
      <div className="absolute inset-0 pt-[70px] px-5 pb-[100px] flex flex-col items-center">
        <p className="font-dm-serif-display italic text-3xl text-white mb-6">The Drop</p>
        
        <div className="w-full flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-dm-sans text-[10px] text-white/50 tracking-wider">WHAT?</span>
              <span className="font-dm-sans text-[10px] text-[#ff96d1] tracking-wider">7HRS LEFT</span>
            </div>
            <p className="font-dm-serif-display text-2xl text-white leading-tight mb-2">Espresso Martinis</p>
            <p className="font-dm-sans text-xs text-white/60 mb-4 pb-4 border-b border-white/10">Whoever is late gets the tab.</p>
            <div className="flex justify-between">
              <div>
                <span className="block font-dm-sans text-[10px] text-white/50 mb-1">WHERE?</span>
                <span className="font-dm-sans text-xs text-white">@ one40 Social</span>
              </div>
              <div className="text-right">
                <span className="block font-dm-sans text-[10px] text-white/50 mb-1">WHEN?</span>
                <span className="font-dm-sans text-xs text-white">Next Thursday</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md opacity-60 scale-95 origin-top">
            <div className="flex justify-between items-center mb-2">
              <span className="font-dm-sans text-[10px] text-white/50 tracking-wider">WHAT?</span>
              <span className="font-dm-sans text-[10px] text-white/50 tracking-wider">3 DAYS LEFT</span>
            </div>
            <p className="font-dm-serif-display text-2xl text-white leading-tight mb-2">Barcade Trivia</p>
            <p className="font-dm-sans text-xs text-white/60 mb-4 pb-4 border-b border-white/10">Loser buys the next round.</p>
            <div className="flex justify-between">
              <div>
                <span className="block font-dm-sans text-[10px] text-white/50 mb-1">WHERE?</span>
                <span className="font-dm-sans text-xs text-white">@ Zogs</span>
              </div>
              <div className="text-right">
                <span className="block font-dm-sans text-[10px] text-white/50 mb-1">WHEN?</span>
                <span className="font-dm-sans text-xs text-white">Next Tuesday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mascot & App Bar */}
      <div className="absolute bottom-6 left-5 right-5 flex items-center gap-4 z-40">
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden shrink-0 border border-white/20 bg-black">
          <Image src="/landing/drop-mascot.png" alt="Mascot" width={50} height={50} className="object-cover" />
        </div>
        <div className="flex-1 h-[50px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-around px-2">
          {/* Dummy icons */}
          <div className="w-6 h-6 rounded-full bg-white/30" />
          <div className="w-6 h-6 rounded-full bg-white/80" />
          <div className="w-6 h-6 rounded-full bg-white/30" />
          <div className="w-6 h-6 rounded-full bg-[#ff96d1]" />
        </div>
      </div>
    </div>
  );
}

export default function CinematicTheDrop() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !phoneWrapperRef.current) return;

    const ctx = gsap.context(() => {
      // 3D Perspective rotation tied to scroll
      gsap.fromTo(
        phoneWrapperRef.current,
        {
          rotateX: 40,
          rotateY: -30,
          rotateZ: 10,
          scale: 0.8,
          y: 200,
          opacity: 0,
        },
        {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      // Subtle continuous levitation
      gsap.to(phoneWrapperRef.current, {
        y: "-=15",
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-48 bg-[#050505] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        <div className="w-full lg:w-1/2 flex flex-col items-start z-10">
          <p className="font-dm-sans text-sm tracking-widest uppercase mb-4 text-[#ff96d1] drop-item">
            Weekly Feature
          </p>
          <h2 className="font-dm-serif-display text-[clamp(3.5rem,8vw,100px)] leading-[1] text-white mb-8 drop-item tracking-tight">
            The <em className="italic text-[#ff96d1]">Drop</em>
          </h2>
          
          <div className="flex flex-col gap-6 max-w-[480px]">
            <p className="drop-item font-dm-sans text-lg text-white/70 leading-relaxed font-light">
              Every week, Anchor drops curated date ideas sourced from local businesses in your city. Vote on what sounds good.
            </p>
            <p className="drop-item font-dm-sans text-lg text-white/70 leading-relaxed font-light">
              At the close of the Drop, Anchor surfaces people whose choices overlapped with yours. Compatibility built on what you actually want to do.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-1">⏳</span>
              <div>
                <h4 className="font-dm-sans text-white text-lg font-medium mb-1">Time Limited</h4>
                <p className="font-dm-sans text-white/60 text-sm">When it's gone, it's gone. Urgency over endless scrolling.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-1">🤝</span>
              <div>
                <h4 className="font-dm-sans text-white text-lg font-medium mb-1">Curated Locals</h4>
                <p className="font-dm-sans text-white/60 text-sm">Partnered with the best independent venues in your city.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end perspective-1000 z-10 min-h-[700px]">
          <div ref={phoneWrapperRef} className="transform-style-3d will-change-transform drop-shadow-2xl">
            <PerspectivePhoneMockup />
          </div>
        </div>

      </div>

      {/* Deep background glow */}
      <div className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#ff96d1] rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none" />
    </section>
  );
}
