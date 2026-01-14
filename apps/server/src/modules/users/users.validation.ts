import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
