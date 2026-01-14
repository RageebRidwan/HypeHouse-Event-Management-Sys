"use client";

import { useState } from "react";
import { X, Flag, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateReportMutation } from "../../store/api/reportsApi";
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedType: "EVENT" | "REVIEW" | "USER";
  reportedId: string;
  reportedName: string;
}

const REPORT_REASONS = {
  EVENT: [
    "Inappropriate content",
    "Misleading information",
    "Spam or scam",
    "Cancelled without notice",
    "Unsafe event",
    "Other",
  ],
  REVIEW: [
    "Spam or fake review",
    "Inappropriate language",
    "Harassment or hate speech",
    "Off-topic content",
    "Other",
  ],
  USER: [
    "Inappropriate behavior",
    "Harassment",
    "Spam account",
    "Impersonation",
    "Suspicious activity",
    "Other",
  ],
};

export default function ReportModal({
  isOpen,
  onClose,
  reportedType,
  reportedId,
  reportedName,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [createReport, { isLoading }] = useCreateReportMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) {
      toast.error("Please select a reason");
      return;
    }

    try {
      await createReport({
        reportedType,
        reportedId,
        reason: selectedReason,
        description: description.trim() || undefined,
      }).unwrap();

      toast.success("Report submitted successfully");
      onClose();
      setSelectedReason("");
      setDescription("");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to submit report");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSelectedReason("");
      setDescription("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <Flag className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Report {reportedType.toLowerCase()}</h2>
                  <p className="text-sm text-gray-300 mt-0.5">{reportedName}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Warning */}
              <div className="flex gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium">Please report responsibly</p>
                  <p className="mt-1 text-yellow-300/80">
                    False reports may result in action against your account.
                  </p>
                </div>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Reason for report *
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS[reportedType].map((reason) => (
                    <label
                      key={reason}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                        ${
                          selectedReason === reason
                            ? "bg-purple-600/30 border-purple-400"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-white">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more context about why you're reporting this..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !selectedReason}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
