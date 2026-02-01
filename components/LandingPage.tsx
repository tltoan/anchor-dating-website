"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface LandingPageProps {
  onJoinWaitlist?: (email: string) => void;
}

export default function LandingPage({ onJoinWaitlist }: LandingPageProps) {
  const [email, setEmail] = useState("name@gmail.com");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onJoinWaitlist) {
      onJoinWaitlist(email);
    } else {
      console.log("Joining waitlist with:", email);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Logo, Headline, Form */}
        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div
            className="inline-block bg-gray-100 rounded-xl px-6 py-3 shadow-sm w-fit"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1
              className="font-serif text-2xl md:text-3xl font-normal text-black"
              style={{ backgroundColor: "red" }}
            >
              ANCHOR
            </h1>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            We're Bringing <span className="font-bold underline">dates</span>{" "}
            back to <span className="italic">dating</span>.
          </motion.h2>

          {/* Waitlist Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex gap-0 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
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
        </motion.div>

        {/* Right Side - Phone Mockup */}
        <motion.div
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div
            className="relative rounded-3xl p-6 md:p-8 shadow-2xl"
            style={{
              backgroundColor: "#B3D9FF",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            {/* Phone Frame */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              {/* Status Bar */}
              <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-100">
                <span className="text-xs font-medium text-black">3:20</span>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-gray-400 rounded-sm">
                    <div className="w-3 h-1.5 bg-gray-400 rounded-sm m-0.5"></div>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Phone Content */}
              <div className="p-6 space-y-6 bg-white">
                {/* WHAT Section */}
                <div>
                  <p className="text-xs text-gray-500 font-serif mb-1">WHAT?</p>
                  <p className="text-lg font-serif font-bold text-black">
                    dinner next week.
                  </p>
                </div>

                {/* Dinner Illustration Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl flex items-center justify-center border border-gray-100">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-xs text-gray-400 font-serif">
                      Dinner Table
                    </p>
                  </div>
                </div>

                {/* WHERE and WHEN */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-serif mb-1">
                      WHERE?
                    </p>
                    <p className="text-sm font-serif text-black">Cipriana</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-serif mb-1">
                      WHEN?
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📅</span>
                      <div>
                        <p className="text-sm font-serif text-black">
                          Tue, Dec 30.
                        </p>
                        <p className="text-xs font-serif text-gray-600">
                          3:05 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WHO Section */}
                <div>
                  <p className="text-xs text-gray-500 font-serif mb-3">WHO?</p>
                  {/* Profile Card */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex gap-4 items-start">
                    {/* Profile Image Placeholder */}
                    <div className="w-20 h-20 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👤</span>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-serif font-bold text-white">
                          Antony
                        </h3>
                        <span className="text-xs text-gray-400 font-serif">
                          Anchor Card
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-serif">
                            AGE
                          </span>
                          <span className="text-sm text-white font-serif">
                            20
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-serif">
                            HGT
                          </span>
                          <span className="text-sm text-white font-serif">
                            5'10
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-serif">
                            OCC
                          </span>
                          <span className="text-sm text-white font-serif">
                            Founder
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-serif">
                            LOC
                          </span>
                          <span className="text-sm text-white font-serif">
                            Nueva York, NY
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* "Events" label in top right */}
            <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4">
              <span className="font-serif text-black text-sm md:text-base font-normal">
                Events
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
