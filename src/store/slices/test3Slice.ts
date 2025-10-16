import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Test3Answer } from '../../types/test3Types';

interface Test3State {
  answers: Record<number, Test3Answer>;
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number | null;
}

const initialState: Test3State = {
  answers: {},
  startedAt: null,
  completedAt: null,
  timeSpent: null,
};

export const test3Slice = createSlice({
  name: 'test3',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ questionId: number; answer: Test3Answer }>) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
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

export const { setAnswer, setStartTime, completeTest, resetTest } = test3Slice.actions;

export default test3Slice.reducer;
