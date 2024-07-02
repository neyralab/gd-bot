import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initData: null,
  initialState: {
    data: null,
    link: {
      copy: '',
      send: '',
      label: ''
    }
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.data = payload;
    },
    setInitData: (state, { payload }) => {
      state.initData = payload;
    },
    setLink: (state, { payload }) => {
      state.link = payload;
    },
    updatePoints: (state, { payload }) => {
      if (state?.data) {
        state.data.points += payload;
      }
    },
    decreaseUsedSpace: (state, { payload }) => {
      if (state?.data) {
        state.data.space_used -= payload;
      }
    },
    increaseUsedSpace: (state, { payload }) => {
      if (state?.data) {
        state.data.space_used += payload;
      }
    }
  }
});

export const {
  setUser,
  setInitData,
  setLink,
  updatePoints,
  decreaseUsedSpace,
  increaseUsedSpace
} = userSlice.actions;
export default userSlice.reducer;
