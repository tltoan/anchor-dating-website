"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FormData } from "@/app/page";
import toast from "react-hot-toast";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

if (!stripeKey) {
  console.warn("Stripe publishable key is not set!");
} else if (stripeKey.startsWith("pk_live_")) {
  console.warn(
    "⚠️ WARNING: Using LIVE Stripe key in development! Use test keys (pk_test_) instead."
  );
}

const stripePromise = loadStripe(stripeKey);

interface PaymentScreenProps {
  formData: FormData;
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}

function CheckoutForm({ formData, onSuccess, onBack }: PaymentScreenProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const ticketPrice = process.env.NEXT_PUBLIC_TICKET_PRICE || "29.99";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // First, validate the form using elements.submit()
      const { error: submitError } = await elements.submit();

      if (submitError) {
        toast.error(submitError.message || "Please check your payment details");
        setIsProcessing(false);
        return;
      }

      // Confirm payment - client secret is already in Elements context
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
        // Save user data to Supabase
        await fetch("/api/save-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            paymentIntentId: paymentIntent.id,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      style={{ width: "100%" }}
    >
      {/* Price Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-6 text-center "
        style={{
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          marginBottom: "10px",
          overflow: "hidden",
          padding: "1rem",
        }}
      >
        <p className="mb-2 font-serif text-sm text-white/70">Ticket Price</p>
        <p className="font-serif text-5xl font-light text-white">
          ${ticketPrice}
        </p>
      </motion.div>

      {/* Payment Element */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-6"
        style={{
          minHeight: "300px",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          padding: "1rem",
        }}
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
          <div className="flex h-full items-center justify-center py-8 text-center text-white/60">
            <div className="space-y-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white mx-auto"></div>
              <p className="font-serif">Loading payment methods...</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex gap-4 pt-4"
        style={{ marginTop: "20px" }}
      >
        <motion.button
          type="button"
          onClick={onBack}
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-serif text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
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
          Back
        </motion.button>
        <motion.button
          type="submit"
          disabled={!stripe || isProcessing}
          className="group relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-8 py-4 font-serif text-xl font-normal text-white backdrop-blur-xl transition-all hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{
            scale: isProcessing ? 1 : 1.02,
            y: isProcessing ? 0 : -1,
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow:
              "0 10px 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          }}
        >
          <span className="relative z-10 flex items-center gap-3">
            {isProcessing ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                Processing...
              </>
            ) : (
              <>
                Pay Now
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
          {!isProcessing && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}

export default function PaymentScreen({
  formData,
  onSuccess,
  onBack,
}: PaymentScreenProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const ticketPrice = process.env.NEXT_PUBLIC_TICKET_PRICE || "29.99";

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(parseFloat(ticketPrice) * 100),
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

          {/* Payment Card */}
          <motion.div
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              padding: "1rem",
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
              <h2 className="mb-2 font-serif text-5xl md:text-6xl text-white font-light">
                Complete Payment
              </h2>
              <p className="text-white/60 font-serif text-base md:text-lg font-light">
                Secure payment processing
              </p>
            </motion.div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 space-y-4"
              >
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
                <p className="font-serif text-white/70">
                  Initializing payment...
                </p>
              </motion.div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "night",
                    variables: {
                      colorPrimary: "#a855f7",
                      colorBackground: "rgba(255, 255, 255, 0.05)",
                      colorText: "#ffffff",
                      colorDanger: "#ef4444",
                      fontFamily: "var(--font-averia-serif), serif",
                      spacingUnit: "8px",
                      borderRadius: "12px",
                    },
                  },
                }}
              >
                <CheckoutForm
                  formData={formData}
                  onSuccess={onSuccess}
                  onBack={onBack}
                />
              </Elements>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center space-y-4"
              >
                <p className="font-serif text-white/70">
                  Failed to load payment form. Please refresh the page.
                </p>
                <motion.button
                  onClick={() => window.location.reload()}
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-serif text-white transition-all hover:bg-white/20 hover:border-white/30"
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
