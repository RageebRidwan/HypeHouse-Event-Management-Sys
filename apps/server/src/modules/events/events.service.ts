import { prisma } from "../../utils/prisma";
import { uploadImage, deleteImage, extractPublicId } from "../../utils/cloudinary";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../utils/errors";
import { UserRole, EventStatus } from "@prisma/client";
import { checkProfileCompletion } from "../../utils/profileValidation";
import { computeEventStatus } from "../../utils/eventHelpers";
import type {
  CreateEventInput,
  UpdateEventInput,
  SearchEventsInput,
} from "./events.validation";

interface EventWithDetails {
  id: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  date: Date;
  maxParticipants: number;
  currentCount: number;
  price: number;
  status: EventStatus;
  imageUrl: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  host: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  _count: {
    participants: number;
  };
}

/**
 * Compute the actual status of an event based on current date and participant count
 * This ensures expired events are automatically marked as COMPLETED
 */
/**
 * Apply computed status to a single event
 */
const applyComputedStatus = (event: any): any => {
  return {
    ...event,
    status: computeEventStatus(event),
  };
};

/**
 * Apply computed status to multiple events
 */
const applyComputedStatusToEvents = (events: any[]): any[] => {
  return events.map(applyComputedStatus);
};

export const createEvent = async (
  hostId: string,
  data: CreateEventInput,
  imageBuffer?: Buffer
): Promise<EventWithDetails> => {
  // Get user with all required fields for validation
  const user = await prisma.user.findUnique({
    where: { id: hostId },
    select: {
      role: true,
      emailVerified: true,
      avatar: true,
      bio: true,
      location: true,
      interests: true,
      acceptedHostTerms: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // 1. Check email verification
  if (!user.emailVerified) {
    throw new BadRequestError(
      "Please verify your email address before creating events. Check your inbox for the verification link."
    );
  }

  // 2. Check profile completion
  const profileStatus = checkProfileCompletion({
    avatar: user.avatar,
    bio: user.bio,
    location: user.location,
    interests: user.interests,
  });

  if (!profileStatus.isComplete) {
    throw new BadRequestError(
      `Complete your profile to start hosting events. Missing: ${profileStatus.missing.join(", ")}`
    );
  }

  // 3. Check host terms acceptance
  if (!user.acceptedHostTerms) {
    throw new BadRequestError(
      "You must accept the Host Terms & Conditions before creating events."
    );
  }

  let imageUrl: string | null = null;

  // Upload image to Cloudinary if provided
  if (imageBuffer) {
    const uploadResult = await uploadImage(imageBuffer);
    imageUrl = uploadResult.secure_url;
  }

  // Auto-promote user to HOST role if they're just USER
  if (user.role === UserRole.USER) {
    await prisma.user.update({
      where: { id: hostId },
      data: { role: UserRole.HOST },
    });
  }

  // Create event
  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      location: data.location,
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
      date: new Date(data.date),
      maxParticipants: data.maxParticipants,
      price: data.price,
      imageUrl,
      tags: data.tags || [],
      hostId,
    },
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
        select: {
          participants: true,
        },
      },
    },
  });

  return event;
};

export const getEvents = async (
  filters: SearchEventsInput
): Promise<{ events: EventWithDetails[]; total: number; page: number; totalPages: number }> => {
  const {
    eventType,
    location,
    startDate,
    endDate,
    status,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 10,
  } = filters;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (eventType) {
    where.eventType = { contains: eventType, mode: "insensitive" };
  }

  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      where.date.gte = new Date(startDate);
    }
    if (endDate) {
      where.date.lte = new Date(endDate);
    }
  }

  // Note: Status filtering is done AFTER fetching to use computed status
  // Database status filter is not applied here to avoid conflicts with computed status

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  // Keyword search across title, description, and location
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  // Get events (fetch more than needed to account for status filtering)
  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
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
        select: {
          participants: true,
        },
      },
    },
  });

  // Apply computed status to all events
  let eventsWithComputedStatus = applyComputedStatusToEvents(events);

  // Filter by computed status
  if (status) {
    eventsWithComputedStatus = eventsWithComputedStatus.filter(e => e.status === status);
  } else {
    // By default, exclude COMPLETED and CANCELLED events
    eventsWithComputedStatus = eventsWithComputedStatus.filter(
      e => e.status !== EventStatus.COMPLETED && e.status !== EventStatus.CANCELLED
    );
  }

  // Apply pagination to filtered results
  const total = eventsWithComputedStatus.length;
  const paginatedEvents = eventsWithComputedStatus.slice(skip, skip + limit);

  return {
    events: paginatedEvents,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getEventById = async (id: string, userId?: string): Promise<any> => {
  const event = await prisma.event.findUnique({
    where: { id },
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
        select: {
          participants: true,
        },
      },
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Check if the requesting user is a participant
  let isUserParticipant = false;
  if (userId) {
    isUserParticipant = event.participants.some(
      (p) => p.userId === userId
    );
  }

  // Apply computed status
  const eventWithComputedStatus = applyComputedStatus(event);

  return {
    ...eventWithComputedStatus,
    isUserParticipant,
  };
};

export const updateEvent = async (
  eventId: string,
  hostId: string,
  data: UpdateEventInput,
  imageBuffer?: Buffer
): Promise<EventWithDetails> => {
  // Check if event exists and user is the host
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { hostId: true, imageUrl: true },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.hostId !== hostId) {
    throw new ForbiddenError("Only the event host can update this event");
  }

  let imageUrl: string | undefined;

  // Upload new image if provided
  if (imageBuffer) {
    // Delete old image from Cloudinary if exists
    if (event.imageUrl) {
      const publicId = extractPublicId(event.imageUrl);
      if (publicId) {
        await deleteImage(publicId);
      }
    }

    const uploadResult = await uploadImage(imageBuffer);
    imageUrl = uploadResult.secure_url;
  }

  // Update event
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      imageUrl: imageUrl !== undefined ? imageUrl : undefined,
    },
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
        select: {
          participants: true,
        },
      },
    },
  });

  return updatedEvent;
};

export const deleteEvent = async (
  eventId: string,
  hostId: string
): Promise<void> => {
  // Check if event exists and user is the host
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { hostId: true, imageUrl: true },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.hostId !== hostId) {
    throw new ForbiddenError("Only the event host can delete this event");
  }

  // Delete image from Cloudinary if exists
  if (event.imageUrl) {
    const publicId = extractPublicId(event.imageUrl);
    if (publicId) {
      await deleteImage(publicId);
    }
  }

  // Delete event (hard delete - cascades to participants and reviews)
  await prisma.event.delete({
    where: { id: eventId },
  });
};

export const getHostEvents = async (hostId: string): Promise<EventWithDetails[]> => {
  const events = await prisma.event.findMany({
    where: { hostId },
    orderBy: { date: "desc" },
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
        select: {
          participants: true,
        },
      },
    },
  });

  // Apply computed status to all host events (hosts should see all their events including completed)
  return applyComputedStatusToEvents(events);
};
