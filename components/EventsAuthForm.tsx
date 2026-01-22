"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface EventsAuthFormProps {
  onSuccess: (email: string, userId: string) => void
}

export default function EventsAuthForm({ onSuccess }: EventsAuthFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/events-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.error || 'Failed to sign in')
        return
      }

      setIsNewUser(data.isNewUser)
      
      if (data.isNewUser) {
        toast.success('Welcome! You\'re now signed in.')
      } else {
        toast.success('Welcome back!')
      }

      // Call success callback with email and user ID
      onSuccess(data.user.email, data.user.id)
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
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
                Access Events
              </h2>
              <p className="mb-6 font-serif text-white/70 text-sm text-center">
                Enter your email to view and purchase event tickets
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div>
                  <label htmlFor="name" className="block mb-2 font-serif text-white/80 text-sm">
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
                    {loading ? 'Please wait...' : 'Continue'}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
