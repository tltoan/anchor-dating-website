"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import EventsList from "@/components/EventsList";
import EventDetail, { Event } from "@/components/EventDetail";
import EventFormModal from "@/components/EventFormModal";
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

export type FlowStep =
  | "events"
  | "detail"
  | "email"
  | "history"
  | "payment"
  | "ticket";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventsView, setEventsView] = useState<"all" | "my">("all");

  const supabase = useMemo(() => createClient(), []);

  // Same as scan flow: use Supabase Auth session + users table to determine logged-in user and is_admin
  const checkSupabaseAuth = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const storedUserId =
          typeof window !== "undefined"
            ? localStorage.getItem("anchor_events_websiteUserId")
            : null;
        if (storedUserId) {
          setWebsiteUserId(storedUserId);
          setUserName(localStorage.getItem("anchor_events_userName") || "");
          setUserEmail(localStorage.getItem("anchor_events_userEmail") || "");
          setIsAdmin(false);
          setFormData((prev) => ({
            ...prev,
            name: localStorage.getItem("anchor_events_userName") || prev.name,
            email:
              localStorage.getItem("anchor_events_userEmail") || prev.email,
          }));
        } else {
          setWebsiteUserId("");
          setUserName("");
          setUserEmail("");
          setIsAdmin(false);
        }
        return;
      }

      let userData: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        email: string | null;
        is_admin: boolean;
      } | null = null;

      const { data: dataByAuthId } = await supabase
        .from("users")
        .select("id, first_name, last_name, email, is_admin")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();

      if (dataByAuthId) {
        userData = dataByAuthId;
      } else {
        const { data: dataById } = await supabase
          .from("users")
          .select("id, first_name, last_name, email, is_admin")
          .eq("id", session.user.id)
          .maybeSingle();
        userData = dataById;
      }

      if (userData) {
        const name =
          [userData.first_name, userData.last_name]
            .filter(Boolean)
            .join(" ")
            .trim() || "";
        setWebsiteUserId(userData.id);
        setUserName(name);
        setUserEmail(userData.email ?? "");
        setIsAdmin(Boolean(userData.is_admin));
        setFormData((prev) => ({
          ...prev,
          name: name || prev.name,
          email: userData!.email ?? prev.email,
        }));
        if (typeof window !== "undefined") {
          localStorage.setItem("anchor_events_websiteUserId", userData.id);
          localStorage.setItem("anchor_events_userName", name);
          localStorage.setItem("anchor_events_userEmail", userData.email ?? "");
          localStorage.setItem(
            "anchor_events_isAdmin",
            String(userData.is_admin),
          );
          localStorage.setItem("anchor_events_authUserId", session.user.id);
        }
      } else {
        setWebsiteUserId("");
        setUserName("");
        setUserEmail("");
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Events auth check failed:", err);
    }
  }, [supabase]);

  useEffect(() => {
    checkSupabaseAuth();
  }, [checkSupabaseAuth]);

  // Fetch events when list is shown; "all" = all events, "my" = only admin's events
  useEffect(() => {
    fetchEvents(eventsView === "my");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchEvents uses state
  }, [websiteUserId, eventsView]);

  // mine=true: only for admin "My events" tab. mine=false: all events for everyone (simple users can see and buy tickets for any event).
  const fetchEvents = async (mine = false) => {
    setLoading(true);
    try {
      const headers: HeadersInit = {};
      const url = mine ? "/api/events?mine=1" : "/api/events";
      const uid =
        websiteUserId ||
        (typeof window !== "undefined"
          ? localStorage.getItem("anchor_events_websiteUserId")
          : null);
      const authUid =
        typeof window !== "undefined"
          ? localStorage.getItem("anchor_events_authUserId")
          : null;
      if (uid) headers["X-User-Id"] = uid;
      if (authUid) headers["X-Auth-User-Id"] = authUid;
      const response = await fetch(url, { headers });
      const data = await response.json();
      if (data.success) {
        setEvents(data.events || []);
        if (data.user) {
          setUserName(data.user.name ?? "");
          setUserEmail(data.user.email ?? "");
          setIsAdmin(Boolean(data.user.is_admin));
          setFormData((prev) => ({
            ...prev,
            name: data.user.name ?? prev.name,
            email: data.user.email ?? prev.email,
          }));
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "anchor_events_userName",
              data.user.name ?? "",
            );
            localStorage.setItem(
              "anchor_events_userEmail",
              data.user.email ?? "",
            );
            localStorage.setItem(
              "anchor_events_isAdmin",
              String(data.user.is_admin),
            );
          }
        } else if (data.is_admin !== undefined) {
          setIsAdmin(data.is_admin);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "anchor_events_isAdmin",
              String(data.is_admin),
            );
          }
        }
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

  const handleEmailSuccess = (
    email: string,
    id: string,
    name?: string,
    phone?: string,
    admin?: boolean,
  ) => {
    setUserEmail(email);
    setWebsiteUserId(id);
    setUserName(name ?? "");
    setIsAdmin(Boolean(admin));
    setFormData({ email, name: name ?? "", phone: phone ?? "" });
    localStorage.setItem("anchor_events_userEmail", email);
    localStorage.setItem("anchor_events_websiteUserId", id);
    localStorage.setItem("anchor_events_userName", name ?? "");
    localStorage.setItem("anchor_events_isAdmin", String(Boolean(admin)));
    const previousStep = localStorage.getItem("anchor_events_pendingAction");
    if (previousStep === "history") {
      localStorage.removeItem("anchor_events_pendingAction");
      setStep("history");
    } else {
      setStep("payment");
    }
  };

  const handleProfileLoginSuccess = (
    identifier: string,
    id: string,
    name?: string,
    admin?: boolean,
    authUserId?: string,
  ) => {
    setWebsiteUserId(id);
    setUserName(name || "");
    setIsAdmin(Boolean(admin));
    setFormData((prev) => ({ ...prev, name: name || prev.name }));
    if (identifier.includes("@")) {
      setUserEmail(identifier);
      localStorage.setItem("anchor_events_userEmail", identifier);
    } else {
      localStorage.setItem("anchor_events_phone", identifier);
    }
    localStorage.setItem("anchor_events_websiteUserId", id);
    localStorage.setItem("anchor_events_userName", name || "");
    localStorage.setItem("anchor_events_isAdmin", String(Boolean(admin)));
    if (authUserId) {
      localStorage.setItem("anchor_events_authUserId", authUserId);
    } else {
      localStorage.removeItem("anchor_events_authUserId");
    }
  };

  const handleProfileLogout = async () => {
    await supabase.auth.signOut();
    setWebsiteUserId("");
    setUserName("");
    setUserEmail("");
    setIsAdmin(false);
    setFormData({ name: "", email: "", phone: "" });
    localStorage.removeItem("anchor_events_websiteUserId");
    localStorage.removeItem("anchor_events_userName");
    localStorage.removeItem("anchor_events_userEmail");
    localStorage.removeItem("anchor_events_phone");
    localStorage.removeItem("anchor_events_isAdmin");
    localStorage.removeItem("anchor_events_authUserId");
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

  const handleEventFormSuccess = (updatedEvent?: Event) => {
    fetchEvents(eventsView === "my");
    if (editingEvent && selectedEvent?.id === editingEvent.id && updatedEvent) {
      setSelectedEvent(updatedEvent);
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (ev: Event) => {
    if (!websiteUserId) return;
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      const headers: HeadersInit = { "X-User-Id": websiteUserId };
      const authUid =
        typeof window !== "undefined"
          ? localStorage.getItem("anchor_events_authUserId")
          : null;
      if (authUid) headers["X-Auth-User-Id"] = authUid;
      const res = await fetch(`/api/events/${ev.id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to delete event");
        return;
      }
      toast.success("Event deleted.");
      fetchEvents(eventsView === "my");
      if (selectedEvent?.id === ev.id) {
        setStep("events");
        setSelectedEvent(null);
      }
    } catch {
      toast.error("Failed to delete event");
    }
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
            isAdmin={isAdmin}
            eventsView={eventsView}
            onSwitchView={setEventsView}
            onAddEvent={() => {
              setEditingEvent(null);
              setAddEventModalOpen(true);
            }}
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
            isAdmin={isAdmin}
            userId={websiteUserId}
            onEdit={() => {
              setEditingEvent(selectedEvent);
              setAddEventModalOpen(true);
            }}
            onDelete={() => handleDeleteEvent(selectedEvent)}
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
            eventId={selectedEvent?.id}
            onBuyNew={() => {
              // Same as purchase: logged-in user goes straight to payment
              if (websiteUserId) {
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
            eventId={selectedEvent?.id}
            price={selectedEvent?.price}
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
            eventId={selectedEvent?.id}
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
          onLoginSuccess={(identifier, id, name, isAdmin, authUserId) => {
            handleProfileLoginSuccess(
              identifier,
              id,
              name,
              isAdmin,
              authUserId,
            );
            checkSupabaseAuth();
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

      {addEventModalOpen && websiteUserId && (
        <EventFormModal
          isOpen={addEventModalOpen}
          onClose={() => {
            setAddEventModalOpen(false);
            setEditingEvent(null);
          }}
          onSuccess={(updatedEvent?) => handleEventFormSuccess(updatedEvent)}
          userId={websiteUserId}
          event={editingEvent}
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
  isAdmin: boolean;
  eventsView: "all" | "my";
  onSwitchView: (view: "all" | "my") => void;
  onAddEvent: () => void;
}

function EventsListPage({
  events,
  loading,
  onEventClick,
  onOpenProfile,
  isLoggedIn,
  userName,
  isAdmin,
  eventsView,
  onSwitchView,
  onAddEvent,
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
        <div className="absolute top-6 right-4 sm:right-6 z-20 flex items-center gap-2">
          {isAdmin && eventsView === "my" && (
            <motion.button
              type="button"
              onClick={onAddEvent}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/20 backdrop-blur-xl px-4 py-2.5 font-serif text-white hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add event
            </motion.button>
          )}
          <motion.button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-2.5 font-serif text-white hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              className="w-5 h-5 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm">
              {isLoggedIn ? userName || "Account" : "Log in"}
            </span>
          </motion.button>
        </div>

        {isAdmin && (
          <div className="flex gap-2 mb-8">
            <button
              type="button"
              onClick={() => onSwitchView("all")}
              className={`rounded-full px-5 py-2.5 font-serif text-sm transition-colors ${
                eventsView === "all"
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
              }`}
            >
              All events
            </button>
            <button
              type="button"
              onClick={() => onSwitchView("my")}
              className={`rounded-full px-5 py-2.5 font-serif text-sm transition-colors ${
                eventsView === "my"
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
              }`}
            >
              My events
            </button>
          </div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 font-serif text-4xl md:text-5xl text-white font-light text-center"
        >
          {eventsView === "my" ? "My events" : "Events"}
        </motion.h1>

        <div className="w-full flex items-center justify-center">
          <EventsList
            events={events}
            loading={loading}
            onEventClick={onEventClick}
          />
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
