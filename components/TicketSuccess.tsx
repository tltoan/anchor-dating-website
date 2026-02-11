"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";

interface TicketSuccessProps {
  userId: string;
  paymentIntentId: string;
  onWalletAdded: () => void;
  onBack?: () => void;
  /** When set, only tickets for this event are shown (e.g. after buying for one event). */
  eventId?: string;
}

interface Ticket {
  id: string;
  user_id: string;
  payment_intent_id: string;
  created_at: string;
}

export default function TicketSuccess({
  userId,
  paymentIntentId,
  onWalletAdded,
  onBack,
  eventId,
}: TicketSuccessProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const generateQRData = useCallback((ticketPaymentIntentId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/admin/scan/${ticketPaymentIntentId}`;
  }, []);

  useEffect(() => {
    const qrString = generateQRData(paymentIntentId);
    setQrData(qrString);
    setSelectedTicketId(paymentIntentId);

    const fetchTickets = async () => {
      try {
        if (eventId) {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          const response = await fetch("/api/get-events-tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              event_id: eventId,
              access_token: session?.access_token ?? undefined,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            setTickets(data.tickets || []);
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to fetch tickets:", errorData.error || "Unknown error");
          }
        } else {
          const response = await fetch("/api/get-user-tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
          });
          if (response.ok) {
            const data = await response.json();
            setTickets(data.tickets || []);
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to fetch tickets:", errorData.error || "Unknown error");
          }
        }
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    fetch("/api/send-ticket-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        qrData: qrString,
      }),
    }).catch((error) => {
      console.error("Failed to send email:", error);
    });
  }, [paymentIntentId, userId, eventId, generateQRData]);

  const handleStoreClick = (store: "appstore" | "playstore") => {
    const appStoreUrl =
      process.env.NEXT_PUBLIC_APP_STORE_URL ||
      "https://apps.apple.com/app/anchor";
    const playStoreUrl =
      process.env.NEXT_PUBLIC_PLAY_STORE_URL ||
      "https://play.google.com/store/apps/details?id=com.anchor.app";

    if (store === "appstore") {
      window.open(appStoreUrl, "_blank");
    } else {
      window.open(playStoreUrl, "_blank");
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    const ticketQrData = generateQRData(ticket.payment_intent_id);
    setQrData(ticketQrData);
    setSelectedTicketId(ticket.payment_intent_id);
  };

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
      </nav>

      <div className="flex min-h-[calc(100vh-80px)] items-start justify-center px-6 pt-8 pb-20">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          {onBack && (
            <motion.button
              onClick={onBack}
              className="mb-8 flex items-center gap-2 text-sm font-medium text-[#6B6560] hover:text-[#1A1A1A] transition-colors"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </motion.button>
          )}

          {/* Success Card */}
          <motion.div
            className="bg-white rounded-2xl p-6 sm:p-8"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
            }}
          >
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 text-center"
            >
              {/* Checkmark icon */}
              <motion.div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4654A]/10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
              >
                <svg className="h-7 w-7 text-[#D4654A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-2">
                Your Ticket is Ready!
              </h2>
              <p className="text-[#9E9891] text-sm font-medium">
                Your ticket has been sent to your registered email
              </p>
            </motion.div>

            {/* QR Code */}
            {qrData && (
              <motion.div
                key={selectedTicketId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-8 flex flex-col items-center"
              >
                {tickets.length > 1 && (
                  <p className="mb-4 text-sm text-[#9E9891]">
                    Click on a ticket below to view its QR code
                  </p>
                )}
                <div
                  className="rounded-2xl border border-[#E8E3DC] bg-white p-5"
                  style={{
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <QRCodeSVG
                    value={qrData}
                    size={220}
                    level="H"
                    includeMargin={false}
                    fgColor="#1A1A1A"
                    bgColor="#ffffff"
                  />
                </div>
              </motion.div>
            )}

            {/* Ticket List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <p className="text-center font-playfair text-xl font-semibold text-[#1A1A1A] mb-4">
                Your Tickets
              </p>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8E3DC] border-t-[#D4654A]"></div>
                </div>
              ) : tickets.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {tickets.map((ticket, index) => {
                    const isSelected = selectedTicketId === ticket.payment_intent_id;
                    return (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        onClick={() => handleTicketClick(ticket)}
                        className={`rounded-xl border p-4 cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#D4654A] bg-[#D4654A]/5"
                            : "border-[#E8E3DC] bg-[#F3EFE8]/50 hover:border-[#D4654A]/40 hover:bg-[#F3EFE8]"
                        }`}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#1A1A1A] text-sm">
                              Ticket #{ticket.payment_intent_id.slice(-8)}
                            </p>
                            <p className="text-xs text-[#9E9891] mt-1">
                              Purchased:{" "}
                              {ticket.created_at
                                ? new Date(ticket.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Date not available"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-5 w-5 text-[#D4654A]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-[#9E9891] py-4">
                  No tickets found
                </p>
              )}
            </motion.div>

            {/* Download App */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-center font-playfair text-xl font-semibold text-[#1A1A1A] mb-4">
                Download the App
              </p>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => handleStoreClick("appstore")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E8E3DC] bg-[#F3EFE8] px-4 py-3.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-[#E8E3DC]"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  App Store
                </motion.button>
                <motion.button
                  onClick={() => handleStoreClick("playstore")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E8E3DC] bg-[#F3EFE8] px-4 py-3.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-[#E8E3DC]"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Play Store
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
