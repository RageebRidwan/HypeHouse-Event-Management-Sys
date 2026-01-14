// Re-export from types for convenience
export { EventStatus } from "../types/event";

export const EVENT_TYPES = [
  "Concert",
  "Education & Learning",
  "Food & Drink",
  "Meetup",
  "Music & Concert",
  "Networking",
  "Sports & Fitness",
  "Tech & Innovation",
  "Social & Networking"
] as const;

export enum UserRole {
  USER = "USER",
  HOST = "HOST",
  ADMIN = "ADMIN"
}
