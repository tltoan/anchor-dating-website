"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FormData } from "@/app/events/page";
import toast from "react-hot-toast";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

if (!stripeKey) {
  console.warn("Stripe publishable key is not set!");
} else if (stripeKey.startsWith("pk_live_")) {
  console.warn(
    "⚠️ WARNING: Using LIVE Stripe key in development! Use test keys (pk_test_) instead.",
  );
}

const stripePromise = loadStripe(stripeKey);

interface PaymentScreenProps {
  formData: FormData;
  userId?: string;
  eventId?: string;
  price?: number;
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}

function CheckoutForm({
  formData,
  userId,
  eventId,
  price,
  onSuccess,
  onBack,
}: PaymentScreenProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const ticketPrice = price || 29.99;
  console.log("Ticket price:", ticketPrice, eventId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        toast.error(submitError.message || "Please check your payment details");
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        if (!userId) {
          toast.error("User ID is missing. Please try again.");
          setIsProcessing(false);
          return;
        }

        await fetch("/api/save-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            paymentIntentId: paymentIntent.id,
            event_id: eventId,
          }),
        });

        toast.success("Payment successful!");
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={{ width: "100%" }}>
      {/* Price Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-2xl border border-[#E8E3DC] bg-[#F3EFE8] p-6 text-center"
      >
        <p className="mb-2 text-sm text-[#9E9891] font-medium">Ticket Price</p>
        <p className="font-playfair text-5xl font-bold text-[#1A1A1A]">
          ${ticketPrice}
        </p>
      </motion.div>

      {/* Payment Element */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-xl border border-[#E8E3DC] bg-white p-6"
        style={{ minHeight: "300px" }}
      >
        {stripe ? (
          <PaymentElement
            options={{
              layout: "tabs",
              fields: {
                billingDetails: "auto",
              },
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center py-8 text-center text-[#9E9891]">
            <div className="space-y-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8E3DC] border-t-[#D4654A] mx-auto"></div>
              <p>Loading payment methods...</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex gap-4 pt-2"
      >
        <motion.button
          type="button"
          onClick={onBack}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E8E3DC] bg-[#F3EFE8] px-6 py-3.5 text-sm font-semibold text-[#6B6560] hover:bg-[#E8E3DC] hover:text-[#1A1A1A] transition-all"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>
        <motion.button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-3.5 text-sm font-semibold text-white hover:opacity-85 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{
            scale: isProcessing ? 1 : 1.02,
            y: isProcessing ? 0 : -1,
          }}
          whileTap={{ scale: 0.98 }}
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              Processing...
            </>
          ) : (
            <>
              Pay Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}

export default function PaymentScreen({
  formData,
  userId,
  eventId,
  price,
  onSuccess,
  onBack,
}: PaymentScreenProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const ticketPrice = price || 29.99;
  console.log("Ticket price:", ticketPrice);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(ticketPrice * 100),
            formData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        console.log("Payment intent response:", data);
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret in response:", data);
          toast.error(data.error || "Failed to initialize payment");
        }
      } catch (error) {
        console.error("Failed to create payment intent:", error);
        toast.error("Failed to initialize payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [formData, ticketPrice]);

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

          {/* Payment Card */}
          <motion.div
            className="bg-white rounded-2xl p-6 sm:p-8"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-2">
                Complete Payment
              </h2>
              <p className="text-[#9E9891] text-sm font-medium">
                Secure payment processing
              </p>
            </motion.div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 space-y-4"
              >
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E8E3DC] border-t-[#D4654A]"></div>
                <p className="text-[#9E9891]">Initializing payment...</p>
              </motion.div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#D4654A",
                      colorBackground: "#FFFFFF",
                      colorText: "#1A1A1A",
                      colorDanger: "#ef4444",
                      fontFamily: "'DM Sans', sans-serif",
                      spacingUnit: "8px",
                      borderRadius: "12px",
                    },
                  },
                }}
              >
                <CheckoutForm
                  formData={formData}
                  userId={userId}
                  eventId={eventId}
                  onSuccess={onSuccess}
                  onBack={onBack}
                  price={ticketPrice}
                />
              </Elements>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center space-y-4"
              >
                <p className="text-[#9E9891]">
                  Failed to load payment form. Please refresh the page.
                </p>
                <motion.button
                  onClick={() => window.location.reload()}
                  className="rounded-full border border-[#E8E3DC] bg-[#F3EFE8] px-6 py-3 text-sm font-semibold text-[#6B6560] hover:bg-[#E8E3DC] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Refresh
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
