"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";

const features = [
  {
    emoji: "🤝",
    title: "Partnered with local businesses",
    desc: "Anchor works with venues in your city to curate each week's Drop — exclusive experiences you won't find on your own.",
  },
  {
    emoji: "🗳️",
    title: "Vote, then get matched.",
    desc: "Your votes reveal your taste. At close, Anchor surfaces people whose choices overlapped with yours.",
  },
  {
    emoji: "⏳",
    title: "Limited time, no swiping",
    desc: "Each Drop runs for a week. When it's gone, it's gone. Urgency over endless scrolling.",
  },
];

function PhoneMockup() {
  return (
    <div className="relative w-[280px] lg:w-[322px] h-[480px] lg:h-[558px] bg-white border-[12px] border-[#8e8e8e] rounded-[57px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* Status bar pill */}
      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[102px] h-[10px] bg-[#d9d9d9] rounded-full" />

      {/* Tab bar */}
      <div className="absolute top-[52px] left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="font-dm-sans font-medium text-[12px] text-black px-1 py-1">
          Browse Dates
        </span>
        <span className="font-dm-sans font-medium text-[12px] text-white bg-black px-2 py-2 rounded-full">
          The Drop
        </span>
      </div>

      {/* Content area */}
      <div className="absolute top-[90px] left-[20px] right-[20px] bottom-[20px] overflow-hidden">
        <p className="font-dm-serif-display italic text-[24px] text-black mb-4">
          The Drop
        </p>

        {/* Date card 1 */}
        <div className="border-[1.6px] border-dashed border-[#d1d1d1] rounded-[12px] p-4 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-dm-sans font-medium text-[9.6px] text-black">WHAT?</span>
            <span className="font-dm-sans font-medium text-[9.6px] text-black">7HRS 25MIN LEFT</span>
          </div>
          <p className="font-dm-serif-display italic text-[24px] text-black leading-tight">
            Espresso Martinis
          </p>
          <p className="font-dm-sans font-medium text-[12px] text-black mt-1 mb-3">
            Whoever is late has to get the tab.
          </p>
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="font-dm-sans font-medium text-[9.6px] text-black mb-1">WHERE?</p>
              <p className="font-dm-sans font-medium text-[12px] text-black">@ one40 Social</p>
            </div>
            <div className="flex-1">
              <p className="font-dm-sans font-medium text-[9.6px] text-black mb-1">WHEN?</p>
              <p className="font-dm-sans font-medium text-[12px] text-black">Next Thursday</p>
            </div>
          </div>
        </div>

        {/* Date card 2 */}
        <div className="border-[1.6px] border-dashed border-[#d1d1d1] rounded-[12px] p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-dm-sans font-medium text-[9.6px] text-black">WHAT?</span>
            <span className="font-dm-sans font-medium text-[9.6px] text-black">3 DAYS 25MIN LEFT</span>
          </div>
          <p className="font-dm-serif-display italic text-[24px] text-black leading-tight">
            Trivia
          </p>
          <p className="font-dm-sans font-medium text-[12px] text-black mt-1 mb-3">
            Whoever fumbles more than 5 answers has to pay for drinks
          </p>
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="font-dm-sans font-medium text-[9.6px] text-black mb-1">WHERE?</p>
              <p className="font-dm-sans font-medium text-[12px] text-black">@ Zogs</p>
            </div>
            <div className="flex-1">
              <p className="font-dm-sans font-medium text-[9.6px] text-black mb-1">WHEN?</p>
              <p className="font-dm-sans font-medium text-[12px] text-black">Next Tuesday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom icon bar */}
      <div className="absolute bottom-[16px] left-[20px] right-[20px] flex items-center gap-6">
        <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
          <Image
            src="/landing/drop-mascot.png"
            alt="Anchor mascot"
            width={50}
            height={52}
            className="object-cover"
          />
        </div>
        <div className="flex-1 h-[40px] bg-white rounded-full shadow-[0_0_16px_rgba(185,185,185,0.25)] flex items-center justify-around px-4">
          <Image src="/landing/drop-icon-1.png" alt="" width={31} height={28} className="object-contain" />
          <Image src="/landing/drop-icon-2.png" alt="" width={38} height={30} className="object-contain" />
          <Image src="/landing/drop-icon-3.png" alt="" width={38} height={33} className="object-contain" />
          <Image src="/landing/drop-icon-4.png" alt="" width={31} height={28} className="object-contain" />
        </div>
      </div>
    </div>
  );
}

export default function TheDropSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Phone parallax + bob
      if (phoneRef.current) {
        gsap.to(phoneRef.current, {
          y: -15,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.fromTo(
          phoneRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: EASE.sectionReveal,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Right column content stagger
      const items = contentRef.current?.querySelectorAll(".drop-item");
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: EASE.sectionReveal,
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Feature emoji bounce
      const emojis = contentRef.current?.querySelectorAll(".feature-emoji");
      if (emojis) {
        gsap.fromTo(
          emojis,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 60%",
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
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20">
        {/* Phone mockup */}
        <div ref={phoneRef} className="opacity-0 shrink-0 rotate-[4.06deg]">
          <PhoneMockup />
        </div>

        {/* Right content */}
        <div ref={contentRef} className="max-w-[440px]">
          <p className="drop-item font-dm-sans font-medium text-[12px] text-white tracking-wide uppercase mb-3 opacity-0">
            WEEKLY FEATURE
          </p>

          <div className="drop-item mb-6 opacity-0">
            <h2 className="font-dm-serif-display text-[clamp(2rem,4vw,50px)] text-white leading-[1.15]">
              The <em className="italic text-[#ff96d1]">Drop</em>
            </h2>
          </div>

          <p className="drop-item font-dm-sans font-medium text-[15px] text-white leading-relaxed max-w-[404px] mb-4 opacity-0">
            Every week, Anchor drops curated date ideas sourced from local businesses in your city. Vote on what sounds good.
          </p>

          <p className="drop-item font-dm-sans font-medium text-[15px] text-white leading-relaxed max-w-[404px] mb-10 opacity-0">
            At the end of the Drop period, Anchor matches you with people who voted for the same things. Compatibility built on what you actually want to do — not how you describe yourself.
          </p>

          {/* Feature bullets */}
          <div className="flex flex-col gap-6">
            {features.map((f) => (
              <div key={f.title} className="drop-item opacity-0">
                <div className="flex items-center gap-[19px] mb-2">
                  <span className="feature-emoji text-[30px]">{f.emoji}</span>
                  <span className="font-dm-sans font-medium text-[15px] text-[#ff96d1]">
                    {f.title}
                  </span>
                </div>
                <p className="font-dm-sans font-medium text-[15px] text-white leading-relaxed max-w-[361px] ml-[49px]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
