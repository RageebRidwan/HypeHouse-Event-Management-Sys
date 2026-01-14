import { baseApi } from "./baseApi";

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  status: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  createdAt: string;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<
      { success: boolean; data: PaymentIntent },
      { eventId: string }
    >({
      query: (body) => ({
        url: "/payments/create-intent",
        method: "POST",
        body,
      }),
    }),
    getPaymentHistory: builder.query<
      { success: boolean; data: PaymentHistory[] },
      void
    >({
      query: () => "/payments/history",
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useGetPaymentHistoryQuery,
} = paymentsApi;
