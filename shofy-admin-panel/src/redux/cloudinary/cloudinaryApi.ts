import { apiSlice } from "../api/apiSlice";
import { ICloudinaryDeleteResponse, ICloudinaryMultiplePostRes, ICloudinaryPostResponse } from "./type";


export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    uploadImage: builder.mutation<ICloudinaryPostResponse, FormData>({
      query: (data) => ({
        url: "/api/cloudinary/add-img",
        method: "POST",
        body: data,
      }),
    }),
    uploadImageMultiple: builder.mutation<ICloudinaryMultiplePostRes, FormData>({
      query: (data) => ({
        url: "/api/cloudinary/add-multiple-img",
        method: "POST",
        body: data,
      }),
    }),
    deleteCloudinaryImg: builder.mutation<
      ICloudinaryDeleteResponse,
      { id: string }
    >({
      query({ id }) {
        return {
          url: `/api/cloudinary/img-delete?id=${encodeURIComponent(id)}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useDeleteCloudinaryImgMutation,
  useUploadImageMutation,
  useUploadImageMultipleMutation,
} = authApi;
