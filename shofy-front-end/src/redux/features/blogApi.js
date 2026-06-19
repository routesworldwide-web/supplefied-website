import { apiSlice } from "../api/apiSlice";

export const blogApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: ({ page = 1, limit = 9, category = "", featured = "" } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (category) params.append("category", category);
        if (featured) params.append("featured", featured);

        return `/api/blog?${params.toString()}`;
      },
      providesTags: ["Blogs"],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `/api/blog/${slug}`,
      providesTags: ["Blogs"],
    }),
  }),
});

export const { useGetBlogBySlugQuery, useGetBlogsQuery } = blogApi;
