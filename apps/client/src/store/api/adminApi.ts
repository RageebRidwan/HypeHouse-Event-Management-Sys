import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Platform Statistics
export interface PlatformStats {
  totalUsers: number;
  totalEvents: number;
  totalParticipants: number;
  totalRevenue: number;
  totalReviews: number;
  averageRating: number;
  pendingReports: number;
  activeEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  verifiedHosts: number;
  suspendedUsers: number;
}

// User Management
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  verified: boolean;
  emailVerified: boolean;
  suspended: boolean;
  suspendedAt?: string;
  suspensionReason?: string;
  createdAt: string;
  _count?: {
    eventsHosted: number;
    eventsAttended: number;
    reviews: number;
  };
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  suspended?: boolean;
}

export interface GetAllUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserRoleInput {
  role: string;
}

export interface SuspendUserInput {
  reason: string;
}

// Event Management
export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  date: string;
  location: string;
  maxParticipants: number;
  price: number;
  imageUrl?: string;
  status: string;
  hostId: string;
  host: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    participants: number;
    reviews: number;
  };
  createdAt: string;
}

export interface GetAllEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface GetAllEventsResponse {
  events: AdminEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Reports Management
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

export interface GetAllReportsParams {
  page?: number;
  limit?: number;
  status?: string;
  reportedType?: string;
}

export interface GetAllReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Stats", "Users", "Events", "Reports"],
  endpoints: (builder) => ({
    // Platform Statistics
    getPlatformStats: builder.query<
      { success: boolean; data: PlatformStats },
      void
    >({
      query: () => "/stats",
      providesTags: ["Stats"],
    }),

    // User Management
    getAllUsers: builder.query<
      { success: boolean; data: GetAllUsersResponse },
      GetAllUsersParams
    >({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["Users"],
    }),

    getUserDetails: builder.query<
      { success: boolean; data: AdminUser },
      string
    >({
      query: (userId) => `/users/${userId}`,
      providesTags: ["Users"],
    }),

    updateUserRole: builder.mutation<
      { success: boolean; message: string },
      { userId: string; data: UpdateUserRoleInput }
    >({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/role`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users", "Stats"],
    }),

    suspendUser: builder.mutation<
      { success: boolean; message: string },
      { userId: string; data: SuspendUserInput }
    >({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/suspend`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users", "Stats"],
    }),

    unsuspendUser: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (userId) => ({
        url: `/users/${userId}/unsuspend`,
        method: "PUT",
      }),
      invalidatesTags: ["Users", "Stats"],
    }),

    deleteUser: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Stats"],
    }),

    // Event Management
    getAllEvents: builder.query<
      { success: boolean; data: GetAllEventsResponse },
      GetAllEventsParams
    >({
      query: (params) => ({
        url: "/events",
        params,
      }),
      providesTags: ["Events"],
    }),

    deleteEvent: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events", "Stats"],
    }),

    // Reports Management
    getAllReports: builder.query<
      { success: boolean; data: GetAllReportsResponse },
      GetAllReportsParams
    >({
      query: (params) => ({
        url: "/reports",
        params,
      }),
      providesTags: ["Reports"],
    }),

    resolveReport: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (reportId) => ({
        url: `/reports/${reportId}/resolve`,
        method: "PUT",
      }),
      invalidatesTags: ["Reports", "Stats"],
    }),

    dismissReport: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (reportId) => ({
        url: `/reports/${reportId}/dismiss`,
        method: "PUT",
      }),
      invalidatesTags: ["Reports", "Stats"],
    }),
  }),
});

export const {
  useGetPlatformStatsQuery,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserRoleMutation,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useDeleteUserMutation,
  useGetAllEventsQuery,
  useDeleteEventMutation,
  useGetAllReportsQuery,
  useResolveReportMutation,
  useDismissReportMutation,
} = adminApi;
