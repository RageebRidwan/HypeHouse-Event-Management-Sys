"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Star, Edit, Award, Users, TrendingUp, MessageSquare, Flag } from "lucide-react";
import { format } from "date-fns";
import { useGetUserProfileQuery } from "../../../../store/api/usersApi";
import { useGetHostReviewsQuery } from "../../../../store/api/reviewsApi";
import { useAppSelector } from "../../../../store/hooks";
import { ReviewCard } from "../../../../components/features/ReviewCard";
import { StarRating } from "../../../../components/features/StarRating";
import ReportModal from "../../../../components/features/ReportModal";

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: userId } = use(params);
  const { data, isLoading } = useGetUserProfileQuery(userId);
  const { data: reviewsData, isLoading: isLoadingReviews } = useGetHostReviewsQuery(userId);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"hosted" | "reviews">("hosted");

  const profile = data?.data;
  const isOwnProfile = currentUser?.id === userId;
  const hostReviews = reviewsData?.data;
  const [showReportModal, setShowReportModal] = useState(false);

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">User Not Found</h1>
          <p className="text-gray-300 mb-6">The user you're looking for doesn't exist</p>
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
      {/* Hero Section with Cover & Profile Image */}
      <div className="relative h-64 sm:h-80">
        {/* Cover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 via-pink-600/60 to-orange-600/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors backdrop-blur-xl bg-black/20 px-4 py-2 rounded-xl border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Action buttons */}
        <div className="absolute top-6 right-4 sm:right-8 z-10 flex gap-2">
          {/* Report button (for other users' profiles) */}
          {!isOwnProfile && currentUser && (
            <button
              onClick={() => setShowReportModal(true)}
              className="p-3 rounded-xl backdrop-blur-xl bg-black/20 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
              title="Report user"
            >
              <Flag className="w-5 h-5" />
            </button>
          )}
          {/* Edit button (for own profile) */}
          {isOwnProfile && (
            <button
              onClick={() => router.push("/profile/edit")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12">
        {/* Profile Header Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-1">
                {profile.avatar ? (
                  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-bold text-white">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                )}
              </div>
              {profile.verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-500 border-4 border-purple-900 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-gray-300">{profile.email}</p>
                </div>
              </div>

              {profile.bio && (
                <p className="text-gray-200 mt-4 leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                Member since {format(new Date(profile.createdAt), "MMMM yyyy")}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Events Hosted */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Events Hosted</p>
                <p className="text-3xl font-bold text-white">{profile.stats.eventsHosted}</p>
              </div>
            </div>
          </div>

          {/* Events Joined */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-pink-500/20">
                <Users className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Events Joined</p>
                <p className="text-3xl font-bold text-white">{profile.stats.eventsJoined}</p>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-white">
                    {profile.stats.averageRating.toFixed(1)}
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(profile.stats.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("hosted")}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === "hosted"
                  ? "text-white bg-white/10 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Hosted Events ({profile.hostedEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === "reviews"
                  ? "text-white bg-white/10 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Reviews ({hostReviews?.totalReviews || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "hosted" && (
              <div>
                {profile.hostedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.hostedEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer group"
                      >
                        {/* Event Image */}
                        <div className="relative h-40">
                          {event.imageUrl ? (
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Participant count badge */}
                          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg backdrop-blur-xl bg-black/40 border border-white/20 flex items-center gap-2">
                            <Users className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">
                              {event._count.participants}
                            </span>
                          </div>
                        </div>

                        {/* Event Info */}
                        <div className="p-4">
                          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            {event.eventType}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-2 line-clamp-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(event.date), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No events hosted yet</p>
                    {isOwnProfile && (
                      <button
                        onClick={() => router.push("/events/create")}
                        className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                      >
                        Host Your First Event
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {isLoadingReviews ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : hostReviews && hostReviews.reviews.length > 0 ? (
                  <div>
                    {/* Rating Summary */}
                    <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 mb-6">
                      <div className="text-center">
                        <p className="text-gray-300 text-sm mb-2">Average Rating</p>
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <p className="text-6xl font-bold text-white">
                            {hostReviews.averageRating.toFixed(1)}
                          </p>
                          <div>
                            <StarRating rating={Math.round(hostReviews.averageRating)} size="large" />
                            <p className="text-gray-400 text-sm mt-1">
                              {hostReviews.totalReviews} {hostReviews.totalReviews === 1 ? "review" : "reviews"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {hostReviews.reviews.map((review) => (
                        <ReviewCard
                          key={review.id}
                          review={review}
                          currentUserId={currentUser?.id}
                          showEvent={true}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No reviews yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Reviews will appear here after hosting events
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedType="USER"
        reportedId={userId}
        reportedName={profile.name}
      />
    </div>
  );
}
