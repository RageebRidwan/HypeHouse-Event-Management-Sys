"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { selectUser, selectIsAuthenticated } from "@/store/slices/authSlice";
import { useLogout } from "@/hooks/useAuth";
import { useGetMyEventsQuery, useDeleteEventMutation } from "@/store/api/eventsApi";
import { useGetMyJoinedEventsQuery } from "@/store/api/participantsApi";
import { LogOut, User, Calendar, Plus, TrendingUp, Users as UsersIcon, Ticket } from "lucide-react";
import EventCard from "@/components/features/EventCard";
import { JoinedEventCard } from "@/components/features/JoinedEventCard";
import EmptyState from "@/components/features/EmptyState";
import EmailVerificationBanner from "@/components/onboarding/EmailVerificationBanner";
import ProfileCompletionBanner from "@/components/onboarding/ProfileCompletionBanner";
import HostTermsBanner from "@/components/onboarding/HostTermsBanner";
import { useGetProfileCompletionQuery } from "@/store/api/usersApi";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const { logout } = useLogout();
  const { data: eventsData, isLoading } = useGetMyEventsQuery();
  const { data: joinedEventsData, isLoading: isLoadingJoined } = useGetMyJoinedEventsQuery();
  const { data: profileCompletionData } = useGetProfileCompletionQuery();
  const [deleteEvent] = useDeleteEventMutation();

  const events = eventsData?.data || [];
  const joinedEvents = joinedEventsData?.data || [];
  const isHost = user?.role === "HOST" || user?.role === "ADMIN";
  const profileCompletion = profileCompletionData?.data;
  const isProfileComplete = profileCompletion?.isComplete || false;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId).unwrap();
      toast.success("Event deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete event");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const totalParticipants = events.reduce((sum, event) => sum + event._count.participants, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>
        </div>

        {/* Email Verification Banner */}
        {!user.emailVerified && (
          <div className="mb-8">
            <EmailVerificationBanner />
          </div>
        )}

        {/* Profile Completion Banner */}
        {user.emailVerified && (
          <div className="mb-8">
            <ProfileCompletionBanner />
          </div>
        )}

        {/* Host Terms Banner */}
        {user.emailVerified && isProfileComplete && !user.acceptedHostTerms && (
          <div className="mb-8">
            <HostTermsBanner />
          </div>
        )}

        {/* Welcome Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h2>
              <p className="text-gray-300">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400">Role</p>
              <p className="font-semibold mt-1 text-white">{user.role}</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400">Account Status</p>
              <p className="font-semibold mt-1 text-white">
                {user.emailVerified ? "✓ Verified" : "Unverified"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards (for hosts) */}
        {isHost && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Hosted Events</p>
                  <p className="text-2xl font-bold text-white">{events.length}</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-pink-500/20">
                  <UsersIcon className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Participants</p>
                  <p className="text-2xl font-bold text-white">{totalParticipants}</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Events</p>
                  <p className="text-2xl font-bold text-white">
                    {events.filter(e => e.status === "OPEN").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Hosted Events Section (for hosts) */}
        {isHost && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Hosted Events</h2>
              <button
                onClick={() => router.push("/events/create")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-96 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isHost={true}
                    onEdit={(event) => router.push(`/events/${event.id}/edit`)}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No events yet"
                description="Create your first event and start bringing people together"
                action={{
                  label: "Create Event",
                  onClick: () => router.push("/events/create"),
                }}
              />
            )}
          </div>
        )}

        {/* Joined Events Section (for everyone) */}
        {(
          <>
            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Ticket className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Joined Events</p>
                    <p className="text-2xl font-bold text-white">{joinedEvents.length}</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-pink-500/20">
                    <Calendar className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Upcoming Events</p>
                    <p className="text-2xl font-bold text-white">
                      {joinedEvents.filter(je => je.event && new Date(je.event.date) > new Date()).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Joined Events */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">My Joined Events</h2>
                <button
                  onClick={() => router.push("/events")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Discover Events
                </button>
              </div>

              {isLoadingJoined ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-96 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 animate-pulse"
                    />
                  ))}
                </div>
              ) : joinedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedEvents.filter(je => je.event).map((joinedEvent) => (
                    <JoinedEventCard
                      key={joinedEvent.event.id}
                      event={joinedEvent.event}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Ticket}
                  title="No joined events yet"
                  description="Discover and join amazing events to get started"
                  action={{
                    label: "Browse Events",
                    onClick: () => router.push("/events"),
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
