"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormData } from "@/app/page";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

interface SignupFormProps {
  onSubmit: (data: FormData, userId?: string) => void;
  onBack: () => void;
  initialFormData?: FormData;
}

interface Ticket {
  id: string;
  name: string;
  email: string;
  phone: string;
  payment_intent_id: string;
  ticket_purchased_at: string;
  created_at: string;
}

export default function SignupForm({
  onSubmit,
  onBack,
  initialFormData,
}: SignupFormProps) {
  const [formData, setFormData] = useState<FormData>(
    initialFormData ||
      (process.env.NODE_ENV == "development"
        ? {
            name: "alexander",
            email: "alexander@gmail.com",
            phone: "1234567890",
          }
        : { name: "", email: "", phone: "" })
  );

  // Update formData when initialFormData changes (from saved localStorage)
  useEffect(() => {
    if (
      initialFormData &&
      (initialFormData.phone || initialFormData.email || initialFormData.name)
    ) {
      setFormData(initialFormData);
    }
  }, [initialFormData]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [existingTickets, setExistingTickets] = useState<Ticket[]>([]);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [showExistingTickets, setShowExistingTickets] = useState(false);
  const [hasCheckedOnLoad, setHasCheckedOnLoad] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string>("");

  // Check for existing tickets when component loads with phone number
  useEffect(() => {
    if (hasCheckedOnLoad) return; // Only check once on initial load

    if (formData.phone && formData.phone.trim()) {
      setHasCheckedOnLoad(true);
      setIsCheckingUser(true);

      const checkExistingTickets = async () => {
        try {
          console.log(
            "Initial check for existing user with phone:",
            formData.phone
          );
          const checkResponse = await fetch("/api/check-existing-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.phone, email: formData.email }),
          });

        const checkData = await checkResponse.json().catch(async () => {
          // If JSON parsing fails, try to get text
          const text = await checkResponse.text();
          return { error: text || "Unknown error" };
        });
        console.log("Check response:", checkData);

        // Check for mismatch errors (email/phone combination issue)
        if (checkData.mismatch && checkData.error) {
          console.log("Mismatch detected:", checkData.error);
          toast.error(checkData.error);
          setIsCheckingUser(false);
          
          // Set appropriate field error
          if (checkData.errorType === "email_mismatch" || checkData.errorType === "both_mismatch") {
            setErrors({ ...errors, email: checkData.error });
          }
          if (checkData.errorType === "phone_mismatch" || checkData.errorType === "both_mismatch") {
            setErrors({ ...errors, phone: checkData.error });
          }
          return; // Don't proceed to payment
        }

        if (checkResponse.ok) {
            console.log("Initial check response:", checkData);

            if (
              checkData.exists &&
              checkData.tickets &&
              checkData.tickets.length > 0
            ) {
              console.log(
                "Found existing tickets on load:",
                checkData.tickets.length
              );
              setExistingTickets(checkData.tickets);
              setShowExistingTickets(true);
            }
          } else {
            const errorText = await checkResponse.text();
            console.error("Failed to check existing user:", errorText);
          }
        } catch (error) {
          console.error("Error checking existing tickets on load:", error);
        } finally {
          setIsCheckingUser(false);
        }
      };

      checkExistingTickets();
    }
  }, [formData.phone, hasCheckedOnLoad]);

  // Only check for existing tickets on initial load if formData is pre-filled
  // Don't check while user is typing

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsCheckingUser(true);

      try {
        // First, check if user exists by both email and phone number
        console.log("Checking for existing user with phone:", formData.phone, "email:", formData.email);
        const checkResponse = await fetch("/api/check-existing-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.phone, email: formData.email }),
        });

        const checkData = await checkResponse.json().catch(async () => {
          // If JSON parsing fails, try to get text
          const text = await checkResponse.text();
          return { error: text || "Unknown error" };
        });
        console.log("Check response:", checkData);

        // Check for mismatch errors (email/phone combination issue)
        if (checkData.mismatch && checkData.error) {
          console.log("Mismatch detected:", checkData.error);
          toast.error(checkData.error);
          setIsCheckingUser(false);
          
          // Set appropriate field error
          if (checkData.errorType === "email_mismatch" || checkData.errorType === "both_mismatch") {
            setErrors({ ...errors, email: checkData.error });
          }
          if (checkData.errorType === "phone_mismatch" || checkData.errorType === "both_mismatch") {
            setErrors({ ...errors, phone: checkData.error });
          }
          return; // Don't proceed to payment
        }

        if (checkResponse.ok) {
          // Store userId if user exists
          if (checkData.userId) {
            setUserId(checkData.userId);
          }
          // If user exists and has tickets, show them
          if (
            checkData.exists &&
            checkData.tickets &&
            checkData.tickets.length > 0
          ) {
            console.log("Found existing tickets, showing them");
            setExistingTickets(checkData.tickets);
            setShowExistingTickets(true);
            setIsCheckingUser(false);
            return; // Don't proceed to payment yet
          } else if (checkData.exists) {
            // User exists but no tickets - proceed normally
            console.log("User exists but no tickets, proceeding to payment");
          } else {
            // New user - proceed normally
            console.log("New user, proceeding to payment");
          }
        } else {
          console.error(
            "Failed to check existing user:",
            checkData.error || "Unknown error"
          );
          // If it's a mismatch error, we already handled it above
          if (checkData.mismatch) {
            return;
          }
        }

        // If no existing tickets, proceed normally
        // Save user to wishlist before proceeding to payment
        const saveResponse = await fetch("/api/save-user-to-wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        let finalUserId = userId || checkData.userId;

        if (saveResponse.ok) {
          const saveData = await saveResponse.json().catch(() => ({}));
          // Get userId from saved user data
          if (saveData.data && saveData.data[0] && saveData.data[0].id) {
            finalUserId = saveData.data[0].id;
            setUserId(finalUserId);
          }
        } else {
          const errorData = await saveResponse.json().catch(() => ({}));
          console.error(
            "Failed to save user to wishlist:",
            errorData.error || "Unknown error"
          );

          // Show user-friendly error message
          if (
            errorData.error?.includes("Email already exists") ||
            errorData.error?.includes("already registered") ||
            errorData.code === "EMAIL_EXISTS" ||
            errorData.code === "23505"
          ) {
            toast.error(
              errorData.error ||
                "This email is already registered. Please use a different email address."
            );
            setIsCheckingUser(false);
            return; // Don't proceed to payment
          }

          // For other errors, show generic message but continue
          toast.error(errorData.error || "Failed to save. Please try again.");
        }

        onSubmit(formData, finalUserId);
      } catch (error) {
        console.error("Error checking/saving user:", error);
        // Continue anyway - don't block the flow
        onSubmit(formData, userId || undefined);
      } finally {
        setIsCheckingUser(false);
      }
    }
  };

  const handleBuyMoreTickets = async () => {
    // Hide existing tickets view and proceed to payment
    setShowExistingTickets(false);

    // Save user to wishlist and proceed to payment
    try {
      await fetch("/api/save-user-to-wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error("Error saving user:", error);
    }

    onSubmit(formData, userId);
  };

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

  // Generate QR code data for a specific ticket
  const generateQRData = useCallback((ticketPaymentIntentId: string) => {
    return JSON.stringify({
      id: ticketPaymentIntentId,
      email: formData.email || userId,
      timestamp: Date.now(),
    });
  }, [formData.email, userId]);

  const handleTicketClick = (ticket: Ticket) => {
    // Generate QR code for the selected ticket
    const ticketQrData = generateQRData(ticket.payment_intent_id);
    setQrData(ticketQrData);
    setSelectedTicketId(ticket.payment_intent_id);
  };

  // Reset QR code when hiding existing tickets
  useEffect(() => {
    if (!showExistingTickets) {
      setQrData("");
      setSelectedTicketId(null);
    }
  }, [showExistingTickets]);

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
          <motion.button
            onClick={onBack}
            className="mb-8 group flex items-center gap-2 text-white/80 transition-all hover:text-white"
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

          {/* Form Card */}
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

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ marginBottom: "2rem" }}
            >
              <h2 className="mb-3 font-serif text-5xl md:text-6xl text-white font-light">
                {showExistingTickets ? "Welcome Back!" : "Join Anchor"}
              </h2>
              <p className="text-white/60 font-serif text-base md:text-lg font-light">
                {showExistingTickets
                  ? "Here are your existing tickets"
                  : "Start your journey to guaranteed dates"}
              </p>
            </motion.div>

            {/* Existing Tickets View */}
            <AnimatePresence>
              {showExistingTickets && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 space-y-4"
                >
                  {!selectedTicketId && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 text-center font-serif text-sm text-white/60 font-light"
                    >
                      Click on a ticket below to view its QR code
                    </motion.p>
                  )}

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {existingTickets.map((ticket, index) => {
                      const isSelected = selectedTicketId === ticket.payment_intent_id;
                      return (
                        <motion.div
                          key={ticket.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleTicketClick(ticket)}
                          className={`rounded-xl border p-4 backdrop-blur-sm cursor-pointer transition-all ${
                            isSelected
                              ? "border-white/40 bg-white/10"
                              : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/8"
                          }`}
                          style={{
                            boxShadow: isSelected
                              ? "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(139, 92, 246, 0.3)"
                              : "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                            padding: "10px",
                            marginBottom: "10px",
                          }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-serif text-white font-light">
                                Ticket #
                                {ticket.payment_intent_id?.slice(-8) || "N/A"}
                              </p>
                              <p className="font-serif text-sm text-white/60 font-light">
                                Purchased:{" "}
                                {ticket.ticket_purchased_at
                                  ? new Date(
                                      ticket.ticket_purchased_at
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : ticket.created_at
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
                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="h-5 w-5 text-purple-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </motion.svg>
                              )}
                              <div className="h-2 w-2 rounded-full bg-green-400"></div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.button
                    onClick={handleBuyMoreTickets}
                    className="group relative w-full overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-8 py-5 font-serif text-xl font-normal text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40"
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      boxShadow:
                        "0 10px 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Buy More Tickets
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

                  {/* Store Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-4"
                  >
                    <p className="text-center font-serif text-sm text-white/70 font-light mb-3">
                      Download the App
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleStoreClick("appstore")}
                        className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-serif text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-.96-1.23 0-2.08.5-3.08.96-1.05.5-2.22.95-3.57.4-1.35-.5-2.22-1.78-3.08-3.08C.5 15.5 0 13.5 0 11.5c0-2 .5-4 1.5-5.5 1-1.5 2.5-2.5 4.5-3.5 1.5-.8 3.2-1.2 5-1.2 1.3 0 2.5.3 3.5.8 1 .5 2 .8 3 .8s2-.3 3-.8c1-.5 2.2-.8 3.5-.8 1.8 0 3.5.4 5 1.2 2 1 3.5 2 4.5 3.5 1 1.5 1.5 3.5 1.5 5.5 0 2-.5 4-1.5 5.5-1 1.5-2.5 2.5-4.5 3.5-1.5.8-3.2 1.2-5 1.2-1.3 0-2.5-.3-3.5-.8-1-.5-2-.8-3-.8s-2 .3-3 .8z" />
                        </svg>
                        <span className="text-sm">App Store</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleStoreClick("playstore")}
                        className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-serif text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                        </svg>
                        <span className="text-sm">Play Store</span>
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={() => setShowExistingTickets(false)}
                    className="w-full text-center text-white/60 font-serif text-sm hover:text-white/80 transition-colors mt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enter different phone number
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* QR Code Modal - Shows on separate overlay/page when ticket is clicked */}
            <AnimatePresence>
              {qrData && selectedTicketId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-6"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
                  onClick={() => {
                    setQrData("");
                    setSelectedTicketId(null);
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl max-w-md w-full"
                    style={{
                      padding: "2rem",
                      boxShadow:
                        "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                    }}
                  >
                    {/* Close Button */}
                    <motion.button
                      onClick={() => {
                        setQrData("");
                        setSelectedTicketId(null);
                      }}
                      className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="h-6 w-6"
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
                    </motion.button>

                    {/* QR Code Content */}
                    <div className="flex flex-col items-center">
                      <h3 className="mb-4 font-serif text-3xl text-white font-light">
                        Your Ticket QR Code
                      </h3>
                      <div
                        className="rounded-2xl border-2 border-white/20 bg-black/10 p-6 backdrop-blur-sm mb-4"
                        style={{
                          boxShadow:
                            "0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                          padding: "16px",
                        }}
                      >
                        <QRCodeSVG
                          value={qrData}
                          size={280}
                          level="H"
                          includeMargin={false}
                          fgColor="#ffffff"
                          bgColor="transparent"
                        />
                      </div>
                      <p className="text-center font-serif text-sm text-white/60 font-light">
                        Show this QR code at the event entrance
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* QR Code Modal - Shows on separate overlay when ticket is clicked */}
            <AnimatePresence>
              {qrData && selectedTicketId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-6"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
                  onClick={() => {
                    setQrData("");
                    setSelectedTicketId(null);
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl max-w-md w-full"
                    style={{
                      padding: "2rem",
                      boxShadow:
                        "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                    }}
                  >
                    {/* Close Button */}
                    <motion.button
                      onClick={() => {
                        setQrData("");
                        setSelectedTicketId(null);
                      }}
                      className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="h-6 w-6"
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
                    </motion.button>

                    {/* QR Code Content */}
                    <div className="flex flex-col items-center">
                      <h3 className="mb-4 font-serif text-3xl text-white font-light">
                        Your Ticket QR Code
                      </h3>
                      <div
                        className="rounded-2xl border-2 border-white/20 bg-black/10 p-6 backdrop-blur-sm mb-4"
                        style={{
                          boxShadow:
                            "0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                          padding: "16px",
                        }}
                      >
                        <QRCodeSVG
                          value={qrData}
                          size={280}
                          level="H"
                          includeMargin={false}
                          fgColor="#ffffff"
                          bgColor="transparent"
                        />
                      </div> 
                      <p className="text-center font-serif text-sm text-white/60 font-light">
                        Show this QR code at the event entrance
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!showExistingTickets && (
                <motion.form
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  {/* Name Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{ width: "100%", marginBottom: "10px" }}
                  >
                    <label className="block mb-2 font-serif text-white/80 text-sm font-normal">
                      Full Name
                    </label>
                    <div className="relative" style={{ width: "100%" }}>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full rounded-xl border transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/40 focus:outline-none font-serif text-base ${
                          focusedField === "name"
                            ? "border-white/40 bg-white/10 shadow-lg"
                            : "border-white/20 hover:border-white/30"
                        } ${errors.name ? "border-red-400/60" : ""}`}
                        style={{
                          padding: "1rem 1.25rem",
                          width: "100%",
                          boxSizing: "border-box",
                          boxShadow:
                            focusedField === "name"
                              ? "0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                              : "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                        }}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 text-sm text-red-300 font-serif"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{ width: "100%", marginBottom: "10px" }}
                  >
                    <label className="block mb-2 font-serif text-white/80 text-sm font-normal">
                      Email Address
                    </label>
                    <div className="relative" style={{ width: "100%" }}>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full rounded-xl border transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/40 focus:outline-none font-serif text-base ${
                          focusedField === "email"
                            ? "border-white/40 bg-white/10 shadow-lg"
                            : "border-white/20 hover:border-white/30"
                        } ${errors.email ? "border-red-400/60" : ""}`}
                        style={{
                          padding: "1rem 1.25rem",
                          width: "100%",
                          boxSizing: "border-box",
                          boxShadow:
                            focusedField === "email"
                              ? "0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                              : "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                        }}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 text-sm text-red-300 font-serif"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Phone Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    style={{ width: "100%", marginBottom: "10px" }}
                  >
                    <label className="block mb-2 font-serif text-white/80 text-sm font-normal">
                      Phone Number
                    </label>
                    <div className="relative" style={{ width: "100%" }}>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full rounded-xl border transition-all duration-300 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/40 focus:outline-none font-serif text-base ${
                          focusedField === "phone"
                            ? "border-white/40 bg-white/10 shadow-lg"
                            : "border-white/20 hover:border-white/30"
                        } ${errors.phone ? "border-red-400/60" : ""}`}
                        style={{
                          padding: "1rem 1.25rem",
                          width: "100%",
                          boxSizing: "border-box",
                          boxShadow:
                            focusedField === "phone"
                              ? "0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                              : "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                        }}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 text-sm text-red-300 font-serif"
                        >
                          {errors.phone}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    style={{ paddingTop: "2rem", marginTop: "0.5rem" }}
                  >
                    <motion.button
                      type="submit"
                      disabled={isCheckingUser}
                      className="group relative w-full overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-8 py-5 font-serif text-xl font-normal text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={isCheckingUser ? {} : { scale: 1.01, y: -1 }}
                      whileTap={isCheckingUser ? {} : { scale: 0.99 }}
                      style={{
                        boxShadow:
                          "0 10px 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <span
                        className="relative z-10 flex items-center justify-center gap-3"
                        style={{
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        {isCheckingUser ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                            Checking...
                          </>
                        ) : (
                          <>
                            Continue
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
                          </>
                        )}
                      </span>
                      {!isCheckingUser && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.8 }}
                        />
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
