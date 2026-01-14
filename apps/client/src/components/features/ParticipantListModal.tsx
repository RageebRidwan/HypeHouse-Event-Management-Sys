"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import type { Participant } from "../../types/participant";
import { PaymentStatus } from "../../types/participant";

interface ParticipantListModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  eventTitle: string;
}

export function ParticipantListModal({
  isOpen,
  onClose,
  participants,
  eventTitle,
}: ParticipantListModalProps) {
  if (!isOpen) return null;

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Paid
          </span>
        );
      case PaymentStatus.PENDING:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </span>
        );
      case PaymentStatus.FAILED:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            Failed
          </span>
        );
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Participants
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {eventTitle}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Participant List */}
              <div className="flex-1 overflow-y-auto p-6">
                {participants.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No participants yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {participants.map((participant, index) => (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {/* Avatar */}
                        {participant.user.avatar ? (
                          <Image
                            src={participant.user.avatar}
                            alt={participant.user.name || 'User'}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-medium">
                            {participant.user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {participant.user.name || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {participant.user.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Joined {new Date(participant.joinedAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Payment Status */}
                        <div>{getPaymentBadge(participant.paymentStatus)}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total: {participants.length}{" "}
                  {participants.length === 1 ? "participant" : "participants"}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
