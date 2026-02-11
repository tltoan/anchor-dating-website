"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

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
      className="min-h-screen w-full bg-white font-dm-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-8 py-5 max-w-[1200px] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/anchor-header-logo.png"
            alt="Anchor"
            width={64}
            height={64}
            className="rounded-2xl"
            style={{ boxShadow: "7px 10px 6.8px 0px #00000040" }}
          />
        </Link>
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-[#6B6560] hover:text-[#1A1A1A] transition-colors"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </motion.button>
      </nav>

      <div className="max-w-[900px] mx-auto px-6 sm:px-8 pb-20">
        {/* Event Image */}
        {event.image_url ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="w-full h-[240px] sm:h-[360px] rounded-2xl overflow-hidden mb-8"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${event.image_url}')` }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="w-full h-[240px] sm:h-[360px] rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#D4654A] to-[#BF5840] flex items-center justify-center"
          >
            <span className="text-white/20 text-8xl font-playfair">⚓</span>
          </motion.div>
        )}

        {/* Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl p-6 sm:p-10"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          {/* Meta */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-[13px] text-[#6B6560] font-medium">
              <svg className="w-[15px] h-[15px] opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formattedDate} at {formattedTime}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#6B6560] font-medium">
              <svg className="w-[15px] h-[15px] opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#6B6560] font-medium">
              <svg className="w-[15px] h-[15px] opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ${event.price.toFixed(2)}
            </div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-[#1A1A1A] mb-6"
          >
            {event.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-[15px] sm:text-base text-[#6B6560] leading-relaxed mb-8 whitespace-pre-line max-w-[640px]"
          >
            {event.description}
          </motion.p>

          {/* Hosts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2.5 mb-8"
          >
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-[#D4654A] flex items-center justify-center text-[13px] font-semibold text-white border-2 border-white">
                K
              </div>
              <div className="w-8 h-8 rounded-full bg-[#4B9CD3] flex items-center justify-center text-[13px] font-semibold text-white border-2 border-white -ml-2">
                A
              </div>
            </div>
            <span className="text-[13px] text-[#9E9891] font-medium">
              Hosted by Kyle & Antony
            </span>
          </motion.div>

          {/* Admin actions */}
          {canManage && (onEdit || onDelete) && (
            <div className="flex gap-3 mb-6">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-xl border border-[#E8E3DC] bg-[#F3EFE8] px-4 py-2.5 text-sm font-medium text-[#6B6560] hover:bg-[#E8E3DC] hover:text-[#1A1A1A] transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              onClick={onBuyTicket}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-85 transition-all"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Purchase Ticket
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.button>

            <motion.button
              onClick={onSeeHistory}
              className="flex-1 flex items-center justify-center gap-2 bg-[#F3EFE8] text-[#6B6560] px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#E8E3DC] hover:text-[#1A1A1A] transition-all"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              My Tickets
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
