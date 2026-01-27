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
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-10 w-full max-w-3xl">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onClick={() => onEventClick(event)}
            className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden cursor-pointer transition-all hover:border-white/30 hover:scale-[1.02] w-full "
            style={{
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)",
              padding: "20px",
              
            }}
          >
            {event.image_url && (
              <div
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url('${event.image_url}')` }}
              />
            )}
            <div className="px-12 py-14 md:px-16 md:py-20">
              <h3 className="font-serif text-4xl md:text-5xl text-white font-light mb-6 leading-tight">
                {event.title}
              </h3>
              <p className="font-serif text-white/80 text-lg md:text-xl mb-12 line-clamp-3 leading-relaxed">
                {event.description}
              </p>
              <div className="flex items-center justify-between pt-10 border-t border-white/20">
                <span className="font-serif text-white text-2xl md:text-3xl font-medium">
                  ${event.price.toFixed(2)}
                </span>
                <span className="font-serif text-white/70 text-lg">
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
