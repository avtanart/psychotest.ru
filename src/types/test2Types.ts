// Типы для Теста №2

// Вопрос теста
export interface Test2Question {
  id: number;
  text: string;
}

// Варианты ответов для задания 1
export enum Task1AnswerOption {
  NOT_AT_ALL = 'Совсем нет',
  SLIGHTLY = 'Слабо выражено',
  MODERATE = 'Выражено',
  VERY_MUCH = 'Очень выражено'
}

// Варианты ответов для задания 2
export enum Task2AnswerOption {
  ALMOST_NEVER = 'Почти никогда',
  RARELY = 'Редко',
  OFTEN = 'Часто',
  ALMOST_ALWAYS = 'Почти все время'
}

// Тип ответа на вопрос
export type Test2Answer = Task1AnswerOption | Task2AnswerOption | null;

// Ответы на одно задание теста
export interface Test2TaskAnswers {
  [questionId: number]: Test2Answer;
}

// Ответы на весь тест
export interface Test2Answers {
  task1: Test2TaskAnswers;
  task2: Test2TaskAnswers;
}

// Данные для отправки в Google Sheets (одно задание)
export interface Test2TaskData {
  task: 'task1' | 'task2';
  answers: {
    [questionId: number]: {
      question: string;
      answer: string;
    };
  };
}

// Данные для отправки в Google Sheets (все задания)
export interface Test2CompleteData {
  task1?: {
    answers: {
      [questionId: number]: {
        question: string;
        answer: string;
      };
    };
  };
  task2?: {
    answers: {
      [questionId: number]: {
        question: string;
        answer: string;
      };
    };
  };
}