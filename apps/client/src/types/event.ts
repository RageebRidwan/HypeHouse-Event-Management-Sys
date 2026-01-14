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
  latitude: number | null;
  longitude: number | null;
  date: string;
  maxParticipants: number;
  currentCount: number;
  price: number;
  status: EventStatus;
  imageUrl: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
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

export interface CreateEventInput {
  title: string;
  description: string;
  eventType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  maxParticipants: number;
  price: number;
  tags: string[];
  image?: File;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  eventType?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  date?: string;
  maxParticipants?: number;
  price?: number;
  status?: EventStatus;
  tags?: string[];
  image?: File;
}

export interface EventFilters {
  eventType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  status?: EventStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EventResponse {
  success: boolean;
  message?: string;
  data: {
    events: Event[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface SingleEventResponse {
  success: boolean;
  message?: string;
  data: Event;
}

export interface MyEventsResponse {
  success: boolean;
  message?: string;
  data: Event[];
}
