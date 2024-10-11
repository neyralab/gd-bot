import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Me } from '../../effects/types/users';

interface UserLinks {
  copy: string;
  send: string;
  label: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null as Me | null,
    link: {
      copy: '',
      send: '',
      label: ''
    } as UserLinks,
    initData: null as string | null
  },
  reducers: {
    setUser: (state, { payload }: PayloadAction<Me | null>) => {
      state.data = payload;
    },
    setInitData: (state, { payload }: PayloadAction<string | null>) => {
      state.initData = payload;
    },
    setLink: (state, { payload }: PayloadAction<UserLinks>) => {
      state.link = payload;
    },
    updatePoints: (state, { payload }: PayloadAction<number>) => {
      if (state?.data) {
        state.data.points += payload;
      }
    },
    decreaseUsedSpace: (state, { payload }: PayloadAction<number>) => {
      if (state?.data) {
        state.data.space_used -= payload;
      }
    },
    increaseUsedSpace: (state, { payload }: PayloadAction<number>) => {
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
