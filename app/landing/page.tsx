"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { LandingWaitlistInput } from "@/components/LandingFooter";
import Link from "next/link";

// move to env
const appstoreLink =
  "https://apps.apple.com/us/app/anchor-dating-first/id6757112248";

// ─── Reusable components ────────────────────────────────────────

function AppStoreBadge() {
  return (
    <Link href={appstoreLink} className="inline-block" target="_blank">
      <Image
        src="/Download_on_the_App_Store_Badge.png"
        alt="App Store Badge"
        width={200}
        height={200}
      />
    </Link>
  );
}

function TextBubble({ children }: { children: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg px-3 py-1.5 lg:px-4 lg:py-2 whitespace-nowrap min-h-11 flex flex-col justify-center">
      <p className="text-[8px] lg:text-[10px] text-gray-400 leading-tight">
        What?
      </p>
      <p className="text-xs lg:text-sm font-bold text-black">{children}</p>
    </div>
  );
}

function AnchorMascot() {
  return (
    <Image
      src="/anchor-icons/anchor.png"
      alt="Anchor mascot"
      width={200}
      height={200}
      className="w-full h-auto"
    />
  );
}

function PlaceImage({
  src,
  alt,
  className,
  opacity,
  translateX,
}: {
  src: string;
  alt: string;
  className: string;
  opacity: MotionValue;
  translateX: MotionValue;
}) {
  return (
    <motion.div
      className={`absolute z-20 overflow-hidden rounded-xl ${className}`}
      style={{ opacity, x: translateX, aspectRatio: "940/555" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 75vw, 560px"
        className="object-cover"
      />
    </motion.div>
  );
}

function AnimatedIcon({
  src,
  alt,
  className,
  opacity,
  translateX,
  rotate,
}: {
  src: string;
  alt: string;
  className: string;
  opacity: MotionValue;
  translateX: MotionValue;
  rotate?: number;
}) {
  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      style={{ opacity, x: translateX, rotate }}
    >
      <Image
        src={src}
        alt={alt}
        width={300}
        height={300}
        className="w-full h-auto"
      />
    </motion.div>
  );
}

function PortraitImage({
  src,
  alt,
  opacity,
  translateX,
  fit = "object-cover",
}: {
  src: string;
  alt: string;
  opacity: MotionValue;
  translateX: MotionValue;
  fit?: "object-cover" | "object-contain";
}) {
  return (
    <motion.div
      className="absolute z-20 inset-[4%] overflow-hidden rounded-xl"
      style={{ opacity, x: translateX }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 75vw, 560px"
        className={fit}
      />
    </motion.div>
  );
}

// ─── Main page component ────────────────────────────────────────

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Per-screen progress: each goes 0→1 over its ninth of the scroll
  const s1 = useTransform(scrollYProgress, [0, 1 / 9], [0, 1]);
  const s2 = useTransform(scrollYProgress, [1 / 9, 2 / 9], [0, 1]);

  // ===================== SCREEN 1 =====================
  const phoneOpacity = useTransform(s1, [0, 0.4], [1, 0]);
  const badgeOpacity = useTransform(s1, [0.05, 0.3], [1, 0]);
  const inputOpacity = useTransform(s1, [0.3, 0.55], [0, 1]);
  const inputPointerEvents = useTransform(inputOpacity, (v) =>
    v > 0.1 ? "auto" : "none",
  );

  const clubTop = useTransform(s1, [0, 0.7], ["17%", "-17%"]);
  const clubLeft = useTransform(s1, [0, 0.7], ["32%", "-12%"]);
  const clubWidth = useTransform(s1, [0, 0.7], ["36%", "60%"]);

  const museumTop = useTransform(s1, [0, 0.7], ["39%", "25%"]);
  const museumLeft = useTransform(s1, [0, 0.7], ["32%", "7%"]);
  const museumWidth = useTransform(s1, [0, 0.7], ["36%", "87%"]);

  const cafeTop = useTransform(s1, [0, 0.7], ["61%", "84%"]);
  const cafeLeft = useTransform(s1, [0, 0.7], ["32%", "60%"]);
  const cafeWidth = useTransform(s1, [0, 0.7], ["36%", "44%"]);

  // ============ SCREEN 1 → 2 TRANSITION ============
  const screen1ImagesOpacity = useTransform(s2, [0, 0.2], [1, 0]);
  const screen1TranslateX = useTransform(s2, [0, 0.2], ["0%", "-100%"]);

  const text1Opacity = useTransform(s2, [0, 0.2], [1, 0]);
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.128, 0.144, 0.571, 0.602],
    [0, 1, 1, 0],
  );

  const barTranslateX = useTransform(
    s2,
    [0.15, 0.3, 0.75, 0.9],
    ["100%", "0%", "0%", "-100%"],
  );
  const barOpacity = useTransform(s2, [0.15, 0.3, 0.75, 0.9], [0, 1, 1, 0]);

  const heightIconTranslateX = useTransform(
    s2,
    [0.25, 0.45, 0.65, 0.8],
    ["150%", "0%", "0%", "-150%"],
  );
  const heightIconOpacity = useTransform(
    s2,
    [0.25, 0.45, 0.65, 0.8],
    [0, 1, 1, 0],
  );

  // ============ SCREEN 2 → 3 TRANSITION ============
  const theatreTranslateX = useTransform(
    scrollYProgress,
    [0.209, 0.24, 0.255, 0.278],
    ["100%", "0%", "0%", "-100%"],
  );
  const theatreOpacity = useTransform(
    scrollYProgress,
    [0.209, 0.24, 0.255, 0.278],
    [0, 1, 1, 0],
  );

  const notifIconTranslateX = useTransform(
    scrollYProgress,
    [0.209, 0.24, 0.255, 0.278],
    ["-150%", "0%", "0%", "-150%"],
  );
  const notifIconOpacity = useTransform(
    scrollYProgress,
    [0.209, 0.24, 0.255, 0.278],
    [0, 1, 1, 0],
  );

  // ============ SCREEN 3 → 4 TRANSITION ============
  const brunchTranslateX = useTransform(
    scrollYProgress,
    [0.272, 0.306, 0.411, 0.433],
    ["100%", "0%", "0%", "-100%"],
  );
  const brunchOpacity = useTransform(
    scrollYProgress,
    [0.272, 0.306, 0.411, 0.433],
    [0, 1, 1, 0],
  );

  const notifIcon4TranslateX = useTransform(
    scrollYProgress,
    [0.272, 0.306, 0.411, 0.433],
    ["-150%", "0%", "0%", "-150%"],
  );
  const notifIcon4Opacity = useTransform(
    scrollYProgress,
    [0.272, 0.306, 0.411, 0.433],
    [0, 1, 1, 0],
  );

  // Left text: "Post" → "Find" → "Match" transitions
  const postOpacity = useTransform(scrollYProgress, [0.272, 0.306], [1, 0]);
  const postY = useTransform(scrollYProgress, [0.272, 0.306], [0, -30]);
  const findOpacity = useTransform(
    scrollYProgress,
    [0.272, 0.306, 0.515, 0.556],
    [0, 1, 1, 0],
  );
  const findY = useTransform(
    scrollYProgress,
    [0.272, 0.306, 0.515, 0.556],
    [30, 0, 0, -30],
  );
  const matchOpacity = useTransform(scrollYProgress, [0.515, 0.556], [0, 1]);
  const matchY = useTransform(scrollYProgress, [0.515, 0.556], [30, 0]);
  const wordContainerMargin = useTransform(
    scrollYProgress,
    [0.515, 0.556],
    [0, 28],
  );

  // ============ ANCHOR (spans S1–S4) ============
  const anchorBottom = useTransform(
    scrollYProgress,
    [0, 0.075, 0.124, 0.166, 0.194, 0.213, 0.218, 0.273, 0.28, 0.408],
    ["7%", "-14%", "-14%", "-5%", "-5%", "-5%", "40%", "40%", "40%", "85%"],
  );
  const anchorLeft = useTransform(
    scrollYProgress,
    [0, 0.075, 0.124, 0.166, 0.194, 0.213, 0.218, 0.408],
    ["29%", "-8%", "-8%", "38%", "38%", "55%", "75%", "75%"],
  );
  const anchorWidth = useTransform(
    scrollYProgress,
    [0, 0.075, 0.124, 0.166, 0.194, 0.213, 0.218, 0.408],
    ["18%", "40%", "40%", "28%", "28%", "28%", "25%", "25%"],
  );
  const anchorRotate = useTransform(scrollYProgress, [0.213, 0.218], [0, -90]);
  const outerGroupTransitionOpacity = useTransform(
    scrollYProgress,
    [0.194, 0.213, 0.222, 0.24, 0.4, 0.422],
    [1, 0, 0, 1, 1, 0],
  );
  const innerAnchorOpacity = useTransform(
    scrollYProgress,
    [0.156, 0.166],
    [1, 0],
  );
  const outerAnchorOpacity = useTransform(
    scrollYProgress,
    [0.156, 0.166],
    [0, 1],
  );
  const textBoxOpacity = useTransform(s2, [0.1, 0.2], [0, 1]);

  // Text content crossfade (S2→S3→S4)
  const textContent2Opacity = useTransform(
    scrollYProgress,
    [0.16, 0.173, 0.2, 0.222],
    [0, 1, 1, 0],
  );
  const textContent3Opacity = useTransform(
    scrollYProgress,
    [0.218, 0.24, 0.255, 0.278],
    [0, 1, 1, 0],
  );
  const textContent4Opacity = useTransform(
    scrollYProgress,
    [0.295, 0.317, 0.411, 0.433],
    [0, 1, 1, 0],
  );

  // ============ SCREEN 4 → 5 TRANSITION ============
  const cafeS5TranslateX = useTransform(
    scrollYProgress,
    [0.428, 0.461, 0.496, 0.522],
    ["100%", "0%", "0%", "-100%"],
  );
  const cafeS5Opacity = useTransform(
    scrollYProgress,
    [0.428, 0.461, 0.496, 0.522],
    [0, 1, 1, 0],
  );
  const heightIcon5Opacity = useTransform(
    scrollYProgress,
    [0.428, 0.461, 0.496, 0.522],
    [0, 1, 1, 0],
  );
  const heightIcon5TranslateX = useTransform(
    scrollYProgress,
    [0.428, 0.461, 0.496, 0.522],
    ["-150%", "0%", "0%", "-150%"],
  );
  const s5AnchorOpacity = useTransform(
    scrollYProgress,
    [0.433, 0.467, 0.482, 0.509],
    [0, 1, 1, 0],
  );

  // ============ SCREEN 5 → 6 TRANSITION ============
  const jazzTranslateX = useTransform(
    scrollYProgress,
    [0.515, 0.556, 0.571, 0.602],
    ["100%", "0%", "0%", "-100%"],
  );
  const jazzOpacity = useTransform(
    scrollYProgress,
    [0.515, 0.556, 0.571, 0.602],
    [0, 1, 1, 0],
  );
  const notifIcon6TranslateX = useTransform(
    scrollYProgress,
    [0.515, 0.556, 0.571, 0.602],
    ["150%", "0%", "0%", "-150%"],
  );
  const notifIcon6Opacity = useTransform(
    scrollYProgress,
    [0.515, 0.556, 0.571, 0.602],
    [0, 1, 1, 0],
  );
  const s6AnchorOpacity = useTransform(
    scrollYProgress,
    [0.522, 0.556, 0.571, 0.602],
    [0, 1, 1, 0],
  );

  // ============ SCREEN 6 → 7 TRANSITION ============
  const antonyS7TranslateX = useTransform(
    scrollYProgress,
    [0.594, 0.641, 0.683, 0.723],
    ["100%", "0%", "0%", "-100%"],
  );
  const antonyS7Opacity = useTransform(
    scrollYProgress,
    [0.594, 0.641, 0.683, 0.723],
    [0, 1, 1, 0],
  );
  const text7Opacity = useTransform(scrollYProgress, [0.594, 0.641], [0, 1]);
  const text7TranslateX = useTransform(
    scrollYProgress,
    [0.594, 0.641],
    [-50, 0],
  );

  // ============ SCREEN 7 → 8 TRANSITION ============
  const antonyS8TranslateX = useTransform(
    scrollYProgress,
    [0.713, 0.773, 0.793, 0.833],
    ["100%", "0%", "0%", "-100%"],
  );
  const antonyS8Opacity = useTransform(
    scrollYProgress,
    [0.713, 0.773, 0.793, 0.833],
    [0, 1, 1, 0],
  );
  const text8Opacity = useTransform(scrollYProgress, [0.713, 0.773], [0, 1]);
  const text8TranslateX = useTransform(
    scrollYProgress,
    [0.713, 0.773],
    [-50, 0],
  );

  // ============ SCREEN 8 → 9 TRANSITION ============
  const antonyS9TranslateX = useTransform(
    scrollYProgress,
    [0.823, 0.89],
    ["100%", "0%"],
  );
  const antonyS9Opacity = useTransform(scrollYProgress, [0.823, 0.89], [0, 1]);
  const text9Opacity = useTransform(scrollYProgress, [0.823, 0.89], [0, 1]);
  const text9TranslateX = useTransform(
    scrollYProgress,
    [0.823, 0.89],
    [-50, 0],
  );

  return (
    <div ref={containerRef} className="relative" style={{ height: "1620vh" }}>
      <div className="sticky top-0 w-full h-screen pt-20 lg:pt-12 px-6 lg:px-14 flex items-center">
        <div className="flex flex-col-reverse lg:flex-row w-full max-w-350 mx-auto gap-6 lg:gap-0 items-center">
          {/* ===== LEFT SECTION ===== */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pr-16">
            <div className="relative">
              {/* Screen 1 text */}
              <motion.div style={{ opacity: text1Opacity }}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.25rem] leading-[1.15] font-bold text-black">
                  Match on the <em className="italic">experience</em>,
                  <br />
                  not just a face.
                </h1>
                <div className="mt-6 lg:mt-8 relative h-14">
                  <motion.div
                    className="absolute top-0 left-0"
                    style={{ opacity: badgeOpacity }}
                  >
                    <AppStoreBadge />
                  </motion.div>
                  <motion.div
                    className="absolute top-0 left-0 w-full max-w-md"
                    style={{
                      opacity: inputOpacity,
                      pointerEvents: inputPointerEvents,
                    }}
                  >
                    <LandingWaitlistInput />
                  </motion.div>
                </div>
              </motion.div>

              {/* Screen 2-6 text — "Post" swaps to "Find" then "Match" */}
              <motion.div
                className="absolute top-0 left-0"
                style={{ opacity: text2Opacity }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.25rem] leading-[1.15] font-bold text-black">
                  <motion.span
                    className="relative inline-block"
                    style={{ marginRight: wordContainerMargin }}
                  >
                    <motion.span
                      className="inline-block"
                      style={{ y: postY, opacity: postOpacity }}
                    >
                      Post
                    </motion.span>
                    <motion.span
                      className="absolute left-0 top-0 inline-block"
                      style={{ y: findY, opacity: findOpacity }}
                    >
                      Find
                    </motion.span>
                    <motion.span
                      className="absolute left-0 top-0 inline-block"
                      style={{ y: matchY, opacity: matchOpacity }}
                    >
                      Match
                    </motion.span>
                  </motion.span>{" "}
                  your <em className="italic">perfect</em> date.
                </h1>
              </motion.div>

              {/* Screen 7-9 text — lines build up one by one */}
              <div className="absolute top-0 left-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.25rem] leading-[1.15] font-bold text-black">
                  <motion.span
                    className="block"
                    style={{ opacity: text7Opacity, x: text7TranslateX }}
                  >
                    Real people.
                  </motion.span>
                  <motion.span
                    className="block"
                    style={{ opacity: text8Opacity, x: text8TranslateX }}
                  >
                    Real dates.
                  </motion.span>
                  <motion.span
                    className="block"
                    style={{ opacity: text9Opacity, x: text9TranslateX }}
                  >
                    Real soon.
                  </motion.span>
                </h1>
              </div>
            </div>
          </div>

          {/* ===== RIGHT SECTION (Gradient box) ===== */}
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
            <div className="relative w-[75vw] max-w-70 sm:max-w-90 lg:w-full lg:max-w-140 aspect-square">
              {/* Outer gradient border */}
              <div
                className="w-full h-full rounded-3xl p-1.5 overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(200,210,230,0.4), rgba(190,205,230,0.3))",
                }}
              >
                {/* Inner gradient fill */}
                <div
                  className="relative w-full h-full rounded-[20px] overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(230,235,245,0.6), rgba(195,210,235,0.5))",
                  }}
                >
                  {/* Phone mockup (Screen 1) */}
                  <motion.div
                    className="absolute top-[8%] left-[29%] w-[42%] h-[84%] z-10"
                    style={{ opacity: phoneOpacity }}
                  >
                    <Image
                      src="/iphone.png"
                      alt="iPhone mockup"
                      fill
                      sizes="(max-width: 1024px) 30vw, 235px"
                      className="object-contain"
                    />
                  </motion.div>

                  {/* Screen 1 images (page-turn left on exit) */}
                  <motion.div
                    className="absolute inset-0 z-20"
                    style={{
                      opacity: screen1ImagesOpacity,
                      x: screen1TranslateX,
                    }}
                  >
                    <motion.div
                      className="absolute overflow-hidden rounded-xl"
                      style={{
                        top: clubTop,
                        left: clubLeft,
                        width: clubWidth,
                        aspectRatio: "940/555",
                      }}
                    >
                      <Image
                        src="/places-pics/Club Image 940x555.png"
                        alt="Club"
                        fill
                        sizes="(max-width: 1024px) 75vw, 560px"
                        className="object-cover"
                      />
                    </motion.div>
                    <motion.div
                      className="absolute overflow-hidden rounded-xl"
                      style={{
                        top: museumTop,
                        left: museumLeft,
                        width: museumWidth,
                        aspectRatio: "940/555",
                      }}
                    >
                      <Image
                        src="/places-pics/Museum 940x555.png"
                        alt="Museum"
                        fill
                        sizes="(max-width: 1024px) 75vw, 560px"
                        className="object-cover"
                      />
                    </motion.div>
                    <motion.div
                      className="absolute overflow-hidden rounded-xl"
                      style={{
                        top: cafeTop,
                        left: cafeLeft,
                        width: cafeWidth,
                        aspectRatio: "940/555",
                      }}
                    >
                      <Image
                        src="/places-pics/Cafe 940x555.png"
                        alt="Cafe"
                        fill
                        sizes="(max-width: 1024px) 75vw, 560px"
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Screen 2: Bar + height icon */}
                  <PlaceImage
                    src="/bar.png"
                    alt="Bar"
                    className="top-[25%] left-[10%] w-[80%]"
                    opacity={barOpacity}
                    translateX={barTranslateX}
                  />
                  <AnimatedIcon
                    src="/anchor-icons/height_verification.png"
                    alt="Height verification"
                    className="top-[-3%] right-[5%] w-[30%]"
                    opacity={heightIconOpacity}
                    translateX={heightIconTranslateX}
                  />

                  {/* Screen 3: Theatre + notification icon */}
                  <PlaceImage
                    src="/places-pics/Theatre 940x555.png"
                    alt="Theatre"
                    className="top-[5%] left-[8%] w-[85%]"
                    opacity={theatreOpacity}
                    translateX={theatreTranslateX}
                  />
                  <AnimatedIcon
                    src="/anchor-icons/notification.png"
                    alt="Notification"
                    className="bottom-[0%] left-[5%] w-[30%]"
                    opacity={notifIconOpacity}
                    translateX={notifIconTranslateX}
                  />

                  {/* Screen 4: Brunch + notification icon */}
                  <PlaceImage
                    src="/places-pics/Brunch Breakfast.png"
                    alt="Brunch"
                    className="top-[45%] left-[10%] w-[80%]"
                    opacity={brunchOpacity}
                    translateX={brunchTranslateX}
                  />
                  <AnimatedIcon
                    src="/anchor-icons/notification.png"
                    alt="Notification"
                    className="top-[2%] left-[5%] w-[25%]"
                    opacity={notifIcon4Opacity}
                    translateX={notifIcon4TranslateX}
                    rotate={-15}
                  />

                  {/* Screen 5: Cafe + height icon */}
                  <PlaceImage
                    src="/places-pics/Cafe 940x555.png"
                    alt="Cafe"
                    className="top-[25%] left-[10%] w-[80%]"
                    opacity={cafeS5Opacity}
                    translateX={cafeS5TranslateX}
                  />
                  <AnimatedIcon
                    src="/anchor-icons/height_verification.png"
                    alt="Height verification"
                    className="bottom-[8%] left-[1%] w-[30%]"
                    opacity={heightIcon5Opacity}
                    translateX={heightIcon5TranslateX}
                  />

                  {/* Screen 6: Jazz + notification icon */}
                  <PlaceImage
                    src="/places-pics/Jazz Music.png"
                    alt="Jazz"
                    className="top-[40%] left-[8%] w-[85%]"
                    opacity={jazzOpacity}
                    translateX={jazzTranslateX}
                  />
                  <AnimatedIcon
                    src="/anchor-icons/notification.png"
                    alt="Notification"
                    className="top-[2%] right-[5%] w-[25%]"
                    opacity={notifIcon6Opacity}
                    translateX={notifIcon6TranslateX}
                    rotate={15}
                  />

                  {/* Screen 7: Antony couch */}
                  <PortraitImage
                    src="/antony_photos/antony-couch-suited.jpeg"
                    alt="Antony"
                    opacity={antonyS7Opacity}
                    translateX={antonyS7TranslateX}
                  />

                  {/* Screen 8: Antony skyline */}
                  <PortraitImage
                    src="/antony_photos/antony-drink-on-city-skyline.jpeg"
                    alt="Antony on city skyline"
                    opacity={antonyS8Opacity}
                    translateX={antonyS8TranslateX}
                  />

                  {/* Screen 9: Antony anchor card */}
                  <PortraitImage
                    src="/antony-anchor-card.png"
                    alt="Antony's Anchor Card"
                    opacity={antonyS9Opacity}
                    translateX={antonyS9TranslateX}
                    fit="object-contain"
                  />

                  {/* Inner anchor — clipped by overflow-hidden, visible during Screens 1-2 */}
                  <motion.div
                    className="absolute z-30"
                    style={{
                      bottom: anchorBottom,
                      left: anchorLeft,
                      width: anchorWidth,
                      opacity: innerAnchorOpacity,
                    }}
                  >
                    <AnchorMascot />
                  </motion.div>
                </div>
              </div>

              {/* Outer anchor + Text Box group — fades out/in during S2→S3 transition */}
              <motion.div
                className="absolute z-30"
                style={{
                  bottom: anchorBottom,
                  left: anchorLeft,
                  width: anchorWidth,
                  opacity: outerGroupTransitionOpacity,
                  rotate: anchorRotate,
                  transformOrigin: "100% 100%",
                }}
              >
                <motion.div style={{ opacity: outerAnchorOpacity }}>
                  <AnchorMascot />
                </motion.div>
                {/* Text box — below anchor */}
                <motion.div
                  className="absolute top-full left-0 w-full"
                  style={{ opacity: textBoxOpacity }}
                >
                  <div className="flex justify-center -mt-8 lg:-mt-10">
                    <div className="relative bg-white rounded-xl shadow-lg px-3 py-1.5 lg:px-4 lg:py-2 whitespace-nowrap min-h-11 min-w-40 lg:min-w-60 flex flex-col justify-center">
                      <motion.div style={{ opacity: textContent2Opacity }}>
                        <p className="text-[8px] lg:text-[10px] text-gray-400 leading-tight">
                          What?
                        </p>
                        <p className="text-xs lg:text-sm font-bold text-black">
                          Drinks after sunset?
                        </p>
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 px-3 py-1.5 lg:px-4 lg:py-2 flex flex-col justify-center"
                        style={{ opacity: textContent3Opacity }}
                      >
                        <p className="text-[8px] lg:text-[10px] text-gray-400 leading-tight">
                          What?
                        </p>
                        <p className="text-xs lg:text-sm font-bold text-black">
                          Late-night theatre scenes
                        </p>
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 px-3 py-1.5 lg:px-4 lg:py-2 flex flex-col justify-center"
                        style={{ opacity: textContent4Opacity }}
                      >
                        <p className="text-[8px] lg:text-[10px] text-gray-400 leading-tight">
                          What?
                        </p>
                        <p className="text-xs lg:text-sm font-bold text-black">
                          Brunch after a hike?
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* S5 anchor group — text box at top edge, upside-down anchor below */}
              <motion.div
                className="absolute z-30"
                style={{
                  top: "0%",
                  left: "40%",
                  width: "25%",
                  opacity: s5AnchorOpacity,
                }}
              >
                <div className="relative z-10 w-full">
                  <div className="flex justify-center">
                    <TextBubble>Coffee first, everything else later</TextBubble>
                  </div>
                </div>
                <div
                  className="relative z-0 -mt-5 lg:-mt-10 flex justify-center"
                  style={{ transform: "rotate(180deg)" }}
                >
                  <AnchorMascot />
                </div>
              </motion.div>

              {/* S6 anchor — left edge, rotated 90deg CW */}
              <motion.div
                className="absolute z-30 top-[8%] left-[0%] lg:left-[-4%] w-[32%] lg:w-[22%]"
                style={{ opacity: s6AnchorOpacity, rotate: 90 }}
              >
                <AnchorMascot />
              </motion.div>

              {/* S6 text box — left edge, below anchor, rotated 90deg CW */}
              <motion.div
                className="absolute z-30 top-[20%] lg:top-[16%] left-[-20%] lg:left-[-16%]"
                style={{ opacity: s6AnchorOpacity, rotate: 90 }}
              >
                <TextBubble>Jazz plans loading…</TextBubble>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
