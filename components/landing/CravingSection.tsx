"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";

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
  "🍿 Drive in Movie",
  "🍜 Late Night Ramen",
  "🧗 Climbing Gym",
  "🍷 Wine and Paint",
  "☕ Coffee and Walk",
  "🎨 Museum Date",
  "🎭 Comedy Show",
  "🏔️ Sunrise Hike",
  "🎵 Jazz Night",
  "🍦 Ice Cream Tour",
];

function AnchorCard({ rotation, className }: { rotation: number; className?: string }) {
  return (
    <motion.div
      className={`relative w-[300px] lg:w-[350px] h-[215px] lg:h-[250px] rounded-[15px] border-4 border-white overflow-hidden ${className || ""}`}
      style={{ rotate: rotation }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Image
        src={anchorCardData.bg}
        alt=""
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 flex flex-col gap-2.5 p-5 h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-dm-serif-display text-[20px] text-white">{anchorCardData.name}</p>
            <p className="font-dm-sans font-medium text-[15px] text-white">{anchorCardData.pronouns}</p>
          </div>
          <p className="font-dm-sans font-medium text-[15px] text-white text-center">Anchor Card</p>
        </div>
        <div className="flex gap-2.5 items-center flex-1">
          <div className="w-[85px] lg:w-[100px] h-[100px] lg:h-[120px] rounded-[15px] overflow-hidden relative shrink-0">
            <Image
              src={anchorCardData.photo}
              alt={anchorCardData.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2.5 flex-1 font-dm-sans font-medium text-[15px] text-white text-center">
            {anchorCardData.stats.map((s) => (
              <div key={s.label} className="flex items-center justify-between w-full">
                <span>{s.label}</span>
                <span>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CravingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Word-by-word heading reveal
      const words = headingRef.current?.querySelectorAll(".word");
      if (words) {
        gsap.fromTo(
          words,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: EASE.sectionReveal,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 75%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }

      // Subtitle
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: EASE.sectionReveal,
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards stagger in
      const cards = cardsRef.current?.querySelectorAll(".anchor-card");
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, x: i === 0 ? -80 : 80, rotate: 0 },
            {
              opacity: 1,
              x: 0,
              rotate: i === 0 ? 8.88 : -0.09,
              duration: 0.8,
              ease: EASE.sectionReveal,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 70%",
                toggleActions: "play none none none",
              },
              delay: i * 0.2,
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-40 px-10 lg:px-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-8">
          <h2 className="font-dm-serif-display text-[clamp(2.5rem,6vw,80px)] text-white leading-[1.1]">
            <span className="word inline-block mr-[0.3em]">We&apos;re</span>
            <span className="word inline-block mr-[0.3em] italic text-[#ff96d1]">craving</span>
          </h2>
          <h2 className="font-dm-serif-display text-[clamp(2.5rem,6vw,80px)] text-white leading-[1.1]">
            <span className="word inline-block">human-connection.</span>
          </h2>
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="opacity-0 text-center max-w-[340px] mx-auto mb-16">
          <p className="font-dm-sans font-medium text-[15px] text-white leading-relaxed">
            Swipe fatigue is real. Anchor brings you
          </p>
          <p className="font-dm-sans font-medium text-[15px] text-white leading-relaxed">
            back to the table -- literally. Start with a plan, not a pitch.
          </p>
        </div>

        {/* Anchor Cards */}
        <div ref={cardsRef} className="flex justify-center items-center mb-20">
          <div className="relative w-[380px] lg:w-[460px] h-[320px] lg:h-[360px]">
            <div className="anchor-card absolute top-0 left-0 opacity-0">
              <AnchorCard rotation={8.88} />
            </div>
            <div className="anchor-card absolute top-[40px] left-[20px] lg:left-[40px] opacity-0">
              <AnchorCard rotation={-0.09} />
            </div>
          </div>
        </div>

        {/* Blurred activity pills ticker */}
        <div className="relative -mx-10 lg:-mx-20 overflow-hidden blur-[1.9px]">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...tickerPills, ...tickerPills].map((pill, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center px-3 py-1.5 mx-2.5 bg-[#d1d1d1] rounded-full shadow-[0_0_10px_0px_white] font-dm-sans font-medium text-[14.4px] text-black whitespace-nowrap shrink-0"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
