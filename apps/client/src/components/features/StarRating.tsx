import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "small" | "medium" | "large";
  showNumber?: boolean;
}

export function StarRating({ rating, size = "medium", showNumber = false }: StarRatingProps) {
  const sizeClasses = {
    small: "w-3.5 h-3.5",
    medium: "w-5 h-5",
    large: "w-7 h-7",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-xl",
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? "fill-gradient-to-r from-purple-500 to-pink-500 text-purple-500"
              : "text-gray-600"
          }`}
          style={
            star <= rating
              ? {
                  fill: "url(#star-gradient)",
                }
              : undefined
          }
        />
      ))}
      {showNumber && (
        <span className={`${textSizeClasses[size]} font-semibold text-white ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
