"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import PhoneOTPForm from "./PhoneOTPForm";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { createClient } from "@/lib/supabase/client";

export interface EventsTicket {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  payment_intent_id: string;
  ticket_purchased_at?: string;
  created_at: string;
}

interface EventsProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userName: string;
  userId: string;
  onLoginSuccess: (identifier: string, id: string, name?: string, isAdmin?: boolean, authUserId?: string) => void;
  onLogout: () => void;
}

export default function EventsProfileModal({
  isOpen,
  onClose,
  isLoggedIn,
  userName,
  userId,
  onLoginSuccess,
  onLogout,
}: EventsProfileModalProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<EventsTicket | null>(
    null,
  );
  const [qrData, setQrData] = useState("");
  const { signOut: supabaseSignOut } = useSupabaseAuth();

  const generateQRData = useCallback(
    (paymentIntentId: string) => {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/admin/scan/${paymentIntentId}`;
    },
    [],
  );

  const handleTicketClick = (ticket: EventsTicket) => {
    setQrData(generateQRData(ticket.payment_intent_id));
    setSelectedTicket(ticket);
  };

  const handleLogout = async () => {
    try {
      await supabaseSignOut();
      onLogout();
      setShowLoginForm(false);
      setSelectedTicket(null);
      onClose();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleLoginSuccess = (
    identifier: string,
    id: string,
    name?: string,
    isAdmin?: boolean,
    authUserId?: string,
  ) => {
    onLoginSuccess(identifier, id, name, isAdmin, authUserId);
    setShowLoginForm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/90 backdrop-blur">
          <h2 className="font-serif text-xl text-white font-light">
            {showLoginForm ? "Log in" : "Account"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {showLoginForm ? (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <PhoneOTPForm
                  onSuccess={handleLoginSuccess}
                  onCancel={() => setShowLoginForm(false)}
                  title="Log in with your phone"
                />
              </motion.div>
            ) : selectedTicket ? (
              <motion.div
                key="ticket-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="flex items-center gap-2 text-white/70 hover:text-white text-sm"
                >
                  <svg
                    className="w-4 h-4"
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
                  Back to tickets
                </button>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="font-serif text-white/80 text-sm mb-1">
                    Status
                  </p>
                  <p className="font-serif text-emerald-400 font-medium mb-4">
                    Confirmed
                  </p>
                  {qrData && (
                    <div className="inline-flex p-4 bg-white rounded-xl">
                      <QRCodeSVG value={qrData} size={180} level="M" />
                    </div>
                  )}
                  <p className="font-serif text-white/60 text-xs mt-4">
                    Ticket #{selectedTicket.payment_intent_id?.slice(-8) || "—"}
                  </p>
                  <p className="font-serif text-white/50 text-xs">
                    {selectedTicket.ticket_purchased_at ||
                    selectedTicket.created_at
                      ? new Date(
                          selectedTicket.ticket_purchased_at ||
                            selectedTicket.created_at,
                        ).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </motion.div>
            ) : !isLoggedIn ? (
              <motion.div
                key="guest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <p className="font-serif text-white/70 text-sm mb-6">
                  Log in to see your profile and ticket history.
                </p>
                <motion.button
                  type="button"
                  onClick={() => setShowLoginForm(true)}
                  className="rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-8 py-4 font-serif text-white backdrop-blur-xl hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Log in
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-serif text-white/60 text-xs uppercase tracking-wider mb-1">
                    Name
                  </p>
                  <p className="font-serif text-white font-medium">
                    {userName || "—"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white hover:bg-white/20 transition-colors"
                >
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
