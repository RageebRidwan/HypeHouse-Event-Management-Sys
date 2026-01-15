import { z } from "zod";

// Event validation schemas
export const createEventSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be less than 2000 characters"),
  
  eventType: z.enum(["CONCERT", "WORKSHOP", "MEETUP", "CONFERENCE", "PARTY", "SPORTS", "OTHER"], {
    message: "Please select a valid event type",
  }),
  
  date: z.string()
    .refine((date) => {
      const eventDate = new Date(date);
      const now = new Date();
      return eventDate > now;
    }, "Event date must be in the future"),
  
  location: z.string()
    .min(5, "Location must be at least 5 characters")
    .max(200, "Location must be less than 200 characters"),
  
  maxParticipants: z.number()
    .int("Maximum participants must be a whole number")
    .min(1, "Must allow at least 1 participant")
    .max(10000, "Maximum participants cannot exceed 10,000"),
  
  price: z.number()
    .min(0, "Price cannot be negative")
    .max(1000000, "Price seems unreasonably high"),
  
  image: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP format"
    )
    .optional(),
});

export const updateEventSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  
  eventType: z.enum(["CONCERT", "WORKSHOP", "MEETUP", "CONFERENCE", "PARTY", "SPORTS", "OTHER"])
    .optional(),
  
  date: z.string()
    .refine((date) => {
      const eventDate = new Date(date);
      const now = new Date();
      return eventDate > now;
    }, "Event date must be in the future")
    .optional(),
  
  location: z.string()
    .min(5, "Location must be at least 5 characters")
    .max(200, "Location must be less than 200 characters")
    .optional(),
  
  maxParticipants: z.number()
    .int("Maximum participants must be a whole number")
    .min(1, "Must allow at least 1 participant")
    .max(10000, "Maximum participants cannot exceed 10,000")
    .optional(),
  
  price: z.number()
    .min(0, "Price cannot be negative")
    .max(1000000, "Price seems unreasonably high")
    .optional(),
  
  image: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP format"
    )
    .optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

