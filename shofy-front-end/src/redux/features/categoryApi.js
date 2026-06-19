import { apiSlice } from "../api/apiSlice";

const getCategoryQuery = (path, arg) => {
  const params = new URLSearchParams();
  if (typeof arg === "object" && arg?.featured) {
    params.set("featured", "true");
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/api/category/add",
        method: "POST",
        body: data,
      }),
    }),
    getShowCategory: builder.query({
      query: (arg) => getCategoryQuery(`/api/category/show`, arg)
    }),
    getProductTypeCategory: builder.query({
      query: (arg) => {
        const type = typeof arg === "string" ? arg : arg?.type;
        return getCategoryQuery(`/api/category/show/${type}`, arg);
      }
    }),
  }),
});

export const {
 useAddCategoryMutation,
 useGetProductTypeCategoryQuery,
 useGetShowCategoryQuery,
} = categoryApi;
