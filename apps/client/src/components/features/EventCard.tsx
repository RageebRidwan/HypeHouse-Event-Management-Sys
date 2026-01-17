"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, DollarSign, Edit, Trash2 } from "lucide-react";
import { Event, EventStatus } from "../../types/event";
import { format } from "date-fns";
import { useGetEventParticipantsQuery } from "../../store/api/participantsApi";

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  isHost?: boolean;
}

export default function EventCard({
  event,
  onEdit,
  onDelete,
  isHost = false,
}: EventCardProps) {
  const router = useRouter();

  // Fetch participants for avatar display
  const { data: participantsData } = useGetEventParticipantsQuery(event.id);
  const participants = participantsData?.data || [];
  const participantUsers = participants.slice(0, 3).map(p => p.user);

  const getStatusBadge = () => {
    switch (event.status) {
      case EventStatus.OPEN:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            Open
          </span>
        );
      case EventStatus.FULL:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
            Full
          </span>
        );
      case EventStatus.CANCELLED:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            Cancelled
          </span>
        );
      case EventStatus.COMPLETED:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Completed
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • h:mm a");
    } catch {
      return dateString;
    }
  };

  // Check if event is expired or has ended status
  const isExpired = event.status === EventStatus.COMPLETED || new Date(event.date) < new Date();
  const isCancelled = event.status === EventStatus.CANCELLED;

  // Get card styling based on status
  const getCardOpacity = () => {
    if (isCancelled) return "opacity-40 hover:opacity-50";
    if (isExpired) return "opacity-60 hover:opacity-75";
    if (event.status === EventStatus.FULL) return "opacity-90 hover:opacity-100";
    return "";
  };

  const shouldGrayscale = isCancelled || isExpired;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`group relative ${getCardOpacity()}`}
    >
      <Link href={`/events/${event.id}`}>
        <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
          {/* Image Section */}
          <div className={`relative h-48 w-full overflow-hidden ${shouldGrayscale ? 'grayscale' : ''}`}>
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Badges Container */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
              {/* Status Badge */}
              {getStatusBadge()}
            </div>

            {/* Event Type Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xl bg-white/10 text-white border border-white/20">
                {event.eventType}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Text content with grayscale */}
            <div className={shouldGrayscale ? 'grayscale' : ''}>
              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="space-y-2 mb-4">
              {/* Date */}
              <div className={`flex items-center gap-2 text-sm text-gray-300 ${shouldGrayscale ? 'grayscale' : ''}`}>
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{formatDate(event.date)}</span>
              </div>

              {/* Location */}
              <div className={`flex items-center gap-2 text-sm text-gray-300 ${shouldGrayscale ? 'grayscale' : ''}`}>
                <MapPin className="w-4 h-4 text-pink-400" />
                <span className="line-clamp-1">{event.location}</span>
              </div>

              {/* Participants */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-sm text-gray-300 ${shouldGrayscale ? 'grayscale' : ''}`}>
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>
                    {event._count.participants} / {event.maxParticipants}
                  </span>
                </div>
                {/* Participant Avatars - NO grayscale */}
                {participantUsers.length > 0 && (
                  <div className="flex -space-x-2">
                    {participantUsers.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="relative"
                        style={{ zIndex: participantUsers.length - index }}
                      >
                        {participant.avatar ? (
                          <Image
                            src={participant.avatar}
                            alt={participant.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full border-2 border-purple-500"
                            title={participant.name}
                          />
                        ) : (
                          <div
                            className="w-6 h-6 rounded-full border-2 border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-medium"
                            title={participant.name}
                          >
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    ))}
                    {event._count.participants > 3 && (
                      <div
                        className="w-6 h-6 rounded-full border-2 border-purple-500 bg-purple-600/50 flex items-center justify-center text-white text-[10px] font-medium"
                        title={`+${event._count.participants - 3} more`}
                      >
                        +{event._count.participants - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className={`flex items-center gap-2 text-sm ${shouldGrayscale ? 'grayscale' : ''}`}>
                <DollarSign className="w-4 h-4 text-green-400" />
                {event.price > 0 ? (
                  <span className="text-gray-300">${event.price}</span>
                ) : (
                  <span className="text-green-400 font-medium">Free</span>
                )}
              </div>
            </div>

            {/* Host Info */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/profile/${event.host.id}`);
              }}
              className="flex items-center gap-3 pt-4 border-t border-white/10 w-full hover:bg-white/5 -mx-6 px-6 -mb-6 pb-6 transition-colors group/host"
            >
              {/* Host avatar - NO grayscale */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-medium text-sm">
                {event.host.name.charAt(0).toUpperCase()}
              </div>
              {/* Host text - WITH grayscale if needed */}
              <div className={`text-left ${shouldGrayscale ? 'grayscale' : ''}`}>
                <p className="text-sm text-gray-400">Hosted by</p>
                <p className="text-sm font-medium text-white group-hover/host:text-purple-400 transition-colors">
                  {event.host.name}
                </p>
              </div>
            </button>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className={`flex flex-wrap gap-2 mt-4 ${shouldGrayscale ? 'grayscale' : ''}`}>
                {event.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-lg text-xs bg-white/5 text-gray-300 border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
                {event.tags.length > 3 && (
                  <span className="px-2 py-1 rounded-lg text-xs text-gray-400">
                    +{event.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Host Actions - Only show for events that can be edited (not completed or cancelled) */}
      {isHost && (onEdit || onDelete) && !isExpired && !isCancelled && (
        <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(event);
              }}
              className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              aria-label="Edit event"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this event?")) {
                  onDelete(event.id);
                }
              }}
              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              aria-label="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
