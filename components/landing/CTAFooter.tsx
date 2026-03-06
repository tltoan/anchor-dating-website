"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, EASE } from "@/lib/gsap";

export default function CTAFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        line1Ref.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: EASE.textWipe }
      );

      tl.fromTo(
        line2Ref.current,
        { clipPath: "inset(0 0 0 100%)" },
        { clipPath: "inset(0 0 0 0%)", duration: 0.9, ease: EASE.textWipe },
        "+=0.15"
      );

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: EASE.sectionReveal },
        "-=0.2"
      );

      tl.fromTo(
        linksRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: EASE.smooth },
        "-=0.1"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-24 lg:pt-40 pb-32 px-10 lg:px-20">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center">
        <div
          ref={line1Ref}
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <h2 className="font-dm-serif-display text-[clamp(3rem,7vw,100px)] text-white leading-[1.05]">
            Stop Swiping.
          </h2>
        </div>
        <div
          ref={line2Ref}
          style={{ clipPath: "inset(0 0 0 100%)" }}
        >
          <h2 className="font-dm-serif-display text-[clamp(3rem,7vw,100px)] text-[#ff96d1] italic leading-[1.05]">
            Start Living.
          </h2>
        </div>

        <div ref={badgeRef} className="mt-14 opacity-0">
          <a
            href={process.env.NEXT_PUBLIC_APP_STORE_URL || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/landing/app-store-badge.png"
              alt="Download on the App Store"
              width={184}
              height={54}
              className="hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        ref={linksRef}
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 lg:px-20 py-6 opacity-0"
      >
        <p className="text-xs text-white/50 font-dm-sans">
          © 2026 Anchor Dating
        </p>
        <div className="flex items-center gap-5 text-sm font-dm-sans text-white/60">
          <a href="/privacy" className="hover:text-white transition-colors duration-300">
            Privacy
          </a>
          <a href="/terms" className="hover:text-white transition-colors duration-300">
            Terms
          </a>
          <a
            href="mailto:kyle100@wharton.upenn.edu"
            className="hover:text-white transition-colors duration-300"
          >
            Contact
          </a>
          <a
            href="https://instagram.com/anchor.dating"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
