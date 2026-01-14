"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    avatar: "SM",
    role: "Hiking Enthusiast",
    quote: "I found my hiking crew through Hypehouse! Best decision ever. We meet every weekend now and have explored so many amazing trails together.",
    rating: 5,
    event: "Mountain Hiking Meetup",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    name: "Mike R.",
    avatar: "MR",
    role: "Music Lover",
    quote: "No more missing out on concerts because my friends are busy! Hypehouse connected me with people who love the same music. We've been to 10+ concerts together!",
    rating: 5,
    event: "Indie Rock Concert",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Priya K.",
    avatar: "PK",
    role: "Tech Professional",
    quote: "Met amazing people at a tech meetup. Now we meet weekly to work on side projects together. The connections I've made are invaluable!",
    rating: 5,
    event: "Tech & Coffee Meetup",
    gradient: "from-orange-500 to-pink-500",
  },
];

export function TestimonialCarousel() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const handleDotClick = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [handleNext]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
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
            What Our Members Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real stories from real people in our community
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-0 z-10 p-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all -translate-x-4 hidden md:flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 z-10 p-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all translate-x-4 hidden md:flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Testimonial cards */}
            <div className="w-full overflow-hidden relative" style={{ minHeight: "400px" }}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "tween", duration: 0.5, ease: "easeInOut" },
                    opacity: { duration: 0.3 },
                  }}
                  className="w-full absolute inset-0"
                >
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 h-full">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar */}
                      <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div
                          className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${testimonials[current].gradient} flex items-center justify-center`}
                        >
                          <span className="text-2xl font-bold text-white">
                            {testimonials[current].avatar}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-left">
                        {/* Stars */}
                        <div className="flex gap-1 mb-4 justify-center md:justify-start">
                          {[...Array(testimonials[current].rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
                          "{testimonials[current].quote}"
                        </blockquote>

                        {/* Author */}
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-white">
                            {testimonials[current].name}
                          </p>
                          <p className="text-gray-400">
                            {testimonials[current].role}
                          </p>
                          <p className="text-sm text-purple-400">
                            Attended: {testimonials[current].event}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots navigation */}
          <div className="flex gap-3 justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-400 mb-6">
            Want to share your own story?
          </p>
          <motion.button
            onClick={() => router.push('/events')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join an Event
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
