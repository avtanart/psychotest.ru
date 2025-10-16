import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Test4Answer } from '../../types/test4Types';

interface Test4State {
  answers: Record<number, Test4Answer>;
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number | null;
}

const initialState: Test4State = {
  answers: {},
  startedAt: null,
  completedAt: null,
  timeSpent: null,
};

export const test4Slice = createSlice({
  name: 'test4',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ questionId: number; answer: Test4Answer }>) => {
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

export const { setAnswer, setStartTime, completeTest, resetTest } = test4Slice.actions;

export default test4Slice.reducer;
