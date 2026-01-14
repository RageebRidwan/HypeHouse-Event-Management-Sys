"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { useGetAllEventsQuery } from "../../store/api/eventsApi";
import { format } from "date-fns";
import Image from "next/image";
import type { Event } from "../../types/event";

export function FeaturedEvents() {
  const router = useRouter();
  const { data, isLoading } = useGetAllEventsQuery({ limit: 6 });
  const events: Event[] = data?.data?.events || [];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Events This Week
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover amazing events happening near you
          </p>
        </motion.div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Event type badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xl bg-white/20 text-white border border-white/30">
                        {event.eventType}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span>{format(new Date(event.date), "MMM dd, yyyy")}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-pink-400" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>
                          {event._count.participants} / {event.maxParticipants} joined
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        {event.price > 0 ? (
                          <span className="text-2xl font-bold text-white">${event.price}</span>
                        ) : (
                          <span className="text-2xl font-bold text-green-400">Free</span>
                        )}
                      </div>
                      <div className="text-purple-400 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-400 text-sm">
                  Exciting events will be posted here soon
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={() => router.push("/events")}
            className="inline-flex items-center gap-2 px-8 py-3 backdrop-blur-xl bg-white/10 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Events
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
