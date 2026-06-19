import { apiSlice } from "../api/apiSlice";
import { IDelReviewsRes, IUpdateReviewRes } from "@/types/product-type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // delete review product
    deleteReviews: builder.mutation<IDelReviewsRes, string>({
      query(id) {
        return {
          url: `/api/review/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ReviewProducts"],
    }),
    // update review visibility
    updateReview: builder.mutation<IUpdateReviewRes, { id: string; status: "Show" | "Hide" }>({
      query({ id, status }) {
        return {
          url: `/api/review/update/${id}`,
          method: "PATCH",
          body: { status },
        };
      },
      invalidatesTags: ["ReviewProducts"],
    }),
  }),
});

export const {
  useDeleteReviewsMutation,
  useUpdateReviewMutation,
} = authApi;
