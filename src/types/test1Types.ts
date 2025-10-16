// Типы для Теста №1

// Пары прилагательных
export interface AdjectivePair {
  id: number;
  left: string;
  right: string;
}

// Значение выбора (1-3 для левого или правого прилагательного)
export interface RatingValue {
  adjective: 'left' | 'right'; // Выбранное прилагательное (левое или правое)
  value: 1 | 2 | 3; // Значение (1, 2 или 3)
}

// Ответы на одно задание теста
export interface Test1TaskAnswers {
  [pairId: number]: RatingValue | null; // null означает, что ответ не выбран
}

// Ответы на весь тест
export interface Test1Answers {
  task1: Test1TaskAnswers;
  task2: Test1TaskAnswers;
  task3: Test1TaskAnswers;
}

// Данные для отправки в Google Sheets (одно задание)
export interface Test1TaskData {
  task: 'task1' | 'task2' | 'task3';
  answers: {
    [pairId: number]: {
      adjective: string; // Текст выбранного прилагательного
      value: number; // Значение (1-3)
    };
  };
}

// Данные для отправки в Google Sheets (все задания)
export interface Test1CompleteData {
  task1?: {
    answers: {
      [pairId: number]: {
        adjective: string;
        value: number;
      };
    };
  };
  task2?: {
    answers: {
      [pairId: number]: {
        adjective: string;
        value: number;
      };
    };
  };
  task3?: {
    answers: {
      [pairId: number]: {
        adjective: string;
        value: number;
      };
    };
  };
}