"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";

const benefits = [
  "Connect with like-minded people in your community",
  "Build your reputation as a trusted event host",
  "Monetize your events and passions (optional)",
  "Access powerful tools to manage your events",
];

export function HostCTA() {
  const router = useRouter();

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Subtle accent lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <motion.div
              className="inline-flex mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Ready to Host Your Own Event?
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Share your passion, build your community, make it happen
            </motion.p>
          </motion.div>

          {/* Benefits list */}
          <motion.div
            className="mb-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300 text-lg">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.button
              onClick={() => router.push("/events/create")}
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6" />
              Become a Host
            </motion.button>

            <p className="mt-6 text-gray-400">
              No credit card required. Start for free today.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
