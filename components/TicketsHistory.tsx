"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface Ticket {
  id: string
  user_id?: string
  payment_intent_id: string
  created_at: string
  status?: string | null
  updated_at?: string | null
}

interface TicketsHistoryProps {
  email: string
  userId: string
  eventId?: string
  onBuyNew: () => void
  onClose: () => void
}

export default function TicketsHistory({ email, userId, eventId, onBuyNew, onClose }: TicketsHistoryProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  // Same auth flow as purchase: use session (access_token) so API can resolve user and fetch tickets
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      const accessToken = session?.access_token
      return fetch('/api/get-events-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, access_token: accessToken, event_id: eventId }),
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTickets(data.tickets || [])
        else toast.error(data.error || 'Failed to load tickets')
      })
      .catch(() => toast.error('Failed to load tickets'))
      .finally(() => setLoading(false))
  }, [userId, eventId])


  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl my-8 mx-4 sm:mx-6 overflow-hidden"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
        }}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <div className="relative z-10 box-border px-8 py-8 sm:px-12 sm:py-10 md:px-14 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl text-white font-light">
              Your Tickets
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-1 -m-1"
              type="button"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {(email || userId) && (
            <p className="font-serif text-white/70 text-sm mb-8 mt-1">
              {email ? <>Email: <span className="text-white">{email}</span></> : 'Logged in with your account'}
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-white/70 text-lg mb-4">
                No tickets found
              </p>
              <motion.button
                onClick={onBuyNew}
                className="rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-6 py-3 font-serif text-white backdrop-blur-xl transition-all hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Buy Your First Ticket
              </motion.button>
            </div>
          ) : (
            <>
              <div className="space-y-5 mb-8">
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-serif text-white font-medium mb-2">
                          Ticket #{ticket.payment_intent_id?.slice(-8) || ticket.id?.slice(0, 8) || '—'}
                        </p>
                        <p className="font-serif text-white/70 text-sm mb-2">
                          Purchased: {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '—'}
                        </p>
                        <p className="font-serif text-emerald-400/80 text-xs">
                          Confirmed
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                type="button"
                onClick={onBuyNew}
                className="w-full rounded-xl border border-white/20 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 px-6 py-4 font-serif text-white backdrop-blur-xl transition-all hover:border-white/40 hover:from-pink-500/40 hover:via-purple-500/40 hover:to-blue-500/40 mt-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Buy New Ticket
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
