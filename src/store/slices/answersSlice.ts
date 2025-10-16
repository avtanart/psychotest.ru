import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAnswers, TestResult, Answer } from '../../types';

const initialState: UserAnswers = {};

const answersSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {
    startTest: (state, action: PayloadAction<{ testId: string }>) => {
      const { testId } = action.payload;
      if (!state[testId]) {
        state[testId] = {
          startedAt: new Date().toISOString(),
          answers: {},
        };
      }
    },
    saveAnswer: (
      state,
      action: PayloadAction<{ testId: string; questionId: string; answer: Answer }>
    ) => {
      const { testId, questionId, answer } = action.payload;
      if (!state[testId]) {
        state[testId] = {
          startedAt: new Date().toISOString(),
          answers: {},
        };
      }
      state[testId].answers[questionId] = answer;
    },
    completeTest: (state, action: PayloadAction<{ testId: string }>) => {
      const { testId } = action.payload;
      if (state[testId]) {
        // Устанавливаем время завершения
        const completedAt = new Date().toISOString();
        state[testId].completedAt = completedAt;
        
        // Рассчитываем затраченное время
        if (state[testId].startedAt) {
          const startTime = new Date(state[testId].startedAt).getTime();
          // Используем completedAt напрямую, так как мы только что его установили
          const endTime = new Date(completedAt).getTime();
          state[testId].timeSpent = Math.floor((endTime - startTime) / 1000);
        }
      }
    },
    setTestAnswers: (
      state,
      action: PayloadAction<{ testId: string; testResult: TestResult }>
    ) => {
      const { testId, testResult } = action.payload;
      state[testId] = testResult;
    },
    clearAnswers: () => {
      return {};
    },
  },
});

export const { startTest, saveAnswer, completeTest, setTestAnswers, clearAnswers } =
  answersSlice.actions;
export default answersSlice.reducer;