import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Test5Answer } from '../../types/test5Types';

interface Test5State {
  answers: Record<number, Test5Answer>;
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number | null;
}

const initialState: Test5State = {
  answers: {},
  startedAt: null,
  completedAt: null,
  timeSpent: null,
};

export const test5Slice = createSlice({
  name: 'test5',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ taskId: number; answer: Test5Answer }>) => {
      const { taskId, answer } = action.payload;
      state.answers[taskId] = answer;
    },
    setStartTime: (state) => {
      state.startedAt = new Date().toISOString();
    },
    completeTest: (state) => {
      state.completedAt = new Date().toISOString();
      if (state.startedAt) {
        const startTime = new Date(state.startedAt).getTime();
        const endTime = new Date(state.completedAt).getTime();
        state.timeSpent = Math.floor((endTime - startTime) / 1000); // в секундах
      }
    },
    resetTest: () => initialState,
  },
});

export const { setAnswer, setStartTime, completeTest, resetTest } = test5Slice.actions;

export default test5Slice.reducer;
