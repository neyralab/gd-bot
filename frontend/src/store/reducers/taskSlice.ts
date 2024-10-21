import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Task } from '../../effects/types/tasks';

interface Partners {
  games: Task[];
  tasks: Task[];
}

interface InitialState {
  tasks: Task[];
  partners: Partners;
}

const initialState: InitialState = {
  tasks: [],
  partners: {
    games: [],
    tasks: []
  }
};

const taskSlice = createSlice({
  name: 'task',
  initialState: initialState,
  reducers: {
    handleTasks: (state, { payload }: PayloadAction<Task[]>) => {
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

export const selectTasks = (state: RootState) => state.task.tasks;
export const selectPartners = (state: RootState) => state.task.partners;
