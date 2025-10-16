import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  currentTest: string | null;
  currentPage: string | null;
  completed: boolean;
}

const initialState: NavigationState = {
  currentTest: null,
  currentPage: null,
  completed: false,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentTest: (state, action: PayloadAction<string | null>) => {
      state.currentTest = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string | null>) => {
      state.currentPage = action.payload;
    },
    setCompleted: (state, action: PayloadAction<boolean>) => {
      state.completed = action.payload;
    },
    resetNavigation: () => {
      return initialState;
    },
  },
});

export const { setCurrentTest, setCurrentPage, setCompleted, resetNavigation } =
  navigationSlice.actions;
export default navigationSlice.reducer;
