"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";

const steps = [
  {
    num: "01",
    emoji: "💡",
    title: "Post your date idea",
    desc: "Got a vibe in mind? Post it. A rooftop dinner, a bookstore crawl, a hike at sunrise — whatever you're genuinely excited about. Your idea is the icebreaker, not your bio.",
    tags: [
      { label: "🍿 Drive in Movie", dark: false },
      { label: "🍜 Late Night Ramen", dark: true },
      { label: "🧗 Climbing Gym", dark: false },
      { label: "🍷 Wine and Paint", dark: false },
    ],
  },
  {
    num: "02",
    emoji: "🩷",
    title: "People like your idea — you pick",
    desc: "When someone likes your date idea, you see their Anchor Card. You're always in control — browse who's interested and choose who you want to match with. No guessing, no ghosting.",
    tags: null,
  },
  {
    num: "03",
    emoji: "📍",
    title: "Drop your anchor — go on the date",
    desc: "Match made. Now go live it. Chat, finalize details, and actually show up. The date was already planned — you just needed the right person.",
    tags: null,
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const curveWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: EASE.sectionReveal,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      if (curveWrapperRef.current) {
        gsap.fromTo(
          curveWrapperRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 -5% 0)",
            ease: "none",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.8,
            },
          }
        );
      }

      const stepEls = stepsRef.current?.querySelectorAll(".step-item");
      if (stepEls) {
        stepEls.forEach((step) => {
          const circle = step.querySelector(".step-circle");
          const content = step.querySelector(".step-content");
          const line = step.querySelector(".step-line");
          const tags = step.querySelectorAll(".step-tag");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });

          if (circle) {
            tl.fromTo(
              circle,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: EASE.elementPop }
            );
          }

          if (line) {
            tl.fromTo(
              line,
              { scaleY: 0, transformOrigin: "top" },
              { scaleY: 1, duration: 0.6, ease: EASE.smooth },
              "-=0.2"
            );
          }

          if (content) {
            tl.fromTo(
              content,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, ease: EASE.sectionReveal },
              "-=0.4"
            );
          }

          if (tags.length) {
            tl.fromTo(
              tags,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: EASE.elementPop,
              },
              "-=0.2"
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 px-10 lg:px-20"
    >
      <div className="max-w-[1280px] mx-auto relative">
        {/* Section heading */}
        <div ref={headingRef} className="opacity-0 mb-16">
          <p className="font-dm-sans font-medium text-[12px] text-white tracking-wide uppercase mb-3">
            HOW IT WORKS
          </p>
          <h2 className="font-dm-serif-display text-[clamp(2rem,4vw,50px)] text-white leading-[1.15]">
            From idea to{" "}
            <em className="italic">in person</em> in
          </h2>
          <h2 className="font-dm-serif-display text-[clamp(2rem,4vw,50px)] text-[#f38fc7] leading-[1.15]">
            three steps.
          </h2>
        </div>

        <div className="flex gap-12 lg:gap-20">
          {/* Steps */}
          <div ref={stepsRef} className="flex flex-col gap-0 flex-1 max-w-[650px]">
            {steps.map((step, i) => (
              <div key={step.num} className={`step-item relative flex gap-6 ${i < steps.length - 1 ? "pb-12" : "pb-0"}`}>
                {/* Vertical connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="step-circle flex items-center justify-center w-[50px] h-[50px] bg-[#eaeaea] rounded-full shadow-[0_0_9.5px_0px_white]">
                    <span className="font-dm-serif-display italic text-[30px] text-[#919191] leading-none">
                      {step.num}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="step-line w-px h-full min-h-[100px] border-l-2 border-dashed border-white/40 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="step-content pt-1">
                  <p className="text-[30px] mb-1">{step.emoji}</p>
                  <h3 className="font-dm-serif-display italic text-[20px] text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="font-dm-sans font-medium text-[15px] text-white leading-relaxed max-w-[451px] mb-4">
                    {step.desc}
                  </p>
                  {step.tags && (
                    <div className="flex flex-wrap gap-2.5">
                      {step.tags.map((tag) => (
                        <motion.span
                          key={tag.label}
                          className={`step-tag inline-flex items-center justify-center px-2.5 py-1 rounded-full font-dm-sans font-medium text-[12px] ${
                            tag.dark
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          }`}
                          whileHover={{ scale: 1.08 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          {tag.label}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Curvy decorative path + chevron */}
          <div
            ref={curveWrapperRef}
            className="hidden lg:block w-[215px] shrink-0 relative self-stretch"
          >
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 216.5 780"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M1.00015 1.00015C1.00015 1.00015 215.5 35.5001 215.5 149C215.5 262.5 34.5001 340 34.5001 374.5C34.5001 409 198.5 371.5 198.5 531C198.5 690.5 4.50015 690.5 4.50015 690.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
              <g transform="translate(3.5, 675)">
                <path
                  d="M11.7491 1.00022C11.5428 1.41375 6.69093 8.00606 2.91407 12.3753C1.88144 13.5698 1.06325 14.4461 1.02188 15.1799C4.11528 18.6103 9.17359 23.6899 11.4256 26.5954C11.8841 27.1926 12.162 27.5434 12.4623 27.8409"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
