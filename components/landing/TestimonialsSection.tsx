"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE } from "@/lib/gsap";

const testimonials = [
  {
    quote:
      '"I posted a rooftop dinner idea on a whim. Three people liked it. I matched with one, and we actually went.',
    name: "Zoe K.",
    location: "New York, NY",
  },
  {
    quote:
      '"The Drop is so smart. Me and my match both voted for the jazz bar — we already had something to talk about before we even met."',
    name: "Marcus F.",
    location: "Chapel Hill, NC",
  },
  {
    quote:
      '"Other apps match on vibes. Anchor matched me on a specific plan. We went bookshop hopping — it was a perfect first date."',
    name: "Mimi R.",
    location: "Austin, TX.",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE.sectionReveal,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll(".testimonial-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80, rotation: 3 },
          {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: EASE.sectionReveal,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 px-10 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div ref={headingRef} className="opacity-0 mb-12">
          <p className="font-dm-sans font-medium text-[12px] text-white tracking-wide uppercase mb-3">
            EARLY LOVE
          </p>
          <h2 className="font-dm-serif-display text-[clamp(2rem,4vw,50px)] text-white leading-[1.15]">
            Real Dates.
          </h2>
          <h2 className="font-dm-serif-display text-[clamp(2rem,4vw,50px)] text-[#f38fc7] italic leading-[1.15]">
            Real People.
          </h2>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="bg-[rgba(185,185,185,0.2)] border border-white rounded-[30px] p-5 flex flex-col lg:flex-row gap-5"
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`testimonial-card flex-1 flex flex-col gap-5 opacity-0 ${
                i < testimonials.length - 1
                  ? "lg:border-r border-white lg:pr-5"
                  : ""
              }`}
            >
              <p className="font-dm-serif-display italic text-[20px] text-white leading-[1.4]">
                {t.quote}
              </p>
              <div className="flex items-start gap-2.5 mt-auto">
                <div className="w-[40px] h-[40px] rounded-full bg-[rgba(185,185,185,0.2)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-dm-sans font-medium text-[15px] text-white">{t.name}</p>
                  <p className="font-dm-sans font-medium text-[12px] text-white opacity-80">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
