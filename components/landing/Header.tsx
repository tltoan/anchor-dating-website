"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, EASE } from "@/lib/gsap";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: EASE.sectionReveal, delay: 0.1 }
    );
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 lg:px-20 py-6 opacity-0"
    >
      <Link
        href="/"
        className="flex items-center justify-center bg-white rounded-[15px] w-[60px] h-[60px] shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <span className="font-playfair font-bold italic text-[15px] text-black leading-none">
          Anchor
        </span>
      </Link>

      <Link
        href="https://drop.anchor.dating"
        className="font-playfair font-bold italic text-[20px] text-white hover:text-[#ff96d1] transition-colors duration-300"
      >
        The Drop
      </Link>
    </header>
  );
}
