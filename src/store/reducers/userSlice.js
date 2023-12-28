import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { data: null },
  reducers: {
    setUser: (state, { payload }) => {
      state.data = payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
