import { apiSlice } from "@/redux/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    // get offer coupon
    getOfferCoupons: builder.query({
      query: () => `/api/coupon?status=active`,
      providesTags:['Coupon'],
      keepUnusedDataFor: 600,
    }),
    validateCoupon: builder.mutation({
      query: (couponCode) => ({
        url: `/api/coupon/validate`,
        method: "POST",
        body: { couponCode },
      }),
    }),
  }),
});

export const {
  useGetOfferCouponsQuery,
  useValidateCouponMutation,
} = authApi;
