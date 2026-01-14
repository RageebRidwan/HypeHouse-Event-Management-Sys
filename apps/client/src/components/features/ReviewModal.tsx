"use client";

import { useState } from "react";
import { X, Calendar, User, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { StarRatingInput } from "./StarRatingInput";
import { useCreateReviewMutation } from "../../store/api/reviewsApi";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    date: string;
    hostName: string;
  };
}

export function ReviewModal({ isOpen, onClose, event }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await createReview({
        eventId: event.id,
        rating,
        comment: comment.trim() || undefined,
      }).unwrap();

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setRating(0);
        setComment("");
        setSubmitted(false);
      }, 2000);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to submit review");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setRating(0);
      setComment("");
      setSubmitted(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="backdrop-blur-xl bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-800/90 border border-white/20 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Success State */}
              {submitted ? (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Review Submitted!
                  </h3>
                  <p className="text-gray-300">
                    Thank you for your feedback
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">Write a Review</h2>
                      <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg disabled:opacity-50"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6 border-b border-white/10 bg-black/20">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Host: {event.hostName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Rating */}
                    <div>
                      <label className="block text-white font-medium mb-3">
                        Your Rating <span className="text-red-400">*</span>
                      </label>
                      <StarRatingInput value={rating} onChange={setRating} />
                    </div>

                    {/* Comment */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-white font-medium">
                          Your Review (Optional)
                        </label>
                        <span className="text-xs text-gray-400">
                          {comment.length}/500
                        </span>
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            setComment(e.target.value);
                          }
                        }}
                        placeholder="Share your experience with this event..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || rating === 0}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/50"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
