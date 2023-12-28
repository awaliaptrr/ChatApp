import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3060",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

//UNFINISH
const baseQueryWithReauth = async (args, api, extraOption) => {
  let result = await baseQuery(args, api, extraOption);
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  endpoints: (builder) => ({}),
  onError: () => {},
});
