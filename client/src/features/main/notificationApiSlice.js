import { apiSlice } from "../../app/api/apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "/v1/notification",
      }),
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApiSlice;
