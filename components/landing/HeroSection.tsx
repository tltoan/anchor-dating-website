"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap, EASE } from "@/lib/gsap";

const polaroids = [
  { src: "/landing/polaroid-1.png", alt: "Date moment", rotate: -9.31, w: 200, h: 200, top: "0%", left: "0%" },
  { src: "/landing/polaroid-2.png", alt: "Date scene", rotate: 3.61, w: 266, h: 205, top: "48%", left: "42%" },
  { src: "/landing/polaroid-3.png", alt: "Date experience", rotate: -2.31, w: 175, h: 188, top: "65%", left: "0%" },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headingLine1Ref = useRef<HTMLDivElement>(null);
  const headingLine2Ref = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const polaroidRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.sectionReveal } });

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.4 }
      );

      tl.fromTo(
        headingLine1Ref.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: EASE.textWipe },
        "-=0.1"
      );

      tl.fromTo(
        headingLine2Ref.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: EASE.textWipe },
        "-=0.35"
      );

      tl.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      );

      polaroidRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          {
            opacity: 0,
            y: -180,
            rotation: gsap.utils.random(-20, 20),
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            rotation: polaroids[i].rotate,
            scale: 1,
            duration: 0.7,
            ease: EASE.elementPop,
          },
          i === 0 ? "-=0.4" : "-=0.45"
        );
      });

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-32 pb-20 px-10 lg:px-20 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row w-full max-w-[1280px] mx-auto gap-16 lg:gap-0 items-center">
        {/* Left content */}
        <div className="w-full lg:w-[55%] flex flex-col gap-0">
          <div ref={taglineRef} className="opacity-0">
            <p className="font-dm-sans font-medium text-[15px] text-white mb-4">
              Bringing Dates Back Into Dating
            </p>
          </div>

          <div className="mb-6">
            <div ref={headingLine1Ref} style={{ clipPath: "inset(0 100% 0 0)" }}>
              <h1 className="font-dm-serif-display text-[clamp(3rem,7vw,100px)] text-white leading-[1.05]">
                Plan the Date,
              </h1>
            </div>
            <div ref={headingLine2Ref} style={{ clipPath: "inset(0 100% 0 0)" }}>
              <h1 className="font-dm-serif-display text-[clamp(3rem,7vw,100px)] text-[#f38fc7] italic leading-[1.05]">
                Meet the Person.
              </h1>
            </div>
          </div>

          <div ref={descRef} className="opacity-0 flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[10px] max-w-[309px]">
              <p className="font-dm-sans font-medium text-[15px] text-white leading-normal">
                Post a date idea, find someone who&apos;s into it.
              </p>
              <p className="font-dm-sans font-medium text-[15px] text-white leading-normal">
                Connection starts with something real.
              </p>
            </div>
          </div>

          <div ref={ctaRef} className="opacity-0 flex gap-5 items-center mt-8">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={process.env.NEXT_PUBLIC_APP_STORE_URL || "#"}
                className="inline-flex items-center justify-center px-5 py-3.5 bg-[#ff96d1] rounded-full font-dm-sans font-medium text-[15px] text-white transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(255,150,209,0.4)]"
              >
                Download the App
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="https://drop.anchor.dating"
                className="inline-flex items-center justify-center px-5 py-3.5 border border-white rounded-full font-dm-sans font-medium text-[15px] text-white transition-colors duration-300 hover:bg-white/10"
              >
                Go to the Drop
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right: Polaroid photos */}
        <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end">
          <div className="relative w-[380px] h-[420px] lg:w-[460px] lg:h-[480px]">
            {polaroids.map((p, i) => (
              <motion.div
                key={i}
                ref={(el) => { polaroidRefs.current[i] = el; }}
                className="absolute cursor-pointer"
                style={{
                  top: p.top,
                  left: p.left,
                  rotate: p.rotate,
                  zIndex: i === 1 ? 20 : 10 + i,
                }}
                whileHover={{ rotate: 0, scale: 1.06, zIndex: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="bg-white p-[15px] pb-[30px] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.w}
                    height={p.h}
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 opacity-0"
      >
        <p className="font-dm-sans font-medium text-[15px] text-white text-center">
          Scroll to See How It Works
        </p>
        <svg
          className="w-4 h-4 text-white animate-scroll-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
