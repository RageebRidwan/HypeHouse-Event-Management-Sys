import { prisma } from "../../utils/prisma";
import { AppError } from "../../utils/errors";
import { sendNewReviewNotification } from "../../services/notification.service";

interface CreateReviewInput {
  userId: string;
  eventId: string;
  rating: number;
  comment?: string;
}

export const createReview = async ({
  userId,
  eventId,
  rating,
  comment,
}: CreateReviewInput) => {
  // Get event with host
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { host: true },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  // Validate: Event must be COMPLETED
  if (event.status !== "COMPLETED") {
    throw new AppError("Can only review completed events", 400);
  }

  // Validate: User must be participant
  const participation = await prisma.participant.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });

  if (!participation) {
    throw new AppError("Only participants can review this event", 403);
  }

  // Validate: User hasn't already reviewed this event
  const existingReview = await prisma.review.findUnique({
    where: {
      eventId_reviewerId_reviewedUserId: {
        eventId,
        reviewerId: userId,
        reviewedUserId: event.hostId,
      },
    },
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this event", 400);
  }

  // Validate: Rating must be 1-5
  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      eventId,
      reviewerId: userId,
      reviewedUserId: event.hostId,
      rating,
      comment,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  // Update host's average rating
  await updateHostRating(event.hostId);

  // Send notification to host (don't wait for it)
  const eventUrl = `${process.env.FRONTEND_URL}/events/${eventId}`;
  sendNewReviewNotification({
    to: event.host.email,
    hostName: event.host.name,
    eventTitle: event.title,
    reviewerName: review.reviewer.name,
    rating,
    comment: comment || "(No comment provided)",
    eventUrl,
  }).catch((error) =>
    console.error("Failed to send review notification:", error)
  );

  return review;
};

export const getEventReviews = async (eventId: string) => {
  const reviews = await prisma.review.findMany({
    where: { eventId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

export const getHostReviews = async (hostId: string) => {
  const reviews = await prisma.review.findMany({
    where: { reviewedUserId: hostId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          date: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate average rating
  const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return {
    reviews,
    averageRating,
    totalReviews: reviews.length,
  };
};

export const updateHostRating = async (hostId: string) => {
  // Get all reviews for this host
  const reviews = await prisma.review.findMany({
    where: { reviewedUserId: hostId },
  });

  if (reviews.length === 0) {
    // Reset rating if no reviews
    await prisma.user.update({
      where: { id: hostId },
      data: {
        rating: null,
        reviewCount: 0,
      } as any,
    });
    return;
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  // Update user rating
  await prisma.user.update({
    where: { id: hostId },
    data: {
      rating: averageRating,
      reviewCount: reviews.length,
    } as any,
  });
};

export const deleteReview = async (reviewId: string, userId: string) => {
  // Get review
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  // Validate: Only reviewer can delete
  if (review.reviewerId !== userId) {
    throw new AppError("You can only delete your own reviews", 403);
  }

  // Delete review
  await prisma.review.delete({
    where: { id: reviewId },
  });

  // Recalculate host rating
  await updateHostRating(review.reviewedUserId);

  return { message: "Review deleted successfully" };
};

export const getUserReview = async (userId: string, eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { hostId: true },
  });

  if (!event) {
    return null;
  }

  const review = await prisma.review.findUnique({
    where: {
      eventId_reviewerId_reviewedUserId: {
        eventId,
        reviewerId: userId,
        reviewedUserId: event.hostId,
      },
    },
  });

  return review;
};
