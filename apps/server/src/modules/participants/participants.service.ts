import { EventStatus } from "@prisma/client";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import { sendBookingConfirmation } from "../../services/notification.service";
import { prisma } from "../../utils/prisma";
import { computeEventStatus } from "../../utils/eventHelpers";

export class ParticipantsService {
  /**
   * Join an event as a participant
   */
  async joinEvent(userId: string, eventId: string) {
    return await prisma.$transaction(async (tx) => {
      // Check if event exists
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          host: true,
          _count: {
            select: { participants: true },
          },
        },
      });

      if (!event) {
        throw new NotFoundError("Event not found");
      }

      // Check if user is trying to join their own event
      if (event.hostId === userId) {
        throw new BadRequestError("You cannot join your own event");
      }

      // Check if event is open for registration
      if (event.status !== EventStatus.OPEN) {
        throw new BadRequestError(`Event is ${event.status.toLowerCase()} and not accepting registrations`);
      }

      // Check if user already joined
      const existingParticipant = await tx.participant.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (existingParticipant) {
        throw new BadRequestError("You have already joined this event");
      }

      // Check if event is full
      if (event._count.participants >= event.maxParticipants) {
        throw new BadRequestError("Event is already full");
      }

      // Create participant record
      const participant = await tx.participant.create({
        data: {
          userId,
          eventId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      // Check if event should be marked as FULL
      const newParticipantCount = event._count.participants + 1;
      let updatedEvent;

      if (newParticipantCount >= event.maxParticipants) {
        updatedEvent = await tx.event.update({
          where: { id: eventId },
          data: { status: EventStatus.FULL },
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
            _count: {
              select: { participants: true },
            },
          },
        });
      } else {
        updatedEvent = await tx.event.findUnique({
          where: { id: eventId },
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
            _count: {
              select: { participants: true },
            },
          },
        });
      }

      // Send booking confirmation email (don't wait for it)
      if (updatedEvent) {
        const eventDate = new Date(updatedEvent.date);
        const eventUrl = `${process.env.CLIENT_URL}/events/${updatedEvent.id}`;

        sendBookingConfirmation({
          to: participant.user.email,
          userName: participant.user.name,
          eventTitle: updatedEvent.title,
          eventDate: eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          eventTime: eventDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          eventLocation: updatedEvent.location,
          hostName: updatedEvent.host.name,
          eventUrl,
          ticketPrice: updatedEvent.price,
        }).catch((error) =>
          console.error("Failed to send booking confirmation:", error)
        );
      }

      return {
        participant,
        event: updatedEvent,
        message: "Successfully joined the event!",
      };
    });
  }

  /**
   * Leave an event (remove participation)
   */
  async leaveEvent(userId: string, eventId: string) {
    return await prisma.$transaction(async (tx) => {
      // Check if user is a participant
      const participant = await tx.participant.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (!participant) {
        throw new NotFoundError("You are not a participant of this event");
      }

      // Check if event exists
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          _count: {
            select: { participants: true },
          },
        },
      });

      if (!event) {
        throw new NotFoundError("Event not found");
      }

      // Delete participant record
      await tx.participant.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      // Update event status if it was FULL and now has space
      if (event.status === EventStatus.FULL) {
        await tx.event.update({
          where: { id: eventId },
          data: { status: EventStatus.OPEN },
        });
      }

      return {
        success: true,
        message: "Successfully left the event",
      };
    });
  }

  /**
   * Get all participants for an event
   */
  async getEventParticipants(eventId: string) {
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const participants = await prisma.participant.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            verified: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    return participants;
  }

  /**
   * Get all events a user has joined
   */
  async getUserJoinedEvents(userId: string, filters?: {
    upcoming?: boolean;
    past?: boolean;
  }) {
    const now = new Date();
    let dateFilter = {};

    if (filters?.upcoming) {
      dateFilter = { gte: now };
    } else if (filters?.past) {
      dateFilter = { lt: now };
    }

    const participations = await prisma.participant.findMany({
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && {
          event: {
            date: dateFilter,
          },
        }),
      },
      include: {
        event: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            _count: {
              select: { participants: true },
            },
          },
        },
      },
      orderBy: {
        event: {
          date: "asc",
        },
      },
    });

    return participations.map((p) => ({
      id: p.id,
      userId: p.userId,
      eventId: p.eventId,
      paymentStatus: p.paymentStatus,
      joinedAt: p.joinedAt,
      attended: p.attended,
      event: {
        ...p.event,
        status: computeEventStatus(p.event),
      },
    }));
  }

  /**
   * Check if a user is a participant of an event
   */
  async checkUserParticipation(userId: string, eventId: string) {
    const participant = await prisma.participant.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    return {
      isParticipant: !!participant,
      joinedAt: participant?.joinedAt || null,
      attended: participant?.attended || false,
    };
  }

  /**
   * Helper function to update event status based on participant count
   */
  async updateEventStatus(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const shouldBeFull = event._count.participants >= event.maxParticipants;
    const newStatus = shouldBeFull ? EventStatus.FULL : EventStatus.OPEN;

    // Only update if status needs to change
    if (event.status !== newStatus && event.status !== EventStatus.CANCELLED && event.status !== EventStatus.COMPLETED) {
      await prisma.event.update({
        where: { id: eventId },
        data: { status: newStatus },
      });
    }

    return newStatus;
  }
}

export const participantsService = new ParticipantsService();
