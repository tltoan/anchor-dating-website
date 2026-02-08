"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  price: number;
  created_at?: string;
  created_by?: string | null;
}

interface EventDetailProps {
  event: Event;
  onBuyTicket: () => void;
  onSeeHistory: () => void;
  onBack: () => void;
  isAdmin?: boolean;
  userId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EventDetail({
  event,
  onBuyTicket,
  onSeeHistory,
  onBack,
  isAdmin,
  userId,
  onEdit,
  onDelete,
}: EventDetailProps) {
  const canManage = Boolean(isAdmin && userId && event.created_by === userId);
  let formattedDate = "";
  let formattedTime = "";

  try {
    const eventDate = new Date(event.date);
    if (!isNaN(eventDate.getTime())) {
      formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
      formattedTime = format(eventDate, "h:mm a");
    } else {
      formattedDate = new Date(event.date).toLocaleDateString();
      formattedTime = new Date(event.date).toLocaleTimeString();
    }
  } catch {
    formattedDate = new Date(event.date).toLocaleDateString();
    formattedTime = new Date(event.date).toLocaleTimeString();
  }

  return (
    <motion.div
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: event.image_url
          ? `url('${event.image_url}')`
          : "url('/anchor-landing-bg.jpg')",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />

      <div className="relative z-10 min-h-screen p-6 flex flex-col">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </motion.button>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <motion.div
              className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl p-4 md:p-5 lg:p-10 xl:p-10"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              style={{
                boxShadow:
                  "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                background:
                  "linear-gradient(135deg, rgba(213, 15, 15, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
              }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/5 via-transparent to-blue-500/5 pointer-events-none" />

              <div
                className="relative z-10 px-2 md:px-4"
                style={{ padding: "20px" }}
              >
                {/* Event Title */}
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-10 md:mb-12 font-serif text-5xl md:text-7xl text-white font-light"
                >
                  {event.title}
                </motion.h1>

                {/* Event Details */}
                <div className="mb-10 md:mb-12 space-y-5 md:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center gap-4 text-white/80"
                  >
                    <svg
                      className="h-6 w-6 md:h-7 md:w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-serif text-lg md:text-xl">
                      {formattedDate} at {formattedTime}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex items-center gap-4 text-white/80"
                  >
                    <svg
                      className="h-6 w-6 md:h-7 md:w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-serif text-lg md:text-xl">
                      {event.location}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex items-center gap-4 text-white/80"
                  >
                    <svg
                      className="h-6 w-6 md:h-7 md:w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-serif text-lg md:text-xl">
                      ${event.price.toFixed(2)}
                    </span>
                  </motion.div>
                </div>

                {/* Event Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-10 md:mb-12"
                >
                  <p className="text-white/70 font-serif text-lg md:text-xl font-light leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </motion.div>

                {/* Admin actions */}
                {canManage && (onEdit || onDelete) && (
                  <div className="flex gap-3 mb-6">
                    {onEdit && (
                      <motion.button
                        type="button"
                        onClick={onEdit}
                        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-serif text-white hover:bg-white/20"
                      >
                        Edit
                      </motion.button>
                    )}
                    {onDelete && (
                      <motion.button
                        type="button"
                        onClick={onDelete}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 font-serif text-red-200 hover:bg-red-500/20"
                      >
                        Delete
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 md:gap-6">
                  <motion.button
                    onClick={onBuyTicket}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="group relative flex-1 flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-3 py-3 md:px-3 md:py-3 font-serif text-xl font-normal text-white backdrop-blur-xl transition-all hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      boxShadow:
                        "0 10px 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Purchase Ticket
                      <motion.svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </motion.svg>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.button>

                  <motion.button
                    onClick={onSeeHistory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="group relative flex-1 flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/20 bg-white/10  font-serif text-xl font-normal text-white backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/20"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Tickets
                      <motion.svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </motion.svg>
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
