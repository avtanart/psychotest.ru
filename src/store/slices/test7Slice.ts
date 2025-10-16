import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Test7Answer, Test7Answers } from '../../types/test7Types';

interface Test7State {
  page1: {
    answers: { [key: number]: Test7Answer };
  };
  page2: {
    answers: { [key: number]: Test7Answer };
  };
  page3: {
    answers: { [key: number]: Test7Answer };
  };
  page4: {
    answers: { [key: number]: Test7Answer };
  };
  page5: {
    answers: { [key: number]: Test7Answer };
  };
  currentPage: 'page1' | 'page2' | 'page3' | 'page4' | 'page5';
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number | null;
}

const initialState: Test7State = {
  page1: {
    answers: {}
  },
  page2: {
    answers: {}
  },
  page3: {
    answers: {}
  },
  page4: {
    answers: {}
  },
  page5: {
    answers: {}
  },
  currentPage: 'page1',
  startedAt: null,
  completedAt: null,
  timeSpent: null,
};

export const test7Slice = createSlice({
  name: 'test7',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ page: 'page1' | 'page2' | 'page3' | 'page4' | 'page5'; questionId: number; answer: Test7Answer }>) => {
      const { page, questionId, answer } = action.payload;
      state[page].answers[questionId] = answer;
      
      // Сохраняем в localStorage
      localStorage.setItem('test7', JSON.stringify({
        page1: state.page1,
        page2: state.page2,
        page3: state.page3,
        page4: state.page4,
        page5: state.page5,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        timeSpent: state.timeSpent
      }));
    },
    setCurrentPage: (state, action: PayloadAction<'page1' | 'page2' | 'page3' | 'page4' | 'page5'>) => {
      state.currentPage = action.payload;
    },
    setStartTime: (state) => {
      if (!state.startedAt) {
        state.startedAt = new Date().toISOString();
      }
    },
    completeTest: (state) => {
      state.completedAt = new Date().toISOString();
      if (state.startedAt) {
        const startTime = new Date(state.startedAt).getTime();
        const endTime = new Date().getTime();
        state.timeSpent = Math.floor((endTime - startTime) / 1000);
      }
    },
    loadFromStorage: (state) => {
      const stored = localStorage.getItem('test7');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          state.page1 = data.page1 || { answers: {} };
          state.page2 = data.page2 || { answers: {} };
          state.page3 = data.page3 || { answers: {} };
          state.page4 = data.page4 || { answers: {} };
          state.page5 = data.page5 || { answers: {} };
          state.startedAt = data.startedAt || null;
          state.completedAt = data.completedAt || null;
          state.timeSpent = data.timeSpent || null;
        } catch (error) {
          console.error('Ошибка при загрузке данных теста 7 из localStorage:', error);
        }
      }
    },
    clearTest: (state) => {
      state.page1 = { answers: {} };
      state.page2 = { answers: {} };
      state.page3 = { answers: {} };
      state.page4 = { answers: {} };
      state.page5 = { answers: {} };
      state.currentPage = 'page1';
      state.startedAt = null;
      state.completedAt = null;
      state.timeSpent = null;
      localStorage.removeItem('test7');
    }
  },
});

export const { 
  setAnswer, 
  setCurrentPage, 
  setStartTime, 
  completeTest, 
  loadFromStorage, 
  clearTest 
} = test7Slice.actions;

export default test7Slice.reducer;
