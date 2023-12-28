import { apiSlice } from "../../app/api/apiSlice";
import { original } from "@reduxjs/toolkit";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSortedMessages: builder.query({
      query: () => ({
        url: "/v1/chat/getSortedMessages",
      }),
    }),
    getMessagesPerUser: builder.query({
      query: (targetUsername) => ({
        url: `/v1/chat/getMessagesPerUser/${targetUsername}`,
      }),
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/v1/chat/sendMessage",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const sw = await queryFulfilled;
          dispatch(
            chatApiSlice.util.updateQueryData(
              "getSortedMessages",
              undefined,
              (draft) => {
                const index = draft.messages.findIndex(
                  (data) => original(data).username == sw.data.username
                );
                draft.messages.splice(index, 1);
                draft.messages.unshift(sw.data);
              }
            )
          );
          dispatch(
            chatApiSlice.util.updateQueryData(
              "getMessagesPerUser",
              data.targetUsername,
              (draft) => {
                draft.push({
                  key: [sw.data.senderUsername, sw.data.username],
                  message: sw.data.payload.message,
                  sentAt: sw.data.payload.sentAt,
                });
              }
            )
          );
        } catch (e) {
          console.log(e);
        }
      },
    }),
  }),
});

export const {
  useGetSortedMessagesQuery,
  useSendMessageMutation,
  useGetMessagesPerUserQuery,
} = chatApiSlice;
