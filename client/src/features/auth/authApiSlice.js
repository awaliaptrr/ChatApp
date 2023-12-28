import { apiSlice } from "../../app/api/apiSlice";
import { setIsLogged } from "../main/metaSlice";
import { logout, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/v1/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/v1/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    check: builder.mutation({
      query: (data) => ({
        url: "/v1/auth/check",
        method: "POST",
        body: data,
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/v1/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.token));
          dispatch(setIsLogged(true));
        } catch (err) {}
      },
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/v1/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setIsLogged(false));
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useCheckMutation,
  useRefreshMutation,
  useSendLogoutMutation,
} = authApiSlice;
