"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <motion.div
      className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/anchor-landing-bg.jpg')",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      <div
        className="relative z-10 flex min-h-screen flex-col justify-between"
        style={{
          padding: "clamp(2rem, 5vw, 3rem) clamp(2rem, 8vw, 12rem)",
        }}
      >
        {/* Logo and Tagline */}
        <motion.div
          className="mt-4 sm:mt-8 md:mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="font-serif text-7xl font-normal leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] md:text-9xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ textShadow: "0 4px 20px rgba(0, 0, 0, 0.6)" }}
          >
            Anchor
          </motion.h1>
          <motion.p
            className="mt-4 font-serif text-3xl italic leading-tight text-white underline underline-offset-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:mt-6 md:text-4xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)" }}
          >
            dates, guaranteed
          </motion.p>
        </motion.div>

        {/* Footer with CTA and Links */}
        <motion.footer
          className="mb-8 flex flex-col gap-8 sm:mb-12 md:mb-20 md:flex-row md:items-center md:justify-between lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="w-full md:w-auto p-200">
            <motion.button
              onClick={onGetStarted}
              className="group relative w-full overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-white/20 via-white/15 to-white/10 px-10 py-5 font-serif text-xl font-semibold text-white backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/50 hover:from-white/30 hover:via-white/25 hover:to-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] md:w-auto md:px-12 md:py-6"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className="relative z-10 flex items-center justify-center gap-2  rounded-full  "
                style={{ padding: "10px" }}
              >
                Get Started
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-shimmer" />
            </motion.button>
          </div>

          <nav className="flex gap-10">
            <Link
              href="/privacy"
              className="font-serif text-xl font-bold text-white transition-all hover:opacity-90 hover:underline"
              style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)" }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-serif text-xl font-bold text-white transition-all hover:opacity-90 hover:underline"
              style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)" }}
            >
              Terms
            </Link>
          </nav>
        </motion.footer>
      </div>
    </motion.div>
  );
}
