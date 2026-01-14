import { baseApi } from "./baseApi";

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  eventId: string;
  reviewerId: string;
  reviewedUserId: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
  };
  event?: {
    id: string;
    title: string;
    date: string;
  };
}

export interface CreateReviewInput {
  eventId: string;
  rating: number;
  comment?: string;
}

export interface HostReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<
      { success: boolean; message: string; data: Review },
      CreateReviewInput
    >({
      query: (body) => ({
        url: "/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Review", "Event"],
    }),
    getEventReviews: builder.query<
      { success: boolean; data: Review[] },
      string
    >({
      query: (eventId) => `/reviews/events/${eventId}`,
      providesTags: ["Review"],
    }),
    getHostReviews: builder.query<
      { success: boolean; data: HostReviewsResponse },
      string
    >({
      query: (hostId) => `/reviews/users/${hostId}`,
      providesTags: ["Review"],
    }),
    getUserReview: builder.query<
      { success: boolean; data: Review | null },
      string
    >({
      query: (eventId) => `/reviews/events/${eventId}/user`,
      providesTags: ["Review"],
    }),
    deleteReview: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review", "Event"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetEventReviewsQuery,
  useGetHostReviewsQuery,
  useGetUserReviewQuery,
  useDeleteReviewMutation,
} = reviewsApi;
