import { configureStore, Action, AnyAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import profileReducer from './slices/profileSlice';
import answersReducer from './slices/answersSlice';
import sessionReducer from './slices/sessionSlice';
import navigationReducer from './slices/navigationSlice';
import test1Reducer from './slices/test1Slice';
import test3Reducer from './slices/test3Slice';
import test4Reducer from './slices/test4Slice';
import test5Reducer from './slices/test5Slice';
import test6Reducer from './slices/test6Slice';
import test7Reducer from './slices/test7Slice';
import { ProfileData } from '../types';

// Создаем интерфейс для типа состояния test2
interface Test2State {
  currentTask: 'task1' | 'task2';
  answers: {
    task1: Record<number, any>;
    task2: Record<number, any>;
  };
  completed: boolean;
}

// Начальное состояние
const initialState: Test2State = {
  currentTask: 'task1',
  answers: {
    task1: {},
    task2: {}
  },
  completed: false
};

// Создаем редюсер для test2
const test2Reducer = (state: Test2State = initialState, action: AnyAction): Test2State => {
  // Проверяем тип действия
  if (action.type === 'test2/updateAnswer' && action.payload?.task && action.payload?.questionId !== undefined) {
    const { task, questionId, answer } = action.payload;
    const newState: Test2State = {
      ...state,
      answers: {
        ...state.answers,
        [task]: {
          ...state.answers[task as keyof typeof state.answers],
          [questionId]: answer
        }
      }
    };
    
    // Сохраняем обновленное состояние в localStorage
    localStorage.setItem('test2', JSON.stringify(newState));
    
    return newState;
  }
  
  if (action.type === 'test2/nextTask') {
    let newState: Test2State;
    
    if (state.currentTask === 'task1') {
      newState = {
        ...state,
        currentTask: 'task2'
      };
    } else if (state.currentTask === 'task2') {
      newState = {
        ...state,
        completed: true
      };
    } else {
      newState = state;
    }
    
    // Сохраняем обновленное состояние в localStorage
    localStorage.setItem('test2', JSON.stringify(newState));
    
    return newState;
  }
  
  return state;
};

// Функция для загрузки профиля из localStorage
const loadProfileFromStorage = (): ProfileData | undefined => {
  try {
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
  } catch (error) {
    console.error('Ошибка при загрузке профиля из localStorage:', error);
  }
  return undefined;
};

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    answers: answersReducer,
    session: sessionReducer,
    navigation: navigationReducer,
    test1: test1Reducer,
    test2: test2Reducer,
    test3: test3Reducer,
    test4: test4Reducer,
    test5: test5Reducer,
    test6: test6Reducer,
    test7: test7Reducer,
  },
  preloadedState: {
    profile: loadProfileFromStorage() || {
      name: '',
      gender: '',
      age: 0,
      education: '',
      maritalStatus: '',
      children: '',
      hasChronicDiseases: '',
      diseases: {
        hypertension: false,
        coronaryHeartDisease: false,
        heartFailure: false,
        asthma: false,
        chronicBronchitis: false,
        copd: false,
        diabetesType1: false,
        diabetesType2: false,
        cancer: false,
        hiv: false,
        hypothyroidism: false,
        recurrentDepression: false,
        generalizedAnxietyDisorder: false,
        bipolarAffectiveDisorder: false,
        other: ''
      },
      takesMedications: '',
      medications: {
        oralContraceptives: false,
        vitaminD: false,
        ironSupplements: false,
        thyroidHormones: false,
        iodineOrThyrostatics: false,
        statins: false,
        antidepressants: false,
        insulin: false,
        herbalTinctures: false,
        other: ''
      }
    }
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;