"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Music, Footprints, Mountain, Utensils, Gamepad2, Laptop, Palette, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Music & Concert",
    displayName: "Concert",
    icon: Music,
    gradient: "from-purple-500 to-pink-500",
    hoverGradient: "from-purple-600 to-pink-600",
  },
  {
    name: "Sports & Fitness",
    displayName: "Sports",
    icon: Footprints,
    gradient: "from-blue-500 to-cyan-500",
    hoverGradient: "from-blue-600 to-cyan-600",
  },
  {
    name: "Social & Networking",
    displayName: "Social",
    icon: Mountain,
    gradient: "from-green-500 to-emerald-500",
    hoverGradient: "from-green-600 to-emerald-600",
  },
  {
    name: "Food & Drink",
    displayName: "Food & Drink",
    icon: Utensils,
    gradient: "from-orange-500 to-red-500",
    hoverGradient: "from-orange-600 to-red-600",
  },
  {
    name: "Tech & Innovation",
    displayName: "Tech",
    icon: Laptop,
    gradient: "from-pink-500 to-rose-500",
    hoverGradient: "from-pink-600 to-rose-600",
  },
  {
    name: "Education & Learning",
    displayName: "Education",
    icon: Palette,
    gradient: "from-indigo-500 to-purple-500",
    hoverGradient: "from-indigo-600 to-purple-600",
  },
  {
    name: "Networking",
    displayName: "Networking",
    icon: Gamepad2,
    gradient: "from-yellow-500 to-orange-500",
    hoverGradient: "from-yellow-600 to-orange-600",
  },
  {
    name: "Meetup",
    displayName: "Meetup",
    icon: Sparkles,
    gradient: "from-violet-500 to-fuchsia-500",
    hoverGradient: "from-violet-600 to-fuchsia-600",
  },
];

export function CategoryGrid() {
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/events?eventType=${categoryName}`);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
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
            Explore by Category
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find events that match your interests and passions
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 hover:border-transparent transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Category name */}
                  <h3 className="text-lg font-bold text-white mb-1">
                    {category.displayName}
                  </h3>

                  {/* Hover arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-white">Explore →</span>
                  </div>
                </div>

                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              </motion.button>
            );
          })}
        </div>

        {/* Bottom text */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-400">
            Can't find what you're looking for?{" "}
            <button
              onClick={() => router.push("/events/create")}
              className="text-purple-400 hover:text-purple-300 font-semibold underline"
            >
              Create your own event
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
