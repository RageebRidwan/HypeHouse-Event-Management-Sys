import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface VerificationStatus {
  verified: boolean;
  verificationRequested: boolean;
  verificationRequestedAt: string | null;
  verificationRejected: boolean;
  verificationRejectedReason: string | null;
}

export interface PendingVerificationRequest {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  interests: string[];
  rating: number | null;
  reviewCount: number;
  verificationRequestedAt: string;
  createdAt: string;
  _count: {
    eventsHosted: number;
    participations: number;
  };
}

export const verificationApi = createApi({
  reducerPath: "verificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/verification`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["VerificationStatus", "PendingRequests"],
  endpoints: (builder) => ({
    requestVerification: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/request",
        method: "POST",
      }),
      invalidatesTags: ["VerificationStatus"],
    }),

    getVerificationStatus: builder.query<{ success: boolean; data: VerificationStatus }, void>({
      query: () => "/status",
      providesTags: ["VerificationStatus"],
    }),

    getPendingRequests: builder.query<{ success: boolean; data: PendingVerificationRequest[] }, void>({
      query: () => "/pending",
      providesTags: ["PendingRequests"],
    }),

    approveVerification: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/approve/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["PendingRequests"],
    }),

    rejectVerification: builder.mutation<{ success: boolean; message: string }, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/reject/${userId}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["PendingRequests"],
    }),
  }),
});

export const {
  useRequestVerificationMutation,
  useGetVerificationStatusQuery,
  useGetPendingRequestsQuery,
  useApproveVerificationMutation,
  useRejectVerificationMutation,
} = verificationApi;
