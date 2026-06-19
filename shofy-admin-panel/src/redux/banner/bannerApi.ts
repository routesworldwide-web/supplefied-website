import {
  IBannerMutationResponse,
  IBannerResponse,
} from "@/types/banner-type";
import { apiSlice } from "../api/apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllBanners: builder.query<IBannerResponse, void>({
      query: () => "/api/banner/admin",
      providesTags: ["Banners"],
    }),
    addBanner: builder.mutation<IBannerMutationResponse, FormData>({
      query: (data) => ({
        url: "/api/banner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Banners"],
    }),
    updateBanner: builder.mutation<IBannerMutationResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/api/banner/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
});

export const {
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetAllBannersQuery,
  useUpdateBannerMutation,
} = bannerApi;
