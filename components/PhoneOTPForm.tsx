"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface PhoneOTPFormProps {
  onSuccess: (identifier: string, userId: string, name?: string) => void;
  onCancel: () => void;
  title?: string;
}

export default function PhoneOTPForm({
  onSuccess,
  onCancel,
  title = "Log in with your phone",
}: PhoneOTPFormProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [loading, setLoading] = useState(false);
  // Stored after OTP when API returns need_name (new user, no name yet)
  const [pendingAuth, setPendingAuth] = useState<{
    auth_user_id: string;
    phone: string;
    access_token?: string;
  } | null>(null);
  const supabase = createClient();

  // Match mobile app E.164 formatting (PhoneAuthScreen.tsx)
  const formatPhoneForSupabase = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 15);
    if (digits.length === 0) return "";
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
    if (digits.length >= 11) return `+${digits}`;
    return `+${digits}`;
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 15);
    setPhone(digits);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      toast.error("Please enter a valid phone number (10–15 digits)");
      return;
    }
    const formatted = formatPhoneForSupabase(phone);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formatted,
        options: { channel: "sms" },
      });
      if (error) {
        toast.error(error.message || "Failed to send OTP");
        return;
      }
      toast.success("OTP sent to your phone");
      setStep("otp");
      setOtp("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      toast.error("Invalid phone number");
      return;
    }
    const formatted = formatPhoneForSupabase(phone);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formatted,
        options: { channel: "sms" },
      });
      if (error) {
        toast.error(error.message || "Failed to resend code");
        return;
      }
      toast.success("Verification code resent");
      setOtp("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    const formatted = formatPhoneForSupabase(phone);
    if (!formatted || formatted.length < 10) {
      toast.error("Invalid phone number");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formatted,
        token: code,
        type: "sms",
      });
      if (error) {
        toast.error(error.message || "Invalid OTP");
        return;
      }
      // E.164 phone (match mobile: auth.user.phone)
      const phoneE164 = data.user?.phone ?? formatted;
      // Pass access_token so API can use user's session (like mobile) - no service role needed
      const accessToken = data.session?.access_token;
      const res = await fetch("/api/events-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_user_id: data.user?.id ?? undefined,
          phone: phoneE164,
          name: name || undefined,
          access_token: accessToken ?? undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("You're logged in!");
        onSuccess(phoneE164, json.user.id, json.user.name || name || undefined);
        return;
      }
      if (res.status === 400 && json.need_name) {
        setPendingAuth({
          auth_user_id: data.user?.id ?? "",
          phone: phoneE164,
          access_token: data.session?.access_token,
        });
        setStep("name");
        return;
      }
      toast.error(json.error || json.message || "Failed to sign in");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Please enter your name");
      return;
    }
    if (!pendingAuth) {
      toast.error("Session expired. Please start over.");
      setStep("phone");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/events-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_user_id: pendingAuth.auth_user_id,
          phone: pendingAuth.phone,
          name: trimmedName,
          access_token: pendingAuth.access_token,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || "Failed to save");
        return;
      }
      toast.success("You're all set!");
      setPendingAuth(null);
      onSuccess(pendingAuth.phone, json.user.id, json.user.name || trimmedName);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative z-10 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div
        className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl p-8"
        style={{
          boxShadow:
            "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
        }}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="mb-2 font-serif text-2xl text-white font-light text-center">
            {title}
          </h2>
          <p className="mb-6 font-serif text-white/70 text-sm text-center">
            {step === "phone"
              ? "Enter your phone number to receive a one-time code"
              : step === "otp"
                ? "Enter the 6-digit code we sent to your phone"
                : "Add your name to complete your profile"}
          </p>

          {step === "name" ? (
            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label
                  htmlFor="name-new"
                  className="block mb-2 font-serif text-white/80 text-sm"
                >
                  Your name
                </label>
                <input
                  id="name-new"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white placeholder-white/50 backdrop-blur-xl focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white backdrop-blur-xl hover:bg-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex-1 rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-4 py-3 font-serif text-white backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? "Saving…" : "Save"}
                </motion.button>
              </div>
            </form>
          ) : step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 font-serif text-white/80 text-sm"
                >
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(322) 323-2434"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white placeholder-white/50 backdrop-blur-xl focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white backdrop-blur-xl hover:bg-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-4 py-3 font-serif text-white backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? "Sending…" : "Send OTP"}
                </motion.button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block mb-2 font-serif text-white/80 text-sm"
                >
                  OTP code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white placeholder-white/50 backdrop-blur-xl focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 text-center text-lg tracking-widest"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white backdrop-blur-xl hover:bg-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading || otp.replace(/\D/g, "").length !== 6}
                  className="flex-1 rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-4 py-3 font-serif text-white backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? "Verifying…" : "Verify"}
                </motion.button>
              </div>
              <p className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="font-serif text-sm text-white/70 underline hover:text-white disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Resend code"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
