import { createSlice } from "@reduxjs/toolkit";

const metaSlice = createSlice({
  name: "meta",
  initialState: { isLogged: false },
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
  },
});

export const { setIsLogged } = metaSlice.actions;

export default metaSlice.reducer;

export const selectIsLogged = (state) => state.meta.isLogged;
