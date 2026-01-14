"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  const currentRating = hoverRating || value;

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Rating">
      {stars.map((star) => (
        <motion.button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          aria-pressed={star === value}
        >
          <Star
            className={`w-10 h-10 transition-all ${
              star <= currentRating
                ? "text-purple-500"
                : "text-gray-600"
            }`}
            style={
              star <= currentRating
                ? {
                    fill: "url(#star-gradient-input)",
                  }
                : undefined
            }
          />
        </motion.button>
      ))}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="star-gradient-input" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
