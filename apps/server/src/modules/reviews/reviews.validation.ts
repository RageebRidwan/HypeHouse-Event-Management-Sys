import { z } from "zod";

export const createReviewSchema = z.object({
  eventId: z.string().cuid("Event ID must be a valid ID"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .max(500, "Comment must be at most 500 characters")
    .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
