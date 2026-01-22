"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface AuthFormProps {
  onSuccess?: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [resendingOTP, setResendingOTP] = useState(false)
  const { sendOTP, verifyOTP } = useAuth()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const result = await sendOTP(email)
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to send verification code')
      } else {
        setOtpSent(true)
        toast.success('Verification code sent! Please check your email.', {
          duration: 5000,
        })
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode || otpCode.length !== 8) {
      toast.error('Please enter the 8-digit verification code')
      return
    }

    setLoading(true)
    try {
      const result = await verifyOTP(email, otpCode)
      
      if (result.error) {
        toast.error(result.error.message || 'Invalid verification code')
      } else {
        toast.success('Signed in successfully!')
        onSuccess?.()
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setResendingOTP(true)
    try {
      const result = await sendOTP(email)
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to resend code')
      } else {
        toast.success('New verification code sent! Please check your email.')
        setOtpCode('') // Clear the OTP input
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setResendingOTP(false)
    }
  }

  const handleBackToEmail = () => {
    setOtpSent(false)
    setOtpCode('')
  }

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

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.div
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl p-8"
            style={{
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
            }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="mb-6 font-serif text-4xl text-white font-light text-center">
                {otpSent ? 'Enter Verification Code' : 'Sign In to Events'}
              </h2>

              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block mb-2 font-serif text-white/80 text-sm">
                      Email
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

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-6 py-4 font-serif text-lg font-normal text-white backdrop-blur-xl transition-all hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    style={{
                      boxShadow: "0 10px 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <span className="relative z-10">
                      {loading ? 'Sending...' : 'Send Verification Code'}
                    </span>
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-4">
                    <p className="font-serif text-white/90 text-sm text-center">
                      We've sent an 8-digit verification code to <strong>{email}</strong>
                    </p>
                  </div>

                  <div>
                    <label htmlFor="otp" className="block mb-2 font-serif text-white/80 text-sm">
                      Verification Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      value={otpCode}
                      onChange={(e) => {
                        // Only allow numbers and limit to 8 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 8)
                        setOtpCode(value)
                      }}
                      required
                      maxLength={8}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-serif text-white placeholder-white/50 backdrop-blur-xl focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 text-center text-2xl tracking-widest"
                      placeholder="00000000"
                      autoComplete="one-time-code"
                    />
                    <p className="mt-2 text-center font-serif text-white/60 text-xs">
                      Enter the 8-digit code from your email
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || otpCode.length !== 8}
                    className="group relative w-full overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-6 py-4 font-serif text-lg font-normal text-white backdrop-blur-xl transition-all hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading || otpCode.length !== 8 ? 1 : 1.02, y: loading || otpCode.length !== 8 ? 0 : -2 }}
                    whileTap={{ scale: loading || otpCode.length !== 8 ? 1 : 0.98 }}
                    style={{
                      boxShadow: "0 10px 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <span className="relative z-10">
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </span>
                  </motion.button>

                  <div className="flex flex-col gap-2 mt-4">
                    <motion.button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendingOTP}
                      className="w-full rounded-xl border border-blue-500/40 bg-blue-500/20 px-4 py-2 font-serif text-sm text-white backdrop-blur-xl transition-all hover:border-blue-500/60 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: resendingOTP ? 1 : 1.02 }}
                      whileTap={{ scale: resendingOTP ? 1 : 0.98 }}
                    >
                      {resendingOTP ? 'Sending...' : 'Resend Code'}
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleBackToEmail}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-serif text-sm text-white/70 backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/20 hover:text-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Change Email
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
