import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initData: null,
  initialState: { data: null },
  reducers: {
    setUser: (state, { payload }) => {
      state.data = payload;
    },
    setInitData: (state, { payload }) => {
      state.initData = payload;
    }
  }
});

export const { setUser, setInitData } = userSlice.actions;
export default userSlice.reducer;
