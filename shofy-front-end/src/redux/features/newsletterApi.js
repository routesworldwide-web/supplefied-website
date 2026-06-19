import { apiSlice } from "../api/apiSlice";

export const newsletterApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "/api/newsletter/subscribe",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
