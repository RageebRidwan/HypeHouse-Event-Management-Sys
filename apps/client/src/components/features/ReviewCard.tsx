"use client";

import { useState } from "react";
import { Trash2, Calendar, Flag } from "lucide-react";
import { format } from "date-fns";
import { StarRating } from "./StarRating";
import { Review } from "../../store/api/reviewsApi";
import { useDeleteReviewMutation } from "../../store/api/reviewsApi";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ReportModal from "./ReportModal";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  showEvent?: boolean;
}

export function ReviewCard({ review, currentUserId, showEvent = false }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const isOwnReview = currentUserId === review.reviewerId;
  const shouldTruncate = review.comment && review.comment.length > 200;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReview(review.id).unwrap();
      toast.success("Review deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete review");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.reviewer.avatar ? (
            <img
              src={review.reviewer.avatar}
              alt={review.reviewer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
              {review.reviewer.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold">{review.reviewer.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <StarRating rating={review.rating} size="small" />
                <span className="text-xs text-gray-400">
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1">
              {!isOwnReview && currentUserId && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                  title="Report review"
                >
                  <Flag className="w-4 h-4" />
                </button>
              )}
              {isOwnReview && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Event info (if showing) */}
          {showEvent && review.event && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{review.event.title}</span>
              <span>•</span>
              <span>{format(new Date(review.event.date), "MMM d, yyyy")}</span>
            </div>
          )}

          {/* Comment */}
          {review.comment && (
            <div className="mt-3">
              <p className="text-gray-300 text-sm leading-relaxed">
                {shouldTruncate && !isExpanded
                  ? `${review.comment.substring(0, 200)}...`
                  : review.comment}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-purple-400 hover:text-purple-300 text-sm mt-2 transition-colors"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedType="REVIEW"
        reportedId={review.id}
        reportedName={`Review by ${review.reviewer.name}`}
      />
    </motion.div>
  );
}
