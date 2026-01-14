// User Types
export enum UserRole {
  USER = "USER",
  HOST = "HOST",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
  bio?: string;
}

// Event Types
export enum EventStatus {
  OPEN = "OPEN",
  FULL = "FULL",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: Date;
  maxParticipants: number;
  currentCount: number;
  price: number;
  status: EventStatus;
  imageUrl?: string;
  tags: string[];
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDto {
  title: string;
  description: string;
  eventType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: Date | string;
  maxParticipants: number;
  price?: number;
  imageUrl?: string;
  tags?: string[];
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  eventType?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  date?: Date | string;
  maxParticipants?: number;
  price?: number;
  status?: EventStatus;
  imageUrl?: string;
  tags?: string[];
}

// Participant Types
export interface Participant {
  id: string;
  userId: string;
  eventId: string;
  joinedAt: Date;
  attended: boolean;
}

// Review Types
export interface Review {
  id: string;
  eventId: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface CreateReviewDto {
  eventId: string;
  reviewedUserId: string;
  rating: number;
  comment?: string;
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
