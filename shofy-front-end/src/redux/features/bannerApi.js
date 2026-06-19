import { apiSlice } from "../api/apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: (placement) => `/api/banner${placement ? `?placement=${placement}` : ""}`,
      providesTags: ["Banners"],
    }),
  }),
});

export const { useGetBannersQuery } = bannerApi;
