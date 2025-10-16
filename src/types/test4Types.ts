// Типы для Теста №4

// Варианты ответов
export enum Test4AnswerOption {
  NOT_AT_ALL = 'Совсем не соответствует',
  SLIGHTLY = 'Немного соответствует',
  MODERATELY = 'Средне соответствует',
  CONSIDERABLY = 'В значительной мере соответствует',
  ALMOST_COMPLETELY = 'Почти полностью соответствует'
}

// Тип ответа на вопрос
export type Test4Answer = Test4AnswerOption | null;

// Ответы на тест
export interface Test4Answers {
  [questionId: number]: Test4Answer;
}

// Данные для отправки в Google Sheets
export interface Test4Data {
  answers: {
    [questionId: number]: {
      question: string;
      answer: string;
    };
  };
}

// Данные для отправки в Google Sheets (полные данные)
export interface Test4CompleteData {
  answers: {
    [questionId: string]: {
      question: string;
      answer: string;
    };
  };
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number | null;
}
