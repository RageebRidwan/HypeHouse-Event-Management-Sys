"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  useJoinEventMutation,
  useLeaveEventMutation
} from "../../store/api/participantsApi";
import { PaymentModal } from "./PaymentModal";
import { EventStatus } from "../../types/event";
import { useAppDispatch } from "../../store/hooks";
import { baseApi } from "../../store/api/baseApi";

interface JoinButtonProps {
  eventId: string;
  isHost: boolean;
  isFull: boolean;
  isJoined: boolean;
  participantCount: number;
  maxParticipants: number;
  isAuthenticated: boolean;
  eventPrice: number;
  eventTitle: string;
  eventDate: string;
  eventStatus: EventStatus;
}

export function JoinButton({
  eventId,
  isHost,
  isFull,
  isJoined,
  participantCount,
  maxParticipants,
  isAuthenticated,
  eventPrice,
  eventTitle,
  eventDate,
  eventStatus,
}: JoinButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [joinEvent, { isLoading: isJoining }] = useJoinEventMutation();
  const [leaveEvent, { isLoading: isLeaving }] = useLeaveEventMutation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isLoading = isJoining || isLeaving;
  const isPaidEvent = eventPrice > 0;
  const isEventEnded = eventStatus === EventStatus.COMPLETED || eventStatus === EventStatus.CANCELLED;

  const handleClick = async () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.info("Please login to join events");
      router.push("/login");
      return;
    }

    // Prevent host from joining their own event
    if (isHost) {
      toast.error("You cannot join your own event");
      return;
    }

    // Prevent joining if event is full
    if (isFull && !isJoined) {
      toast.error("This event is full");
      return;
    }

    try {
      if (isJoined) {
        // Confirm before leaving event
        if (!confirm("Are you sure you want to leave this event?")) {
          return;
        }
        // Leave event
        const result = await leaveEvent(eventId).unwrap();
        toast.success(result.message || "Successfully left the event");
      } else {
        // Check if this is a paid event
        if (isPaidEvent) {
          // Open payment modal for paid events
          setShowPaymentModal(true);
        } else {
          // Join free event directly
          const result = await joinEvent(eventId).unwrap();
          toast.success(result.message || "Successfully joined the event!");
        }
      }
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage = apiError?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handlePaymentSuccess = async () => {
    // Close modal
    setShowPaymentModal(false);

    // Show processing message
    toast.info("Processing your registration...");

    // Poll the backend to check if participant was created by webhook
    const checkInterval = 500; // Check every 500ms
    const maxAttempts = 12; // 12 attempts = 6 seconds max
    let attempts = 0;
    let participantCreated = false;

    while (attempts < maxAttempts && !participantCreated) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));

      try {
        // Check if user is now a participant
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/participants/events/${eventId}/check-participation`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data?.isParticipant) {
            participantCreated = true;
            break;
          }
        }
      } catch (error) {
        // Continue polling on error
      }

      attempts++;
    }

    // Invalidate all caches to refresh UI
    dispatch(baseApi.util.invalidateTags([
      { type: "Event", id: eventId },
      { type: "Event", id: "LIST" },
      { type: "Participant", id: eventId },
      "MyEvents",
    ]));

    // Small delay to let queries refetch
    await new Promise(resolve => setTimeout(resolve, 300));

    if (participantCreated) {
      toast.success("Successfully joined the event!");
    } else {
      toast.success("Payment successful! Your registration is being processed.");
    }
  };

  // Don't show button to host
  if (isHost) {
    return null;
  }

  // Don't show join/leave button for ended events
  if (isEventEnded) {
    return (
      <div className="px-6 py-3 rounded-lg font-medium text-center w-full bg-gray-600/20 border-2 border-gray-600 text-gray-400 cursor-not-allowed">
        Event {eventStatus === EventStatus.CANCELLED ? 'Cancelled' : 'Ended'}
      </div>
    );
  }

  // Determine button text and style
  const getButtonContent = () => {
    if (!isAuthenticated) {
      return "Login to Join";
    }
    if (isFull && !isJoined) {
      return "Event Full";
    }
    if (isJoined) {
      return "Leave Event";
    }
    return "Join Event";
  };

  const getButtonClasses = () => {
    const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full";

    if (isJoined) {
      return `${baseClasses} bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30 hover:border-red-600 hover:text-red-300`;
    }

    if (isFull && !isJoined) {
      return `${baseClasses} bg-gray-600/20 border-2 border-gray-600 text-gray-400 cursor-not-allowed`;
    }

    return `${baseClasses} bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50`;
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={isLoading || (isFull && !isJoined)}
        className={getButtonClasses()}
        whileHover={{ scale: isLoading || (isFull && !isJoined) ? 1 : 1.02 }}
        whileTap={{ scale: isLoading || (isFull && !isJoined) ? 1 : 0.98 }}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
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
            {isJoining ? "Joining..." : "Leaving..."}
          </span>
        ) : (
          getButtonContent()
        )}
      </motion.button>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        event={{
          id: eventId,
          title: eventTitle,
          date: eventDate,
          price: eventPrice,
        }}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
