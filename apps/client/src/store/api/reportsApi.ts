import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { adminApi } from "./adminApi";

export interface CreateReportInput {
  reportedType: "EVENT" | "REVIEW" | "USER";
  reportedId: string;
  reason: string;
  description?: string;
}

export interface Report {
  id: string;
  reportedType: "EVENT" | "REVIEW" | "USER";
  reportedId: string;
  reason: string;
  description?: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  reporterId: string;
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  resolvedById?: string;
  resolvedBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
  resolvedAt?: string;
}

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/reports`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    createReport: builder.mutation<
      { success: boolean; message: string; data: Report },
      CreateReportInput
    >({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reports"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate admin reports cache to show new reports in admin panel immediately
          dispatch(adminApi.util.invalidateTags(["Reports", "Stats"]));
        } catch {
          // Ignore errors
        }
      },
    }),

    getMyReports: builder.query<
      { success: boolean; data: Report[] },
      void
    >({
      query: () => "/my",
      providesTags: ["Reports"],
    }),
  }),
});

export const {
  useCreateReportMutation,
  useGetMyReportsQuery,
} = reportsApi;
