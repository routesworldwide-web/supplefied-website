import { apiSlice } from "../../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // createRazorpayOrder
    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: "/api/order/create-razorpay-order",
        method: "POST",
        body: data,
      }),
    }),
    // saveOrder
    saveOrder: builder.mutation({
      query: (data) => ({
        url: "/api/order/saveOrder",
        method: "POST",
        body: data,
      }),
      invalidatesTags:['UserOrders'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result) {
            localStorage.removeItem("couponInfo");
            localStorage.removeItem("shipping_info");
          }
        } catch (err) {
          // do nothing
        }
      },

    }),
    // getUserOrders
    getUserOrders: builder.query({
      query: () => `/api/user-order`,
      providesTags: (result, error, userId) => [{ type: "UserOrders", id: userId }],
      keepUnusedDataFor: 600,
    }),
    // getUserOrders
    getUserOrderById: builder.query({
      query: (id) => `/api/user-order/${id}`,
      providesTags: (result, error, arg) => [{ type: "UserOrder", id: arg }],
      keepUnusedDataFor: 600,
    }),
    cancelUserOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/user-order/${id}/cancel`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        "UserOrders",
        { type: "UserOrder", id: arg.id },
      ],
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useSaveOrderMutation,
  useGetUserOrderByIdQuery,
  useGetUserOrdersQuery,
  useCancelUserOrderMutation,
} = authApi;
