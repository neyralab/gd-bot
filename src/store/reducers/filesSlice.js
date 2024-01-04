import { createSlice } from '@reduxjs/toolkit';

const filesSlice = createSlice({
  name: 'files',
  initialState: [],
  reducers: {
    setFiles: (state, { payload }) => {
      return [payload, ...state];
    },
  },
});

export const { setFiles } = filesSlice.actions;
export default filesSlice.reducer;
