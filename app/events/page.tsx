"use client";

import { useState, useEffect, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import EventsList from "@/components/EventsList";
import EventDetail, { Event } from "@/components/EventDetail";
import EmailEntryForm from "@/components/EmailEntryForm";
import TicketsHistory from "@/components/TicketsHistory";
import PaymentScreen from "@/components/PaymentScreen";
import TicketSuccess from "@/components/TicketSuccess";
import toast from "react-hot-toast";

export type FormData = {
  name: string;
  email: string;
  phone: string;
};

export type FlowStep = "events" | "detail" | "email" | "history" | "payment" | "ticket";

function EventsContent() {
  const [step, setStep] = useState<FlowStep>("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [websiteUserId, setWebsiteUserId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events || []);
      } else {
        toast.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setStep("detail");
  };

  const handlePurchaseTicket = () => {
    if (userEmail && websiteUserId && formData.email && formData.name) {
      // User already authenticated with form data, go to payment
      setStep("payment");
    } else {
      // Need email entry
      setStep("email");
    }
  };


  const handleEmailSuccess = (email: string, userId: string, name?: string, phone?: string) => {
    setUserEmail(email);
    setWebsiteUserId(userId);
    
    // Update form data with email entry info
    setFormData({
      email: email,
      name: name || "",
      phone: phone || "",
    });
    
    // Save to localStorage
    localStorage.setItem("anchor_events_userEmail", email);
    localStorage.setItem("anchor_events_websiteUserId", userId);
    
    // If we were trying to see history, show it now
    const previousStep = localStorage.getItem("anchor_events_pendingAction");
    if (previousStep === "history") {
      localStorage.removeItem("anchor_events_pendingAction");
      setStep("history");
    } else {
      // Otherwise go directly to payment
      setStep("payment");
    }
  };

  const handlePaymentSuccess = (intentId: string) => {
    setPaymentIntentId(intentId);
    setStep("ticket");
  };

  const handleWalletAdded = () => {
    // Clear saved data after completion
    setTimeout(() => {
      setStep("events");
      setSelectedEvent(null);
      setFormData({ name: "", email: "", phone: "" });
      setPaymentIntentId("");
      setUserId("");
    }, 1000);
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        {step === "events" && (
          <EventsListPage
            key="events"
            events={events}
            loading={loading}
            onEventClick={handleEventClick}
          />
        )}
        {step === "detail" && selectedEvent && (
          <EventDetail
            key="detail"
            event={selectedEvent}
            onBuyTicket={() => {
              if (!userEmail) {
                localStorage.setItem("anchor_events_pendingAction", "purchase");
              }
              handlePurchaseTicket();
            }}
            onSeeHistory={() => {
              if (!userEmail) {
                localStorage.setItem("anchor_events_pendingAction", "history");
                setStep("email");
              } else {
                setStep("history");
              }
            }}
            onBack={() => setStep("events")}
          />
        )}
        {step === "email" && (
          <EmailEntryForm
            key="email"
            onSuccess={handleEmailSuccess}
            onCancel={() => {
              if (selectedEvent) {
                setStep("detail");
              } else {
                setStep("events");
              }
            }}
          />
        )}
        {step === "history" && userEmail && websiteUserId && (
          <TicketsHistory
            key="history"
            email={userEmail}
            userId={websiteUserId}
            onBuyNew={() => {
              // If we have form data, go to payment, otherwise get email again
              if (formData.email && formData.name) {
                setStep("payment");
              } else {
                setStep("email");
              }
            }}
            onClose={() => {
              if (selectedEvent) {
                setStep("detail");
              } else {
                setStep("events");
              }
            }}
          />
        )}
        {step === "payment" && (
          <PaymentScreen
            key="payment"
            formData={formData}
            userId={websiteUserId || userId}
            onSuccess={handlePaymentSuccess}
            onBack={() => {
              if (selectedEvent) {
                setStep("detail");
              } else {
                setStep("events");
              }
            }}
          />
        )}
        {step === "ticket" && (
          <TicketSuccess
            key="ticket"
            userId={websiteUserId || userId}
            paymentIntentId={paymentIntentId}
            onWalletAdded={handleWalletAdded}
            onBack={() => {
              if (selectedEvent) {
                setStep("detail");
              } else {
                setStep("events");
              }
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

interface EventsListPageProps {
  events: Event[];
  loading: boolean;
  onEventClick: (event: Event) => void;
}

function EventsListPage({ events, loading, onEventClick }: EventsListPageProps) {
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-serif text-4xl md:text-5xl text-white font-light text-center"
        >
          Events
        </motion.h1>

        <div className="w-full">
          <EventsList events={events} loading={loading} onEventClick={onEventClick} />
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPageRoute() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        </main>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
