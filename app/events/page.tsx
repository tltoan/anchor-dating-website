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
import EventsProfileModal from "@/components/EventsProfileModal";
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
  const [userName, setUserName] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Hydrate user from localStorage (events route only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUserId = localStorage.getItem("anchor_events_websiteUserId");
    const storedName = localStorage.getItem("anchor_events_userName");
    const storedEmail = localStorage.getItem("anchor_events_userEmail");
    if (storedUserId) {
      setWebsiteUserId(storedUserId);
      setUserName(storedName || "");
      setUserEmail(storedEmail || "");
      setFormData((prev) => ({
        ...prev,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
      }));
    }
  }, []);

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
    // Use logged-in user (websiteUserId from phone OTP or email) for purchase
    if (websiteUserId) {
      setStep("payment");
    } else {
      setStep("email");
    }
  };


  const handleEmailSuccess = (email: string, id: string, name?: string, phone?: string) => {
    setUserEmail(email);
    setWebsiteUserId(id);
    setUserName(name ?? "");
    setFormData({ email, name: name ?? "", phone: phone ?? "" });
    localStorage.setItem("anchor_events_userEmail", email);
    localStorage.setItem("anchor_events_websiteUserId", id);
    localStorage.setItem("anchor_events_userName", name ?? "");
    const previousStep = localStorage.getItem("anchor_events_pendingAction");
    if (previousStep === "history") {
      localStorage.removeItem("anchor_events_pendingAction");
      setStep("history");
    } else {
      setStep("payment");
    }
  };

  const handleProfileLoginSuccess = (identifier: string, id: string, name?: string) => {
    setWebsiteUserId(id);
    setUserName(name || "");
    setFormData((prev) => ({ ...prev, name: name || prev.name }));
    if (identifier.includes("@")) {
      setUserEmail(identifier);
      localStorage.setItem("anchor_events_userEmail", identifier);
    } else {
      localStorage.setItem("anchor_events_phone", identifier);
    }
    localStorage.setItem("anchor_events_websiteUserId", id);
    localStorage.setItem("anchor_events_userName", name || "");
  };

  const handleProfileLogout = () => {
    setWebsiteUserId("");
    setUserName("");
    setUserEmail("");
    setFormData({ name: "", email: "", phone: "" });
    localStorage.removeItem("anchor_events_websiteUserId");
    localStorage.removeItem("anchor_events_userName");
    localStorage.removeItem("anchor_events_userEmail");
    localStorage.removeItem("anchor_events_phone");
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
            onOpenProfile={() => setProfileModalOpen(true)}
            isLoggedIn={!!websiteUserId}
            userName={userName || formData.name}
            userId={websiteUserId}
            onProfileLoginSuccess={handleProfileLoginSuccess}
            onProfileLogout={handleProfileLogout}
          />
        )}
        {step === "detail" && selectedEvent && (
          <EventDetail
            key="detail"
            event={selectedEvent}
            onBuyTicket={() => {
              if (!websiteUserId) {
                localStorage.setItem("anchor_events_pendingAction", "purchase");
                setProfileModalOpen(true);
              } else {
                handlePurchaseTicket();
              }
            }}
            onSeeHistory={() => {
              if (!websiteUserId) {
                localStorage.setItem("anchor_events_pendingAction", "history");
                setProfileModalOpen(true);
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
        {step === "history" && websiteUserId && (
          <TicketsHistory
            key="history"
            email={userEmail || ""}
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

      {profileModalOpen && (
        <EventsProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          isLoggedIn={!!websiteUserId}
          userName={userName || formData.name}
          userId={websiteUserId}
          onLoginSuccess={(identifier, id, name) => {
            handleProfileLoginSuccess(identifier, id, name);
            const pending = localStorage.getItem("anchor_events_pendingAction");
            if (pending === "purchase") {
              localStorage.removeItem("anchor_events_pendingAction");
              handlePurchaseTicket();
            } else if (pending === "history") {
              localStorage.removeItem("anchor_events_pendingAction");
              setStep("history");
            }
          }}
          onLogout={handleProfileLogout}
        />
      )}
    </main>
  );
}

interface EventsListPageProps {
  events: Event[];
  loading: boolean;
  onEventClick: (event: Event) => void;
  onOpenProfile: () => void;
  isLoggedIn: boolean;
  userName: string;
  userId: string;
  onProfileLoginSuccess: (identifier: string, id: string, name?: string) => void;
  onProfileLogout: () => void;
}

function EventsListPage({
  events,
  loading,
  onEventClick,
  onOpenProfile,
  isLoggedIn,
  userName,
  userId,
  onProfileLoginSuccess,
  onProfileLogout,
}: EventsListPageProps) {
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

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="absolute top-6 right-4 sm:right-6 z-20">
          <motion.button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-2.5 font-serif text-white hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm">{isLoggedIn ? userName || "Account" : "Log in"}</span>
          </motion.button>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 font-serif text-4xl md:text-5xl text-white font-light text-center"
        >
          Events
        </motion.h1>

        <div className="w-full flex items-center justify-center">
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
