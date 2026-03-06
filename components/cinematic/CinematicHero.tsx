"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { gsap } from "@/lib/gsap";

const polaroids = [
  { src: "/landing/polaroid-1.png", alt: "Date moment", w: 300, h: 300, top: "10%", left: "55%", rotate: -6 },
  { src: "/landing/polaroid-2.png", alt: "Date scene", w: 360, h: 280, top: "45%", left: "65%", rotate: 4 },
  { src: "/landing/polaroid-3.png", alt: "Date experience", w: 250, h: 260, top: "60%", left: "45%", rotate: -3 },
];

export default function CinematicHero() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax for text
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Spring physics for polaroids
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const yPolaroid1 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const yPolaroid2 = useTransform(smoothProgress, [0, 1], [0, -300]);
  const yPolaroid3 = useTransform(smoothProgress, [0, 1], [0, -100]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial entry animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.2 }); // Wait for preloader

      headingRefs.current.forEach((el, index) => {
        if (!el) return;
        tl.fromTo(
          el,
          { y: 100, opacity: 0, rotateX: 45 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "power4.out" },
          index === 0 ? 0 : "-=1"
        );
      });

      tl.fromTo(
        ".hero-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.8"
      );
      
      tl.fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.5)" },
        "-=0.8"
      );

      tl.fromTo(
        ".polaroid-wrapper",
        { opacity: 0, y: 100, scale: 0.8, rotationZ: gsap.utils.random(-20, 20) },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationZ: (i) => polaroids[i].rotate,
          duration: 1.5,
          stagger: 0.15,
          ease: "expo.out",
        },
        "-=1.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden"
    >
      {/* 3D Floating Polaroids */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div style={{ y: yPolaroid1 }} className="absolute w-full h-full">
          <div className="polaroid-wrapper absolute" style={{ top: polaroids[0].top, left: polaroids[0].left }}>
            <div className="bg-white p-3 pb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500 pointer-events-auto cursor-pointer">
              <Image src={polaroids[0].src} alt={polaroids[0].alt} width={polaroids[0].w} height={polaroids[0].h} className="object-cover" priority />
            </div>
          </div>
        </motion.div>
        
        <motion.div style={{ y: yPolaroid2 }} className="absolute w-full h-full z-20">
          <div className="polaroid-wrapper absolute" style={{ top: polaroids[1].top, left: polaroids[1].left }}>
            <div className="bg-white p-3 pb-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-500 pointer-events-auto cursor-pointer">
              <Image src={polaroids[1].src} alt={polaroids[1].alt} width={polaroids[1].w} height={polaroids[1].h} className="object-cover" priority />
            </div>
          </div>
        </motion.div>

        <motion.div style={{ y: yPolaroid3 }} className="absolute w-full h-full z-10">
          <div className="polaroid-wrapper absolute" style={{ top: polaroids[2].top, left: polaroids[2].left }}>
            <div className="bg-white p-3 pb-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] transform hover:scale-105 transition-transform duration-500 pointer-events-auto cursor-pointer">
              <Image src={polaroids[2].src} alt={polaroids[2].alt} width={polaroids[2].w} height={polaroids[2].h} className="object-cover" priority />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        ref={textContainerRef}
        style={{ y: yText, opacity: opacityText }}
        className="relative z-30 flex flex-col items-start w-full max-w-[1440px] px-10 lg:px-24"
      >
        <p className="hero-desc font-dm-sans text-sm tracking-widest uppercase mb-8 text-white/70">
          Bringing Dates Back Into Dating
        </p>

        <div className="perspective-1000 mb-6">
          <div className="overflow-hidden pb-4">
            <h1
              ref={(el) => { headingRefs.current[0] = el; }}
              className="font-dm-serif-display text-[clamp(4rem,10vw,160px)] leading-[0.9] text-white tracking-tight"
            >
              Plan the Date.
            </h1>
          </div>
          <div className="overflow-hidden pb-4 ml-[5vw]">
            <h1
              ref={(el) => { headingRefs.current[1] = el; }}
              className="font-dm-serif-display text-[clamp(4rem,10vw,160px)] leading-[0.9] text-[#ff96d1] italic tracking-tight"
            >
              Meet the Person.
            </h1>
          </div>
        </div>

        <div className="hero-desc flex flex-col gap-2 max-w-[400px] mb-12 ml-[5vw] text-white/80">
          <p className="font-dm-sans text-lg font-light leading-relaxed">
            Post a date idea, find someone who&apos;s into it. Connection starts with something real.
          </p>
        </div>

        <div className="hero-cta flex gap-6 items-center ml-[5vw]">
          <Link
            href={process.env.NEXT_PUBLIC_APP_STORE_URL || "#"}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-dm-sans font-medium text-[15px] overflow-hidden"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Download the App</span>
            <div className="absolute inset-0 bg-[#ff96d1] transform scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100" />
          </Link>
          <Link
            href="https://drop.anchor.dating"
            className="group inline-flex items-center justify-center px-8 py-4 border border-white/30 rounded-full font-dm-sans font-medium text-[15px] text-white transition-all duration-300 hover:border-white hover:bg-white/5"
          >
            Go to the Drop
          </Link>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: opacityText }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        <span className="font-dm-sans text-[10px] uppercase tracking-widest text-white/50">Scroll</span>
      </motion.div>
    </section>
  );
}
