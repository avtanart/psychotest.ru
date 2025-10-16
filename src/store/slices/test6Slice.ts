import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Test6Answer, Test6Answers } from '../../types/test6Types';

interface Test6State {
  task1: {
    answers: { [key: number]: Test6Answer };
  };
  task2: {
    answers: { [key: number]: Test6Answer };
  };
  currentTask: 'task1' | 'task2';
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number | null;
}

const initialState: Test6State = {
  task1: {
    answers: {}
  },
  task2: {
    answers: {}
  },
  currentTask: 'task1',
  startedAt: null,
  completedAt: null,
  timeSpent: null,
};

export const test6Slice = createSlice({
  name: 'test6',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ task: 'task1' | 'task2'; questionId: number; answer: Test6Answer }>) => {
      const { task, questionId, answer } = action.payload;
      state[task].answers[questionId] = answer;
      
      // Сохраняем в localStorage
      localStorage.setItem('test6', JSON.stringify({
        task1: state.task1,
        task2: state.task2,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        timeSpent: state.timeSpent
      }));
    },
    setCurrentTask: (state, action: PayloadAction<'task1' | 'task2'>) => {
      state.currentTask = action.payload;
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
      
      // Сохраняем в localStorage
      localStorage.setItem('test6', JSON.stringify({
        task1: state.task1,
        task2: state.task2,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        timeSpent: state.timeSpent
      }));
    },
    resetTest: () => initialState,
  },
});

export const { setAnswer, setCurrentTask, setStartTime, completeTest, resetTest } = test6Slice.actions;

export default test6Slice.reducer;
