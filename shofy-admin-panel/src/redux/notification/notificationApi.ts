import {
  INotificationResponse,
  NotificationCategory,
} from "@/types/notification-type";
import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotifications: builder.query<INotificationResponse, void>({
      query: () => "/api/notifications?limit=20",
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    dismissNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/notifications/${id}/dismiss`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/api/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markNotificationCategoryRead: builder.mutation<
      { success: boolean },
      NotificationCategory
    >({
      query: (category) => ({
        url: `/api/notifications/read-category/${category}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useDismissNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationCategoryReadMutation,
  useMarkNotificationReadMutation,
} = notificationApi;
