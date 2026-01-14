"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Users, PartyPopper, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Events",
    description: "Discover local activities that match your interests",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Join & Connect",
    description: "Meet people who share your passions",
    color: "from-pink-500 to-orange-500",
  },
  {
    icon: PartyPopper,
    title: "Attend & Enjoy",
    description: "Make memories and build friendships",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Share your experience with the community",
    color: "from-yellow-500 to-green-500",
  },
];

export function HowItWorks() {
  const router = useRouter();

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
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
            How Hypehouse Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Getting started is easy. Follow these simple steps to join the community.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-green-500 transform -translate-y-1/2 opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Step card */}
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                    {/* Step number */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-400">
                        Step {index + 1}
                      </span>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 flex-1">
                      {step.description}
                    </p>

                    {/* Decorative gradient bar */}
                    <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${step.color}`} />
                  </div>

                  {/* Arrow connector - desktop only */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 rotate-45 bg-gradient-to-br from-purple-500 to-pink-500 opacity-50" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-400 mb-4">
            Ready to get started?
          </p>
          <motion.button
            onClick={() => router.push('/events')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Exploring
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
