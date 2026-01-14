import { EventStatus } from "./event";

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface ParticipantUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface Participant {
  id: string;
  userId: string;
  eventId: string;
  paymentStatus: PaymentStatus;
  joinedAt: string;
  user: ParticipantUser;
}

export interface ParticipantsResponse {
  success: boolean;
  data: Participant[];
}

export interface JoinEventResponse {
  success: boolean;
  data: {
    participant: Participant;
    event: {
      id: string;
      status: string;
      currentCount: number;
    };
  };
  message: string;
}

export interface LeaveEventResponse {
  success: boolean;
  message: string;
}

export interface CheckParticipationResponse {
  success: boolean;
  data: {
    isParticipant: boolean;
  };
}

export interface MyJoinedEventsResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    eventId: string;
    paymentStatus: PaymentStatus;
    joinedAt: string;
    event: {
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
    };
  }[];
}
