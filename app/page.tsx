"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import SignupForm from "@/components/SignupForm";
import PaymentScreen from "@/components/PaymentScreen";
import TicketSuccess from "@/components/TicketSuccess";
import PremiumMessage from "@/components/PremiumMessage";

export type FormData = {
  name: string;
  email: string;
  phone: string;
};

export type FlowStep = "hero" | "form" | "payment" | "ticket" | "premium";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as FlowStep | null;
  const [isClient, setIsClient] = useState(false);

  const [step, setStep] = useState<FlowStep>("hero");

  const [formData, setFormData] = useState<FormData>({
    name: process.env.NODE_ENV == "development" ? "alexander" : "",
    email: process.env.NODE_ENV == "development" ? "alexander@gmail.com" : "",
    phone: process.env.NODE_ENV == "development" ? "1234567890" : "",
  });

  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Sync step with URL and localStorage (client-side only)
  useEffect(() => {
    if (!isClient) return;

    // Update URL when step changes
    if (step) {
      const params = new URLSearchParams();
      params.set("step", step);
      router.replace(`?${params.toString()}`, { scroll: false });

      // Save to localStorage
      localStorage.setItem("anchor_step", step);
    }
  }, [step, router, isClient]);

  // Mark as client and restore state from localStorage/URL
  useEffect(() => {
    setIsClient(true);

    // Restore step from URL or localStorage
    if (
      stepParam &&
      ["hero", "form", "payment", "ticket", "premium"].includes(stepParam)
    ) {
      setStep(stepParam);
    } else {
      const savedStep = localStorage.getItem("anchor_step") as FlowStep | null;
      if (
        savedStep &&
        ["hero", "form", "payment", "ticket", "premium"].includes(savedStep)
      ) {
        setStep(savedStep);
        const params = new URLSearchParams();
        params.set("step", savedStep);
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    }

    // Restore form data (this acts as "remember me")
    const savedFormData = localStorage.getItem("anchor_formData");
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData(parsed);
        // If we have saved phone, user is "remembered"
        console.log("Restored saved user data:", parsed);
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Restore payment intent
    const savedPaymentIntent = localStorage.getItem("anchor_paymentIntentId");
    if (savedPaymentIntent) {
      setPaymentIntentId(savedPaymentIntent);
    }

    // Restore userId
    const savedUserId = localStorage.getItem("anchor_userId");
    if (savedUserId) {
      setUserId(savedUserId);
    }
  }, [stepParam, router]);

  // Save form data to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (!isClient) return;
    if (formData.name || formData.email || formData.phone) {
      localStorage.setItem("anchor_formData", JSON.stringify(formData));
    }
  }, [formData, isClient]);

  // Save payment intent ID to localStorage (client-side only)
  useEffect(() => {
    if (!isClient) return;
    if (paymentIntentId) {
      localStorage.setItem("anchor_paymentIntentId", paymentIntentId);
    }
  }, [paymentIntentId, isClient]);

  // Save userId to localStorage (client-side only)
  useEffect(() => {
    if (!isClient) return;
    if (userId) {
      localStorage.setItem("anchor_userId", userId);
    }
  }, [userId, isClient]);

  const handleGetStarted = () => {
    setStep("form");
  };

  const handleFormSubmit = (data: FormData, userId?: string) => {
    setFormData(data);
    if (userId) {
      setUserId(userId);
    }
    setStep("payment");
  };

  const handlePaymentSuccess = (intentId: string) => {
    setPaymentIntentId(intentId);
    setStep("ticket");
  };

  const handleWalletAdded = () => {
    setStep("premium");
    // Clear saved data after completion
    setTimeout(() => {
      localStorage.removeItem("anchor_step");
      localStorage.removeItem("anchor_formData");
      localStorage.removeItem("anchor_paymentIntentId");
      localStorage.removeItem("anchor_userId");
    }, 1000);
  };

  // Don't render steps until client-side hydration is complete
  if (!isClient) {
    return (
      <main className="min-h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        {step === "hero" && <Hero key="hero" onGetStarted={handleGetStarted} />}
        {step === "form" && (
          <SignupForm
            key="form"
            onSubmit={handleFormSubmit}
            onBack={() => setStep("hero")}
            initialFormData={formData}
          />
        )}
        {step === "payment" && (
          <PaymentScreen
            key="payment"
            formData={formData}
            userId={userId}
            onSuccess={handlePaymentSuccess}
            onBack={() => setStep("form")}
          />
        )}
        {step === "ticket" && (
          <TicketSuccess
            key="ticket"
            userId={userId}
            paymentIntentId={paymentIntentId}
            onWalletAdded={handleWalletAdded}
            onBack={() => {
              // Go back to form and trigger ticket check
              setStep("form");
            }}
          />
        )}
        {step === "premium" && <PremiumMessage key="premium" />}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
