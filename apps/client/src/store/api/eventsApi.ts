import { baseApi } from "./baseApi";
import type {
  EventFilters,
  EventResponse,
  SingleEventResponse,
  MyEventsResponse,
  CreateEventInput,
  UpdateEventInput,
} from "../../types/event";

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query<EventResponse, EventFilters | void>({
      query: (filters = {}) => {
        const safeFilters: EventFilters = filters as EventFilters;
        const params = new URLSearchParams();

        if (safeFilters.eventType) params.append("eventType", safeFilters.eventType);
        if (safeFilters.location) params.append("location", safeFilters.location);
        if (safeFilters.startDate) params.append("startDate", safeFilters.startDate);
        if (safeFilters.endDate) params.append("endDate", safeFilters.endDate);
        if (safeFilters.status) params.append("status", safeFilters.status);
        if (safeFilters.minPrice !== undefined) params.append("minPrice", String(safeFilters.minPrice));
        if (safeFilters.maxPrice !== undefined) params.append("maxPrice", String(safeFilters.maxPrice));
        if (safeFilters.search) params.append("search", safeFilters.search);
        if (safeFilters.page) params.append("page", String(safeFilters.page));
        if (safeFilters.limit) params.append("limit", String(safeFilters.limit));

        return `/events?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.events.map(({ id }) => ({ type: "Event" as const, id })),
              { type: "Event", id: "LIST" },
            ]
          : [{ type: "Event", id: "LIST" }],
    }),

    getEventById: builder.query<SingleEventResponse, string>({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),

    createEvent: builder.mutation<SingleEventResponse, CreateEventInput>({
      query: (data) => {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("eventType", data.eventType);
        formData.append("location", data.location);
        formData.append("date", data.date);
        formData.append("maxParticipants", String(data.maxParticipants));
        formData.append("price", String(data.price));

        if (data.latitude !== undefined) {
          formData.append("latitude", String(data.latitude));
        }
        if (data.longitude !== undefined) {
          formData.append("longitude", String(data.longitude));
        }
        if (data.tags && data.tags.length > 0) {
          formData.append("tags", data.tags.join(","));
        }
        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          url: "/events",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Event", id: "LIST" }, "MyEvents"],
    }),

    updateEvent: builder.mutation<
      SingleEventResponse,
      { id: string; data: UpdateEventInput }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();

        if (data.title) formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.eventType) formData.append("eventType", data.eventType);
        if (data.location) formData.append("location", data.location);
        if (data.date) formData.append("date", data.date);
        if (data.maxParticipants) formData.append("maxParticipants", String(data.maxParticipants));
        if (data.price !== undefined) formData.append("price", String(data.price));
        if (data.latitude !== undefined) formData.append("latitude", String(data.latitude));
        if (data.longitude !== undefined) formData.append("longitude", String(data.longitude));
        if (data.status) formData.append("status", data.status);
        if (data.tags && data.tags.length > 0) formData.append("tags", data.tags.join(","));
        if (data.image) formData.append("image", data.image);

        return {
          url: `/events/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Event", id },
        { type: "Event", id: "LIST" },
        "MyEvents",
      ],
    }),

    deleteEvent: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Event", id },
        { type: "Event", id: "LIST" },
        "MyEvents",
      ],
    }),

    getMyEvents: builder.query<MyEventsResponse, void>({
      query: () => "/events/host/my-events",
      providesTags: ["MyEvents"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetMyEventsQuery,
} = eventsApi;
