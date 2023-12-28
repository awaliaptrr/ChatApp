import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null },
  reducers: {
    setCredentials: (state, action) => {
      if (action.payload) {
        const token = action.payload;
        state.token = token;
      }
    },
    logout: (state, action) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
