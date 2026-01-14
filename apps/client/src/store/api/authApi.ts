import { baseApi } from "./baseApi";
import type { AuthResponse, RegisterInput, LoginInput } from "@/types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token in localStorage
          if (data.data.token) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));
          }
        } catch (error) {
          // Error handling
        }
      },
    }),
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token in localStorage
          if (data.data.token) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));
          }
        } catch (error) {
          // Error handling
        }
      },
    }),
    verifyEmail: builder.mutation<
      { success: boolean; message: string; data: any },
      string
    >({
      query: (token) => ({
        url: `/auth/verify-email?token=${token}`,
        method: "GET",
      }),
    }),
    resendVerification: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/auth/resend-verification",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;
