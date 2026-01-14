import { z } from "zod";

export const joinEventSchema = z.object({
  eventId: z.string().cuid({
    message: "Invalid event ID format",
  }),
});

export type JoinEventInput = z.infer<typeof joinEventSchema>;
