import { apiSlice } from "@/redux/api/apiSlice";

export const userAddressApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getShippingAddresses: builder.query({
      query: () => "/api/user/shipping-addresses",
      transformResponse: (response) => response?.data || [],
      providesTags: (result, error, userId) => [
        { type: "ShippingAddresses", id: userId },
      ],
    }),
    addShippingAddress: builder.mutation({
      query: (data) => ({
        url: "/api/user/shipping-addresses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ShippingAddresses"],
    }),
    updateShippingAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/user/shipping-addresses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ShippingAddresses"],
    }),
    deleteShippingAddress: builder.mutation({
      query: (id) => ({
        url: `/api/user/shipping-addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShippingAddresses"],
    }),
  }),
});

export const {
  useGetShippingAddressesQuery,
  useAddShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
} = userAddressApi;
