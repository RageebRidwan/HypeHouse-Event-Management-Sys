"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Calendar, Users } from "lucide-react";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 overflow-hidden">
      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Activity Partner
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join local events, meet like-minded people, never miss out again
            </motion.p>

            {/* Search bar preview */}
            <motion.div
              className="mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center gap-3">
                <Search className="w-6 h-6 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search for events, activities, or interests..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  disabled
                />
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                  Search
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                onClick={() => router.push("/events")}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Events
              </motion.button>
              <motion.button
                onClick={() => router.push("/events/create")}
                className="px-8 py-4 backdrop-blur-xl bg-white/10 border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Host an Event
              </motion.button>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-2xl font-bold text-white">500+</span>
                </div>
                <p className="text-sm text-gray-300">Events</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-pink-400 mr-2" />
                  <span className="text-2xl font-bold text-white">2K+</span>
                </div>
                <p className="text-sm text-gray-300">Members</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-white">⭐ 4.8</span>
                </div>
                <p className="text-sm text-gray-300">Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative">
              {/* Illustration placeholder - gradient orb with icons */}
              <div className="relative w-full h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl backdrop-blur-xl border border-white/10"></div>

                {/* Floating event cards */}
                <motion.div
                  className="absolute top-10 right-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 w-48"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="w-full h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-2"></div>
                  <div className="h-2 bg-white/20 rounded mb-1"></div>
                  <div className="h-2 bg-white/20 rounded w-2/3"></div>
                </motion.div>

                <motion.div
                  className="absolute bottom-10 left-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 w-48"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="w-full h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-2"></div>
                  <div className="h-2 bg-white/20 rounded mb-1"></div>
                  <div className="h-2 bg-white/20 rounded w-3/4"></div>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 w-56"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-pink-600 to-orange-600 rounded-lg mb-2"></div>
                  <div className="h-3 bg-white/20 rounded mb-1"></div>
                  <div className="h-2 bg-white/20 rounded w-4/5"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-2 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
