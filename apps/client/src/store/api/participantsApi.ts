import { baseApi } from "./baseApi";
import type {
  ParticipantsResponse,
  JoinEventResponse,
  LeaveEventResponse,
  CheckParticipationResponse,
  MyJoinedEventsResponse,
} from "../../types/participant";

export const participantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Join an event
    joinEvent: builder.mutation<JoinEventResponse, string>({
      query: (eventId) => ({
        url: `/participants/events/${eventId}/join`,
        method: "POST",
      }),
      invalidatesTags: (result, error, eventId) => [
        { type: "Event", id: eventId },
        { type: "Event", id: "LIST" },
        { type: "Participant", id: eventId },
        "MyEvents",
      ],
    }),

    // Leave an event
    leaveEvent: builder.mutation<LeaveEventResponse, string>({
      query: (eventId) => ({
        url: `/participants/events/${eventId}/leave`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, eventId) => [
        { type: "Event", id: eventId },
        { type: "Event", id: "LIST" },
        { type: "Participant", id: eventId },
        "MyEvents",
      ],
    }),

    // Get event participants
    getEventParticipants: builder.query<ParticipantsResponse, string>({
      query: (eventId) => `/participants/events/${eventId}/participants`,
      providesTags: (result, error, eventId) => [
        { type: "Participant", id: eventId },
      ],
    }),

    // Get user's joined events
    getMyJoinedEvents: builder.query<MyJoinedEventsResponse, void>({
      query: () => "/participants/my-events",
      providesTags: ["MyEvents"],
    }),

    // Check if user is a participant
    checkParticipation: builder.query<CheckParticipationResponse, string>({
      query: (eventId) => `/participants/events/${eventId}/check-participation`,
      providesTags: (result, error, eventId) => [
        { type: "Participant", id: eventId },
      ],
    }),
  }),
});

export const {
  useJoinEventMutation,
  useLeaveEventMutation,
  useGetEventParticipantsQuery,
  useGetMyJoinedEventsQuery,
  useCheckParticipationQuery,
} = participantsApi;
