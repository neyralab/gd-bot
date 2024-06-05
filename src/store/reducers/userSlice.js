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
    }
  }
});

export const { setUser, setInitData, setLink } = userSlice.actions;
export default userSlice.reducer;
