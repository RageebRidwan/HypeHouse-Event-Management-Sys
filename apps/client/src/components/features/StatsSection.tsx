"use client";

import { motion, useMotionValue, useTransform, animate, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, Star } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  gradient: string;
  delay: number;
}

function StatCard({ icon: Icon, value, suffix = "", label, gradient, delay }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  // Subscribe to motion value changes
  useMotionValueEvent(rounded, "change", (latest) => {
    setDisplayValue(latest);
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        delay,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, value, delay]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 hover:border-white/20 transition-all duration-300 group`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

      {/* Icon */}
      <div className="relative z-10 mb-4">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Value */}
      <div className="relative z-10 mb-2">
        <span className="text-4xl md:text-5xl font-bold text-white">
          {isInView ? displayValue : 0}
          {suffix}
        </span>
      </div>

      {/* Label */}
      <p className="relative z-10 text-gray-400 text-sm md:text-base">
        {label}
      </p>

      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${gradient} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
    </motion.div>
  );
}

export function StatsSection() {
  const router = useRouter();

  const stats = [
    {
      icon: Calendar,
      value: 500,
      suffix: "+",
      label: "Events Hosted",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      value: 2000,
      suffix: "+",
      label: "Active Users",
      gradient: "from-pink-500 to-orange-500",
    },
    {
      icon: MapPin,
      value: 50,
      suffix: "+",
      label: "Cities Covered",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Star,
      value: 4.8,
      suffix: "⭐",
      label: "Average Rating",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Be part of something bigger. Connect with thousands of people making memories.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400 mb-6">
            Ready to be part of our community?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => router.push('/register')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.button>
            <motion.button
              onClick={() => router.push('/events')}
              className="px-8 py-3 backdrop-blur-xl bg-white/10 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Events
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
