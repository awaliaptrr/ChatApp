import { apiSlice } from "../../app/api/apiSlice";

export const mainApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    currentProfile: builder.query({
      query: () => ({
        url: `/v1/user/current`,
      }),
    }),
    update: builder.mutation({
      query: (data) => ({
        url: "/v1/user/update",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useCurrentProfileQuery, useUpdateMutation } = mainApiSlice;
