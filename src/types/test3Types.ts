// Типы для Теста №3

// Вопрос теста
export interface Test3Question {
  id: number;
  text: string;
}

// Варианты ответов
export enum Test3AnswerOption {
  NO = 'Нет',
  RATHER_NO = 'Скорее нет, чем да',
  RATHER_YES = 'Скорее да, чем нет',
  YES = 'Да'
}

// Тип ответа на вопрос
export type Test3Answer = Test3AnswerOption | null;

// Ответы на тест
export interface Test3Answers {
  [questionId: number]: Test3Answer;
}

// Данные для отправки в Google Sheets
export interface Test3Data {
  answers: {
    [questionId: number]: {
      question: string;
      answer: string;
    };
  };
}

// Данные для отправки в Google Sheets (полные данные)
export interface Test3CompleteData {
  answers: {
    [questionId: number]: {
      question: string;
      answer: string;
    };
  };
}
