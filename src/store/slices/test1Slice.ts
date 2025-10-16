import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Test1Answers, Test1TaskAnswers, RatingValue } from '../../types/test1Types';
import { initializeEmptyTaskAnswers } from '../../data/test1Data';

interface Test1State {
  currentTask: 'task1' | 'task2' | 'task3';
  answers: Test1Answers;
  completed: boolean;
}

const initialState: Test1State = {
  currentTask: 'task1',
  answers: {
    task1: initializeEmptyTaskAnswers(),
    task2: initializeEmptyTaskAnswers(),
    task3: initializeEmptyTaskAnswers(),
  },
  completed: false,
};

const test1Slice = createSlice({
  name: 'test1',
  initialState,
  reducers: {
    // Обновление ответа для конкретной пары прилагательных
    updateAnswer: (
      state,
      action: PayloadAction<{
        task: 'task1' | 'task2' | 'task3';
        pairId: number;
        value: RatingValue | null;
      }>
    ) => {
      const { task, pairId, value } = action.payload;
      state.answers[task][pairId] = value;
      
      // Сохраняем обновленное состояние в localStorage
      localStorage.setItem('test1', JSON.stringify({
        currentTask: state.currentTask,
        answers: state.answers,
        completed: state.completed
      }));
    },

    // Переход к следующему заданию
    nextTask: (state) => {
      if (state.currentTask === 'task1') {
        state.currentTask = 'task2';
      } else if (state.currentTask === 'task2') {
        state.currentTask = 'task3';
      } else if (state.currentTask === 'task3') {
        state.completed = true;
      }
      
      // Сохраняем обновленное состояние в localStorage
      localStorage.setItem('test1', JSON.stringify({
        currentTask: state.currentTask,
        answers: state.answers,
        completed: state.completed
      }));
    },

    // Сброс состояния теста
    resetTest: () => initialState,
    
    // Загрузка сохраненных ответов
    loadAnswers: (state, action: PayloadAction<Test1Answers>) => {
      state.answers = action.payload;
    },
    
    // Установка текущего задания
    setCurrentTask: (state, action: PayloadAction<'task1' | 'task2' | 'task3'>) => {
      state.currentTask = action.payload;
    },
    
    // Отметка теста как завершенного
    completeTest: (state) => {
      state.completed = true;
    }
  },
});

export const {
  updateAnswer,
  nextTask,
  resetTest,
  loadAnswers,
  setCurrentTask,
  completeTest
} = test1Slice.actions;

export default test1Slice.reducer;
