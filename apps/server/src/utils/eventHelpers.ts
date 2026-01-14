import { EventStatus } from "@prisma/client";

/**
 * Computes the correct event status based on date, capacity, and current status
 */
export const computeEventStatus = (event: any): EventStatus => {
  const now = new Date();
  const eventDate = new Date(event.date);

  // If manually cancelled or completed, keep it as is
  if (event.status === EventStatus.CANCELLED || event.status === EventStatus.COMPLETED) {
    return event.status;
  }

  // If event date has passed, mark as completed
  if (eventDate < now) {
    return EventStatus.COMPLETED;
  }

  // If at capacity, mark as full
  const participantCount = event._count?.participants || event.currentCount || 0;
  if (participantCount >= event.maxParticipants) {
    return EventStatus.FULL;
  }

  // Otherwise keep current status or default to OPEN
  return event.status === EventStatus.OPEN ? EventStatus.OPEN : event.status;
};
