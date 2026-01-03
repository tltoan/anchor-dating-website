"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

interface TicketSuccessProps {
  userId: string;
  paymentIntentId: string;
  onWalletAdded: () => void;
  onBack?: () => void;
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
}: TicketSuccessProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    // Generate unique QR code data (payment intent ID + email for verification)
    const qrString = JSON.stringify({
      id: paymentIntentId,
      email: userId,
      timestamp: Date.now(),
    });
    setQrData(qrString);

    // Fetch user tickets
    const fetchTickets = async () => {
      try {
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
          console.error(
            "Failed to fetch tickets:",
            errorData.error || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    // Send ticket email
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
  }, [paymentIntentId, userId]);

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

  return (
    <motion.div
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/anchor-landing-bg.jpg')",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Romantic floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          {/* Back Button */}
          {onBack && (
            <motion.button
              onClick={onBack}
              className="mb-8 group flex items-center gap-2 text-white/80 transition-all hover:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:-translate-x-1"
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
              <span className="font-serif">Back</span>
            </motion.button>
          )}

          {/* Success Card */}
          <motion.div
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              padding: "2rem",
              boxShadow:
                "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
            }}
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ marginBottom: "2rem" }}
              >
                <h2 className="mb-2 font-serif text-5xl md:text-6xl text-white font-light">
                  Your Ticket is Ready!
                </h2>
                <p className="text-white/60 font-serif text-base md:text-lg font-light">
                  Your ticket has been sent to your registered email
                </p>
              </motion.div>

              {/* QR Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mb-8 flex justify-center"
              >
                <div
                  className="rounded-2xl border-2 border-white/20 bg-black/10 p-6 backdrop-blur-sm"
                  style={{
                    boxShadow:
                      "0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    padding: "16px",
                    marginBottom: "1rem",
                  }}
                >
                  {qrData && (
                    <QRCodeSVG
                      value={qrData}
                      size={220}
                      level="H"
                      includeMargin={false}
                      fgColor="#ffffff"
                      bgColor="transparent"
                    />
                  )}
                </div>
              </motion.div>

              {/* Ticket List */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{ marginBottom: "2rem" }}
              >
                <p
                  className="text-center font-serif text-xl text-white/90 font-light"
                  style={{ marginBottom: "1.5rem" }}
                >
                  Your Tickets
                </p>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
                  </div>
                ) : tickets.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {tickets.map((ticket, index) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm"
                        style={{
                          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                          padding: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          className="flex items-center justify-between"
                          style={{}}
                        >
                          <div>
                            <p className="font-serif text-white font-light">
                              Ticket #{ticket.payment_intent_id.slice(-8)}
                            </p>
                            <p className="font-serif text-sm text-white/60 font-light">
                              Purchased:{" "}
                              {ticket.created_at
                                ? new Date(
                                    ticket.created_at
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Date not available"}
                            </p>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-green-400"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center font-serif text-white/60 font-light py-4">
                    No tickets found
                  </p>
                )}
              </motion.div>

              {/* Store Buttons */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p
                  className="text-center font-serif text-xl text-white/90 font-light"
                  style={{ marginBottom: "1rem" }}
                >
                  Download the App
                </p>

                <div className="flex gap-4">
                  <motion.button
                    onClick={() => handleStoreClick("appstore")}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-serif text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      padding: "1rem",
                    }}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-.96-1.23 0-2.08.5-3.08.96-1.05.5-2.22.95-3.57.4-1.35-.5-2.22-1.78-3.08-3.08C.5 15.5 0 13.5 0 11.5c0-2 .5-4 1.5-5.5 1-1.5 2.5-2.5 4.5-3.5 1.5-.8 3.2-1.2 5-1.2 1.3 0 2.5.3 3.5.8 1 .5 2 .8 3 .8s2-.3 3-.8c1-.5 2.2-.8 3.5-.8 1.8 0 3.5.4 5 1.2 2 1 3.5 2 4.5 3.5 1 1.5 1.5 3.5 1.5 5.5 0 2-.5 4-1.5 5.5-1 1.5-2.5 2.5-4.5 3.5-1.5.8-3.2 1.2-5 1.2-1.3 0-2.5-.3-3.5-.8-1-.5-2-.8-3-.8s-2 .3-3 .8z" />
                    </svg>
                    App Store
                  </motion.button>
                  <motion.button
                    onClick={() => handleStoreClick("playstore")}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-serif text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      padding: "1rem",
                    }}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    Play Store
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
