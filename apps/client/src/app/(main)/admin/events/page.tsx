"use client";

import { useState } from "react";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "@/store/api/adminApi";
import {
  Calendar,
  Filter,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
  Users,
  Star,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function EventsManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useGetAllEventsQuery({
    page,
    limit: 12,
    search: search || undefined,
    category: categoryFilter || undefined,
    status: statusFilter || undefined,
  });

  const [deleteEvent] = useDeleteEventMutation();

  const events = data?.data.events || [];
  const totalPages = data?.data.totalPages || 1;

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to DELETE the event "${eventTitle}"? This action cannot be undone!`
      )
    ) {
      return;
    }

    try {
      await deleteEvent(eventId).unwrap();
      toast.success("Event deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete event");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Event Management
          </h1>
          <p className="text-gray-300">Moderate and manage platform events</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or location..."
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="">All Categories</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Arts">Arts</option>
                <option value="Food">Food</option>
                <option value="Tech">Tech</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Events Found
            </h3>
            <p className="text-gray-400">
              {search || categoryFilter || statusFilter
                ? "Try adjusting your filters"
                : "No events have been created yet"}
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all group"
            >
              {/* Event Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600">
                {event.imageUrl && (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      event.status === "ACTIVE"
                        ? "bg-green-500/80 text-white"
                        : event.status === "COMPLETED"
                        ? "bg-gray-500/80 text-white"
                        : "bg-red-500/80 text-white"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>{new Date(event.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>
                      Host: {event.host.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-white font-medium">
                      ${event.price}
                    </span>
                  </div>
                  {event._count && (
                    <>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">
                          {event._count.participants}/{event.maxParticipants}
                        </span>
                      </div>
                      {event._count.reviews > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300 text-sm">
                            {event._count.reviews}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 transition-all"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t border-white/10">
                  ID: {event.id}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {events.length > 0 && (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Page {page} of {totalPages} • {data?.data.total || 0} total events
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
