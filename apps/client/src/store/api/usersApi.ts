import { baseApi } from "./baseApi";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  role: string;
  verified: boolean;
  createdAt: string;
  stats: {
    eventsHosted: number;
    eventsJoined: number;
    averageRating: number;
  };
  hostedEvents: Array<{
    id: string;
    title: string;
    eventType: string;
    date: string;
    imageUrl: string | null;
    _count: {
      participants: number;
    };
  }>;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateProfileExtendedInput {
  name?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  interests?: string[];
}

export interface ProfileCompletionResult {
  isComplete: boolean;
  missing: string[];
  completionPercentage: number;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<{ success: boolean; data: UserProfile }, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUserProfile: builder.mutation<
      { success: boolean; data: UserProfile; message: string },
      { id: string; data: UpdateProfileInput }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    uploadProfileImage: builder.mutation<
      { success: boolean; data: { imageUrl: string }; message: string },
      File
    >({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: "/users/profile-image",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
    updateProfileExtended: builder.mutation<
      { success: boolean; data: ProfileCompletionResult; message: string },
      UpdateProfileExtendedInput
    >({
      query: (data) => ({
        url: "/users/profile-extended",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getProfileCompletion: builder.query<
      { success: boolean; data: ProfileCompletionResult },
      void
    >({
      query: () => "/users/profile-completion",
      providesTags: ["User"],
    }),
    acceptHostTerms: builder.mutation<
      { success: boolean; message: string; data: { acceptedAt: string } },
      void
    >({
      query: () => ({
        url: "/users/accept-host-terms",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadProfileImageMutation,
  useUpdateProfileExtendedMutation,
  useGetProfileCompletionQuery,
  useAcceptHostTermsMutation,
} = usersApi;
