import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import profileReducer from './slices/profileSlice';
import answersReducer from './slices/answersSlice';
import sessionReducer from './slices/sessionSlice';
import navigationReducer from './slices/navigationSlice';
import test7Reducer from './slices/test7Slice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    answers: answersReducer,
    session: sessionReducer,
    navigation: navigationReducer,
    test7: test7Reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
