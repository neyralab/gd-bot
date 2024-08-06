import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    partners: {
      games: [],
      tasks: []
    }
  },
  reducers: {
    handleTasks: (state, { payload }) => {
      state.tasks = payload;
    },
    handlePartners: (state, { payload }) => {
      state.partners.games = payload?.games || [];
      state.partners.tasks = payload?.tasks || [];
    }
  }
});

export const { handleTasks, handlePartners } = taskSlice.actions;
export default taskSlice.reducer;

export const selectTasks = (state) => state.task.tasks;
export const selectPartners = (state) => state.task.partners;
