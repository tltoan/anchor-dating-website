"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import type { Event } from "./EventDetail";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedEvent?: Event) => void;
  userId: string;
  event?: Event | null;
}

const defaultValues = {
  title: "",
  description: "",
  date: "",
  location: "",
  image_url: "",
  price: "0",
};

export default function EventFormModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  event,
}: EventFormModalProps) {
  const isEdit = Boolean(event?.id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultValues);

  useEffect(() => {
    if (event) {
      const d = new Date(event.date);
      const dateStr = Number.isNaN(d.getTime())
        ? ""
        : d.toISOString().slice(0, 16);
      setForm({
        title: event.title ?? "",
        description: event.description ?? "",
        date: dateStr,
        location: event.location ?? "",
        image_url: event.image_url ?? "",
        price: String(event.price ?? 0),
      });
    } else {
      setForm(defaultValues);
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    const location = form.location.trim();
    const price = parseFloat(form.price);
    if (!title || !location || Number.isNaN(price)) {
      toast.error("Title, location, and price are required.");
      return;
    }
    const date = form.date
      ? new Date(form.date).toISOString()
      : new Date().toISOString();
    setLoading(true);
    try {
      const authUid =
        typeof window !== "undefined" ? localStorage.getItem("anchor_events_authUserId") : null;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-User-Id": userId,
      };
      if (authUid) headers["X-Auth-User-Id"] = authUid;
      if (isEdit && event) {
        const res = await fetch(`/api/events/${event.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            title,
            description: form.description.trim() || null,
            date,
            location,
            image_url: form.image_url.trim() || null,
            price,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to update event");
          return;
        }
        toast.success("Event updated.");
        onSuccess(data.event);
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers,
          body: JSON.stringify({
            title,
            description: form.description.trim() || null,
            date,
            location,
            image_url: form.image_url.trim() || null,
            price,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const msg = data.details ? `${data.error}: ${data.details}` : (data.error || "Failed to create event");
          toast.error(msg);
          return;
        }
        toast.success("Event created.");
        onSuccess(data.event);
      }
      onClose();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
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
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/90">
          <h2 className="font-serif text-xl text-white font-light">
            {isEdit ? "Edit event" : "Add event"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10"
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-serif text-white/70 text-sm mb-1">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-serif text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              placeholder="Event title"
              required
            />
          </div>
          <div>
            <label className="block font-serif text-white/70 text-sm mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-serif text-white placeholder-white/40 focus:border-white/40 focus:outline-none resize-none"
              placeholder="Event description"
            />
          </div>
          <div>
            <label className="block font-serif text-white/70 text-sm mb-1">
              Date & time *
            </label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-serif text-white focus:border-white/40 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-serif text-white/70 text-sm mb-1">
              Location *
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-serif text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              placeholder="Venue or address"
              required
            />
          </div>
          <div>
            <label className="block font-serif text-white/70 text-sm mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, image_url: e.target.value }))
              }
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-serif text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block font-serif text-white/70 text-sm mb-1">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-serif text-white focus:border-white/40 focus:outline-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-serif text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl border border-white/20 bg-white/20 px-4 py-3 font-serif text-white hover:bg-white/30 disabled:opacity-50"
            >
              {loading ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
