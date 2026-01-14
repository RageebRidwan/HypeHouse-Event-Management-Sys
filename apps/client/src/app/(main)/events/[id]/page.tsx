"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Edit, Trash2, Share2, Tag, MessageSquare, Flag } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useGetEventByIdQuery, useDeleteEventMutation } from "../../../../store/api/eventsApi";
import { useGetEventParticipantsQuery, useCheckParticipationQuery } from "../../../../store/api/participantsApi";
import { useGetEventReviewsQuery } from "../../../../store/api/reviewsApi";
import { useAppSelector } from "../../../../store/hooks";
import { EventStatus } from "../../../../types/event";
import { JoinButton } from "../../../../components/features/JoinButton";
import { ParticipantAvatars } from "../../../../components/features/ParticipantAvatars";
import { ParticipantListModal } from "../../../../components/features/ParticipantListModal";
import { ReviewCard } from "../../../../components/features/ReviewCard";
import { ReviewModal } from "../../../../components/features/ReviewModal";
import ReportModal from "../../../../components/features/ReportModal";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: eventId } = use(params);
  const { data, isLoading } = useGetEventByIdQuery(eventId);
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fetch participants
  const { data: participantsData } = useGetEventParticipantsQuery(eventId);
  const { data: participationData } = useCheckParticipationQuery(eventId, {
    skip: !currentUser,
  });
  const { data: reviewsData, isLoading: isLoadingReviews } = useGetEventReviewsQuery(eventId);

  const event = data?.data;
  const isHost = currentUser?.id === event?.host.id;
  const participants = participantsData?.data || [];
  const participantUsers = participants.map(p => p.user);
  const isJoined = participationData?.data?.isParticipant || false;
  const isFull = event?.status === EventStatus.FULL;
  const reviews = reviewsData?.data || [];

  // Check if user can review: must be participant of completed event and not already reviewed
  const isEventCompleted = event?.status === EventStatus.COMPLETED;
  const hasUserReviewed = reviews.some(review => review.reviewerId === currentUser?.id);
  const canReview = currentUser && isJoined && isEventCompleted && !hasUserReviewed;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteEvent(eventId).unwrap();
      toast.success("Event deleted successfully");
      router.push("/events");
    } catch (error: unknown) {
      const apiError = error as { data?: { error?: string } };
      toast.error(apiError?.data?.error || "Failed to delete event");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Event link copied to clipboard!");
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.OPEN:
        return (
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            Open for Registration
          </span>
        );
      case EventStatus.FULL:
        return (
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
            Event Full
          </span>
        );
      case EventStatus.CANCELLED:
        return (
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            Cancelled
          </span>
        );
      case EventStatus.COMPLETED:
        return (
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Completed
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-gray-300 mb-6">The event you're looking for doesn't exist</p>
          <button
            onClick={() => router.push("/events")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Hero Section */}
      <div className="relative h-96">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium backdrop-blur-xl bg-white/20 text-white border border-white/30">
                    {event.eventType}
                  </span>
                  {getStatusBadge(event.status)}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
                <p className="text-gray-200 text-lg">
                  Hosted by{" "}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/profile/${event.host.id}`);
                    }}
                    className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/50 hover:decoration-purple-300 transition-colors"
                  >
                    {event.host.name}
                  </button>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                  title="Share event"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {!isHost && currentUser && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                    title="Report event"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                )}

                {isHost && (
                  <>
                    <button
                      onClick={() => router.push(`/events/${event.id}/edit`)}
                      className="p-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      title="Edit event"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                      title="Delete event"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
              <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-200 border border-white/20 flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Host Info - Only show if not the host */}
            {!isHost && (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Meet Your Host</h2>
                <button
                  onClick={() => router.push(`/profile/${event.host.id}`)}
                  className="flex items-center gap-4 w-full hover:bg-white/5 rounded-xl p-2 -m-2 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                    {event.host.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {event.host.name}
                    </h3>
                    <p className="text-gray-300">{event.host.email}</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Event Details</h2>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date & Time</p>
                  <p className="text-white font-medium">
                    {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-gray-300">
                    {format(new Date(event.date), "h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <MapPin className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white font-medium">{event.location}</p>
                  {(event.latitude && event.longitude) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Participants</p>
                  <p className="text-white font-medium">
                    {event._count.participants} / {event.maxParticipants}
                  </p>
                  <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((event._count.participants / event.maxParticipants) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  {participantUsers.length > 0 && (
                    <div className="mt-3">
                      <ParticipantAvatars
                        participants={participantUsers}
                        maxDisplay={5}
                        onClick={() => setShowParticipantsModal(true)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  {event.price > 0 ? (
                    <p className="text-white font-medium text-2xl">${event.price}</p>
                  ) : (
                    <p className="text-green-400 font-medium text-2xl">Free</p>
                  )}
                </div>
              </div>
            </div>

            {/* Join Button */}
            <JoinButton
              eventId={event.id}
              isHost={isHost}
              isFull={isFull}
              isJoined={isJoined}
              participantCount={event._count.participants}
              maxParticipants={event.maxParticipants}
              isAuthenticated={!!currentUser}
              eventPrice={event.price}
              eventTitle={event.title}
              eventDate={event.date}
              eventStatus={event.status}
            />

            {/* Write Review Button - Only for participants of completed events */}
            {canReview && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Write a Review
              </button>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Reviews</h2>
              <p className="text-gray-300 mt-1">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          {isLoadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={currentUser?.id}
                />
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
              <p className="text-gray-400">
                Be the first to review this event after it's completed!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Participant List Modal */}
      <ParticipantListModal
        isOpen={showParticipantsModal}
        onClose={() => setShowParticipantsModal(false)}
        participants={participants}
        eventTitle={event.title}
      />

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

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedType="EVENT"
        reportedId={event.id}
        reportedName={event.title}
      />
    </div>
  );
}
