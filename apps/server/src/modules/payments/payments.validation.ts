import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  eventId: z.string().cuid("Event ID must be a valid CUID"),
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
