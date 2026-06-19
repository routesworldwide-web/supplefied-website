import {
  IBlogMutationResponse,
  IBlogResponse,
} from "@/types/blog-type";
import { apiSlice } from "../api/apiSlice";

export const blogApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllBlogs: builder.query<IBlogResponse, void>({
      query: () => "/api/blog/admin",
      providesTags: ["Blogs"],
    }),
    addBlog: builder.mutation<IBlogMutationResponse, FormData>({
      query: (data) => ({
        url: "/api/blog",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blogs"],
    }),
    updateBlog: builder.mutation<IBlogMutationResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/api/blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Blogs"],
    }),
    deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useAddBlogMutation,
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
  useUpdateBlogMutation,
} = blogApi;
