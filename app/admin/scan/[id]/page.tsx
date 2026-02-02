"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface Ticket {
  id: string;
  payment_intent_id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  created_at: string;
  ticket_purchased_at?: string;
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  eventPrice: number;
  eventTicketPurchaseDate: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export default function AdminScanPage() {
  const params = useParams();
  const ticketId = params.id as string; // This corresponds to payment_intent_id
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        setError("Please log in to access this page.");
        return;
      }

      setUser(session.user);

      // Check if user is admin
      // We check both 'id' and 'auth_user_id' to be safe

      let userData = null;

      // Try auth_user_id first
      const { data: dataByAuthId } = await supabase
        .from("users")
        .select("is_admin")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();

      if (dataByAuthId) {
        userData = dataByAuthId;
      } else {
        // Try id as fallback
        const { data: dataById } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", session.user.id)
          .maybeSingle();
        userData = dataById;
      }

      if (!userData?.is_admin) {
        setError("Access Denied: You do not have administrator privileges.");
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      fetchTicket(ticketId);
    } catch (err) {
      console.error("Auth check failed:", err);
      setError("Failed to verify authentication.");
      setLoading(false);
    }
  };

  const fetchTicket = async (id: string) => {
    try {
      // Fetch ticket by payment_intent_id (as used in QR code)
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("payment_intent_id", id)
        .single();

      if (error) throw error;
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user_id)
        .single();

      if (userError) throw userError;

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", data.event_id)
        .single();
      if (eventError) throw eventError;

      const ticket = {
        ...data,
        eventTitle: eventData.title,
        eventDescription: eventData.description,
        eventLocation: eventData.location,
        eventPrice: eventData.price,
        eventTicketPurchaseDate: eventData.date,
        userName: userData.first_name,
        userEmail: userData.email,
        userPhone: userData.phone_number,
      };
      setTicket(ticket);

      if (data.status === "checked_in") {
        toast.error("⚠️ WARNING: This ticket has ALREADY been used!", {
          duration: 5000,
          style: {
            border: "1px solid #EF4444",
            padding: "16px",
            color: "#EF4444",
            background: "#1F2937",
          },
        });
      }
    } catch (err) {
      console.error("Fetch ticket failed:", err);
      setError("INVALID TICKET: Ticket not found or fake QR code.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!ticket) return;

    try {
      const { error } = await supabase
        .from("tickets")
        .update({ status: newStatus })
        .eq("id", ticket.id);

      if (error) throw error;

      setTicket({ ...ticket, status: newStatus });
      if (newStatus === "checked_in") {
        setJustCheckedIn(true);
      } else {
        setJustCheckedIn(false);
      }
      toast.success(`Ticket marked as ${newStatus}`);
    } catch (err) {
      console.error("Update status failed:", err);
      toast.error(
        "Failed to update ticket status. Ensure 'status' column exists.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center text-white">
        <div className="rounded-full bg-red-500/10 p-4 text-red-500">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="font-serif text-2xl">Error</h1>
        <p className="text-white/60">{error}</p>
        <Link
          href="/"
          className="rounded-xl bg-white/10 px-6 py-2 transition-colors hover:bg-white/20"
        >
          Go Home
        </Link>
        {!user && (
          <Link
            href="/events" // Assuming login is available here or similar
            className="rounded-xl bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700"
          >
            Log In
          </Link>
        )}
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8 text-white">
      <Toaster position="bottom-center" />
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-light">Admin Scan</h1>
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            Exit
          </Link>
        </div>

        {ticket ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 text-center">
              <div
                className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 ${
                  justCheckedIn
                    ? "border-green-500/30 bg-green-500/20 text-green-500"
                    : ticket.status === "checked_in"
                      ? "border-red-500/30 bg-red-500/20 text-red-500"
                      : "border-blue-500/30 bg-blue-500/20 text-blue-400"
                }`}
              >
                {justCheckedIn ? (
                  <svg
                    className="h-10 w-10"
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
                  </svg>
                ) : ticket.status === "checked_in" ? (
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <h2 className="font-serif text-3xl font-medium">
                {justCheckedIn
                  ? "CHECKED IN"
                  : ticket.status === "checked_in"
                    ? "ALREADY USED"
                    : "VALID TICKET"}
              </h2>
              <p className="mt-2 text-white/60">
                {justCheckedIn
                  ? "Ticket successfully checked in."
                  : ticket.status === "checked_in"
                    ? "This ticket has already been checked in."
                    : "This ticket is valid and ready for check-in."}
              </p>
            </div>

            {/* Event Details Section */}
            <div className="mb-4 space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-serif text-lg text-white/90">
                Event Details
              </h3>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Event</span>
                <span className="font-medium text-right">
                  {ticket.eventTitle}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Location</span>
                <span className="text-right">{ticket.eventLocation}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Date</span>
                <span className="text-right">
                  {ticket.eventTicketPurchaseDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Price</span>
                <span>${ticket.eventPrice}</span>
              </div>
            </div>

            <div className="space-y-4 rounded-xl bg-white/5 p-4">
              <h3 className="font-serif text-lg text-white/90">User Details</h3>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Name</span>
                <span className="font-medium">{ticket.userName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">
                  {ticket.userPhone !== null ? "Phone" : "Email"}
                </span>
                <span>
                  {ticket.userPhone !== null
                    ? ticket.userPhone
                    : ticket.userEmail}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Status</span>
                <span
                  className={`capitalize ${ticket.status === "checked_in" ? "text-green-400" : "text-yellow-400"}`}
                >
                  {ticket.status || "Purchased"}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-white/60">Ticket ID</span>
                <span className="font-mono text-xs text-white/40">
                  {ticket.payment_intent_id.slice(-8)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {ticket.status !== "checked_in" ? (
                <button
                  onClick={() => updateStatus("checked_in")}
                  className="flex-1 rounded-xl bg-green-500 py-3 font-semibold text-white shadow-lg shadow-green-500/20 transition-transform active:scale-95 hover:bg-green-600"
                >
                  Check In
                </button>
              ) : (
                <button
                  onClick={() => updateStatus("purchased")}
                  className="flex-1 rounded-xl bg-white/10 py-3 font-semibold text-white transition-colors hover:bg-white/20 active:scale-95"
                >
                  Reset Status
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-white/60">
            Ticket information unavailable.
          </div>
        )}
      </div>
    </div>
  );
}
