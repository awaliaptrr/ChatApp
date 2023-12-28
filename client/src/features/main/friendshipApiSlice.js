import { apiSlice } from "../../app/api/apiSlice";

const friendshipApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStrangers: builder.query({
      query: (name) => ({
        url: `/v1/friendship/strangers/${name}`,
      }),
    }),
    sendRequest: builder.mutation({
      query: (data) => ({
        url: "/v1/friendship/sendRequest",
        method: "POST",
        body: data,
      }),
    }),
    getRequested: builder.query({
      query: () => ({
        url: "/v1/friendship/requested",
      }),
    }),
    acceptRequest: builder.mutation({
      query: (data) => ({
        url: "/v1/friendship/accept",
        method: "PATCH",
        body: data,
      }),
    }),
    getFriends: builder.query({
      query: () => ({
        url: "/v1/friendship/friends",
      }),
    }),
  }),
});

export const {
  useGetStrangersQuery,
  useSendRequestMutation,
  useGetRequestedQuery,
  useAcceptRequestMutation,
  useGetFriendsQuery,
} = friendshipApiSlice;
