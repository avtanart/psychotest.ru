import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Test2Answers, Test2Answer } from '../../types/test2Types';
import { initializeEmptyTaskAnswers, task1Questions, task2Questions } from '../../data/test2Data';

interface Test2State {
  currentTask: 'task1' | 'task2';
  answers: Test2Answers;
  completed: boolean;
}

const initialState: Test2State = {
  currentTask: 'task1',
  answers: {
    task1: initializeEmptyTaskAnswers(task1Questions),
    task2: initializeEmptyTaskAnswers(task2Questions),
  },
  completed: false,
};

const test2Slice = createSlice({
  name: 'test2',
  initialState,
  reducers: {
    // Обновление ответа для конкретного вопроса
    updateAnswer: (
      state,
      action: PayloadAction<{
        task: 'task1' | 'task2';
        questionId: number;
        answer: Test2Answer;
      }>
    ) => {
      const { task, questionId, answer } = action.payload;
      state.answers[task][questionId] = answer;
    },

    // Переход к следующему заданию
    nextTask: (state) => {
      if (state.currentTask === 'task1') {
        state.currentTask = 'task2';
      } else if (state.currentTask === 'task2') {
        state.completed = true;
      }
    },

    // Сброс состояния теста
    resetTest: () => initialState,
    
    // Загрузка сохраненных ответов
    loadAnswers: (state, action: PayloadAction<Test2Answers>) => {
      state.answers = action.payload;
    },
    
    // Установка текущего задания
    setCurrentTask: (state, action: PayloadAction<'task1' | 'task2'>) => {
      state.currentTask = action.payload;
    },
    
    // Отметка теста как завершенного
    completeTest: (state) => {
      state.completed = true;
    },
    
    // Очистка данных теста (сброс к начальному состоянию)
    clearTestData: () => initialState
  },
});

export const {
  updateAnswer,
  nextTask,
  resetTest,
  loadAnswers,
  setCurrentTask,
  completeTest,
  clearTestData
} = test2Slice.actions;

export default test2Slice.reducer;
