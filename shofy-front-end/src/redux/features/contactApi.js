import { apiSlice } from "@/redux/api/apiSlice";

export const contactApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    submitContactMessage: builder.mutation({
      query: (data) => ({
        url: "/api/contact",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubmitContactMessageMutation } = contactApi;
