"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface ScrollAnimatedLandingProps {
  onJoinWaitlist?: (email: string) => void;
  startOffset?: number;
  endOffset?: number;
}

export default function ScrollAnimatedLanding({
  onJoinWaitlist,
  startOffset = 0,
  endOffset = 1500,
}: ScrollAnimatedLandingProps) {
  const [email, setEmail] = useState("name@gmail.com");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure component is mounted before accessing window
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.max(
        0,
        Math.min(1, (scrollY - startOffset) / (endOffset - startOffset))
      );
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [startOffset, endOffset, mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onJoinWaitlist) {
      onJoinWaitlist(email);
    } else {
      console.log("Joining waitlist with:", email);
    }
  };

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  const easedProgress = mounted ? easeInOutCubic(scrollProgress) : 0;

  // Left side animations
  const logoOpacity = 1 - easedProgress * 0.3;
  const logoY = easedProgress * -50;
  const headlineOpacity = 1 - easedProgress;
  const headlineY = easedProgress * 30;
  const formOpacity = 1 - easedProgress;
  const formY = easedProgress * 40;

  // New text appears
  const newTextOpacity = easedProgress;
  const newTextY = (1 - easedProgress) * 30;

  // Right side animations
  const phoneScale = 1 - easedProgress * 0.1;
  const phoneY = easedProgress * -20;

  // Phone content transforms
  const phoneContentOpacity = 1 - easedProgress;
  const phoneContentScale = 1 - easedProgress * 0.2;
  const phoneContentBlur = easedProgress * 10; // Blur increases as scroll progresses (0 to 10px)

  // Chat bubble appears
  const chatOpacity = easedProgress;
  const chatY = (1 - easedProgress) * 20;
  const chatScale = 0.8 + easedProgress * 0.2;

  // Tilted image appears
  const imageOpacity = easedProgress;
  const imageRotate = (1 - easedProgress) * 15;
  const imageScale = 0.7 + easedProgress * 0.3;
  const imageX = (1 - easedProgress) * 30;

  // Profile card transforms
  const profileOpacity = 1;
  const profileScale = 1 + easedProgress * 0.2;
  const profileY = 0 - easedProgress * 250;
  const ProfileX = 0;

  // Card locations and
  const cardX = 0 - easedProgress * 500;
  const cardY = 0 - easedProgress * 100;
  const cardScale = 1;
  const cardRotate = 0;
  // const cardScale = 0.7 + easedProgress * 0.3;
  // const cardRotate = (1 - easedProgress) * 15;

  // Bar card locations
  const barCardX = 0 + easedProgress * 280;
  const barCardY = 0 - easedProgress * 200;
  const barCardScale = 1 - easedProgress / 1.6;
  const barCardRotate = 0 + easedProgress * 50;
  return (
    <div ref={containerRef} className="min-h-[200vh] w-full bg-white relative">
      <div className="sticky top-0 min-h-screen w-full flex items-center justify-center p-8 md:p-12 lg:p-16 overflow-hidden">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative">
            <motion.div
              className="inline-block bg-gray-100 rounded-xl px-6 py-3 shadow-sm w-fit mb-8"
              style={{
                opacity: logoOpacity,
                transform: `translateY(${logoY}px)`,
                backgroundColor: "red",
              }}
            >
              <h1 className="font-serif text-2xl md:text-3xl font-normal text-black">
                ANCHOR
              </h1>
            </motion.div>

            <motion.h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-black absolute top-16"
              style={{
                opacity: headlineOpacity,
                transform: `translateY(${headlineY}px)`,
              }}
            >
              We're Bringing <span className="font-bold underline">dates</span>{" "}
              back to <span className="italic">dating</span>.
            </motion.h2>

            <motion.h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black"
              style={{
                opacity: newTextOpacity,
                transform: `translateY(${newTextY}px)`,
                marginTop: "4rem",
              }}
            >
              Because dating apps have a ~2% match-to-date rate
            </motion.h2>

            <motion.form
              onSubmit={handleSubmit}
              className="flex gap-0 w-full max-w-md mt-8 absolute top-64"
              style={{
                opacity: formOpacity,
                transform: `translateY(${formY}px)`,
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="flex-1 bg-blue-100 rounded-l-2xl px-6 py-4 text-white placeholder:text-white/70 font-serif text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{
                  backgroundColor: "#B3D9FF",
                }}
              />
              <button
                type="submit"
                className="bg-black rounded-r-2xl px-6 md:px-8 py-4 text-white font-serif text-base md:text-lg font-normal hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </motion.form>
          </div>

          <div
            className="relative flex justify-center  
            bg-[linear-gradient(180deg,rgba(158,170,190,0.23)_9.13%,rgba(10,92,232,0.23)_100%)]
             shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] 
             "
            style={{
              width: 774,
              height: 800,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "2rem",
            }}
          >
            <div
              style={{
                backgroundImage: "url('/iphone.png')",
                backgroundSize: "stretch",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
                width: "80%",
                height: "92% ",
                marginTop: "8%",
                opacity: phoneContentOpacity,
                filter: `blur(${phoneContentBlur}px)`,
              }}
            ></div>

            <div
              className="absolute bottom-80 left-1/2 -translate-x-1/2 w-[85%]"
              style={{
                opacity: profileOpacity,
                transform: `translateX(${barCardX}px) translateY(${barCardY}px) rotate(${barCardRotate}deg) scale(${barCardScale})`,
                width: "50%",
              }}
            >
              <img src="/bar.png" alt="Profile" className="w-100 h-50" />
            </div>
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%]"
              style={{
                opacity: profileOpacity,
                transform: `translateX(${ProfileX}px) translateY(${profileY}px) rotate(${cardRotate}deg) scale(${profileScale})`,
                width: "50%",
              }}
            >
              <img
                src="/anchor-landing-bg.jpg"
                alt="Profile"
                className="w-100 h-50 rounded-lg"
              />
            </div>
            <div
              className="absolute bottom-140 left-1/2 -translate-x-1/2 w-[85%]"
              style={{
                opacity: profileOpacity,
                transform: `translateX(${cardX}px) translateY(${cardY}px) rotate(${cardRotate}deg) scale(${cardScale})`,
                width: "50%",
              }}
            >
              <div
                className="bg-white rounded-2xl px-6 py-4 shadow-xl z-10 "
                style={{
                  maxWidth: "100%",
                  padding: "1rem",
                }}
              >
                <p className="text-xs text-gray-500 font-serif mb-1">What?</p>
                <p className="text-base font-serif font-bold text-black">
                  Wine tasting next weekend?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
