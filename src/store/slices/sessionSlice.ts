import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { SessionState } from '../../types';

// Время сессии - 2 часа
const SESSION_DURATION = 2 * 60 * 60 * 1000;

const getInitialState = (): SessionState => {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + SESSION_DURATION);

  return {
    userId: uuidv4(),
    startedAt: now.toISOString(),
    expiresAt: expiryTime.toISOString(),
    lastActivity: now.toISOString(),
    currentTest: '',
    currentPage: '',
    progress: {
      profile: false,
      email: false,
    },
    active: true,
  };
};

const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState(),
  reducers: {
    updateSession: (state, action: PayloadAction<Partial<SessionState>>) => {
      return { ...state, ...action.payload };
    },
    updateLastActivity: (state) => {
      const now = new Date();
      state.lastActivity = now.toISOString();
      state.expiresAt = new Date(now.getTime() + SESSION_DURATION).toISOString();
    },
    setCurrentTest: (state, action: PayloadAction<string>) => {
      state.currentTest = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    updateProgress: (
      state,
      action: PayloadAction<{
        key: string;
        value: boolean | { completed: boolean; currentPage: string; answeredQuestions: string[] };
      }>
    ) => {
      const { key, value } = action.payload;
      state.progress[key] = value;
    },
    resetSession: () => {
      return getInitialState();
    },
    clearProgress: (state) => {
      state.progress = {
        profile: false,
        email: false,
      };
    }
  },
});

export const {
  updateSession,
  updateLastActivity,
  setCurrentTest,
  setCurrentPage,
  updateProgress,
  resetSession,
  clearProgress
} = sessionSlice.actions;
export default sessionSlice.reducer;