import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: []
  },
  reducers: {
    handleTasks: (state, { payload }) => {
      state.tasks = payload;
    }
  }
});

export const { handleTasks } = taskSlice.actions;
export default taskSlice.reducer;

export const selectTasks = (state) => state.task.tasks;
