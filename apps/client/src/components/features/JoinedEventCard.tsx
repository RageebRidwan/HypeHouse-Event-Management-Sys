"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Star } from "lucide-react";
import { format } from "date-fns";
import { ReviewModal } from "./ReviewModal";
import { useGetUserReviewQuery } from "../../store/api/reviewsApi";

interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  date: string;
  maxParticipants: number;
  status: string;
  imageUrl?: string | null;
  host: {
    id: string;
    name: string;
  };
  _count: {
    participants: number;
  };
}

interface JoinedEventCardProps {
  event: Event;
}

export function JoinedEventCard({ event }: JoinedEventCardProps) {
  const router = useRouter();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const isCompleted = event.status === "COMPLETED";

  // Only fetch user review if event is completed
  const { data: reviewData } = useGetUserReviewQuery(event.id, {
    skip: !isCompleted,
  });

  const hasReviewed = reviewData?.data !== null;

  return (
    <>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all group">
        {/* Image */}
        <div
          onClick={() => router.push(`/events/${event.id}`)}
          className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600 cursor-pointer overflow-hidden"
        >
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-xl text-white border border-white/30">
              {event.eventType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3
            onClick={() => router.push(`/events/${event.id}`)}
            className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-purple-400 transition-colors line-clamp-1"
          >
            {event.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              {format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="w-4 h-4" />
              {event._count.participants} / {event.maxParticipants} participants
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            {event.status === "COMPLETED" && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                Completed
              </span>
            )}
            {event.status === "OPEN" && new Date(event.date) > new Date() && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Upcoming
              </span>
            )}
          </div>

          {/* Review Button */}
          {isCompleted && (
            <button
              onClick={() => setShowReviewModal(true)}
              disabled={hasReviewed}
              className={`w-full py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                hasReviewed
                  ? "bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-600/30"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50"
              }`}
            >
              <Star className="w-4 h-4" />
              {hasReviewed ? "Review Submitted" : "Write Review"}
            </button>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        event={{
          id: event.id,
          title: event.title,
          date: event.date,
          hostName: event.host.name,
        }}
      />
    </>
  );
}
