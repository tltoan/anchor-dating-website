"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface EmailEntryFormProps {
  onSuccess: (
    email: string,
    userId: string,
    name?: string,
    phone?: string,
  ) => void;
  onCancel: () => void;
  title?: string;
}

export default function EmailEntryForm({
  onSuccess,
  onCancel,
  title = "Enter Your Email",
}: EmailEntryFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/events-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "Failed to process email");
        return;
      }

      toast.success(
        data.isNewUser ? "Welcome! Account created." : "Welcome back!",
      );
      // Pass user data including name and phone
      onSuccess(data.user.email, data.user.id, data.user.name || name, phone);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl p-8"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
        }}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <div className="relative z-10" style={{ padding: "20px" }}>
          <h2 className="mb-6 font-serif text-3xl text-white font-light text-center">
            {title}
          </h2>
          <p className="mb-6 font-serif text-white/70 text-sm text-center">
            Enter your email to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div style={{ margin: "20px" }}>
              <label
                htmlFor="email"
                className="block mb-3 md:mb-4 font-serif text-white/80 text-sm"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white placeholder-white/50 backdrop-blur-xl focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your email"
              />
            </div>

            <div style={{ margin: "20px" }}>
              <label
                htmlFor="name"
                className="block mb-3 md:mb-4 font-serif text-white/80 text-sm"
              >
                Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white placeholder-white/50 backdrop-blur-xl focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your name"
              />
            </div>

            <div style={{ margin: "20px" }}>
              <label
                htmlFor="phone"
                className="block mb-3 md:mb-4 font-serif text-white/80 text-sm"
              >
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white placeholder-white/50 backdrop-blur-xl focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="flex gap-3 mt-6" style={{ margin: "20px" }}>
              <motion.button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-4 py-3 font-serif text-white backdrop-blur-xl transition-all hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? "Processing..." : "Continue"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
