"use client";

import { motion } from 'framer-motion'
import { Event } from './EventDetail'

interface EventsListProps {
  events: Event[]
  loading: boolean
  onEventClick: (event: Event) => void
}

export default function EventsList({ events, loading, onEventClick }: EventsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <p className="font-serif text-2xl text-white/70">
          No events available at the moment.
        </p>
        <p className="font-serif text-lg text-white/50 mt-4">
          Check back soon for exciting events!
        </p>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onClick={() => onEventClick(event)}
            className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden cursor-pointer transition-all hover:border-white/20 hover:scale-105 w-full"
            style={{
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
            }}
          >
          {event.image_url && (
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url('${event.image_url}')` }}
            />
          )}
          <div className="p-6">
            <h3 className="font-serif text-2xl text-white font-light mb-2">
              {event.title}
            </h3>
            <p className="font-serif text-white/70 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-serif text-white/80 text-sm">
                ${event.price.toFixed(2)}
              </span>
              <span className="font-serif text-white/60 text-xs">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
      </div>
    </div>
  )
}
