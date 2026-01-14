import { z } from "zod";
import { EventStatus } from "@prisma/client";

export const createEventSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),
  eventType: z
    .string({
      required_error: "Event type is required",
    })
    .min(2, "Event type must be at least 2 characters")
    .max(100, "Event type must not exceed 100 characters")
    .trim(),
  location: z
    .string({
      required_error: "Location is required",
    })
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must not exceed 200 characters")
    .trim(),
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        if (val === "") return undefined;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    })
    .pipe(z.number().min(-90).max(90))
    .optional(),
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        if (val === "") return undefined;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    })
    .pipe(z.number().min(-180).max(180))
    .optional(),
  date: z.string().refine((date) => {
    const eventDate = new Date(date);
    return eventDate > new Date();
  }, "Event date must be in the future"),
  maxParticipants: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    })
    .pipe(
      z
        .number({
          required_error: "Max participants is required",
        })
        .int()
        .min(1, "Max participants must be at least 1")
        .max(10000, "Max participants cannot exceed 10000")
    ),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        if (val === "") return 0;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
      }
      return val;
    })
    .pipe(z.number().min(0, "Price cannot be negative"))
    .default(0),
  tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val.split(",").map((tag) => tag.trim());
        }
      }
      return val;
    })
    .pipe(z.array(z.string()))
    .default([]),
});

export const updateEventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .trim()
    .optional(),
  eventType: z
    .string()
    .min(2, "Event type must be at least 2 characters")
    .max(100, "Event type must not exceed 100 characters")
    .trim()
    .optional(),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must not exceed 200 characters")
    .trim()
    .optional(),
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .pipe(z.number().min(-90).max(90))
    .optional(),
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .pipe(z.number().min(-180).max(180))
    .optional(),
  date: z
    .string()
    .refine((date) => {
      const eventDate = new Date(date);
      return eventDate > new Date();
    }, "Event date must be in the future")
    .optional(),
  maxParticipants: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Max participants must be at least 1")
        .max(10000, "Max participants cannot exceed 10000")
    )
    .optional(),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .pipe(z.number().min(0, "Price cannot be negative"))
    .optional(),
  status: z.nativeEnum(EventStatus).optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val.split(",").map((tag) => tag.trim());
        }
      }
      return val;
    })
    .pipe(z.array(z.string()))
    .optional(),
});

export const searchEventsSchema = z.object({
  eventType: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(EventStatus).optional(),
  minPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  search: z.string().optional(), // Keyword search
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1"),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default("10"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type SearchEventsInput = z.infer<typeof searchEventsSchema>;
