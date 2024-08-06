import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    partners: []
  },
  reducers: {
    handleTasks: (state, { payload }) => {
      state.tasks = payload;
    },
    handlePartners: (state, { payload }) => {
      state.partners = payload;
    }
  }
});

export const { handleTasks, handlePartners } = taskSlice.actions;
export default taskSlice.reducer;

export const selectTasks = (state) => state.task.tasks;
export const selectPartners = (state) => state.task.partners;
