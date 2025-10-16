// Типы для Теста №7

// Вопрос теста
export interface Test7Question {
  id: number;
  text: string;
  options: Test7Option[];
  answerGroup: 'importance' | 'difficulty' | 'readiness';
}

// Вариант ответа
export interface Test7Option {
  id: string;
  text: string;
}

// Тип ответа на вопрос (выбранный вариант)
export type Test7Answer = string | null;

// Ответы на страницу
export interface Test7PageAnswers {
  [questionId: number]: Test7Answer;
}

// Ответы на тест
export interface Test7Answers {
  page1: Test7PageAnswers;
  page2: Test7PageAnswers;
  page3: Test7PageAnswers;
  page4: Test7PageAnswers;
  page5: Test7PageAnswers;
}

// Данные для отправки в Google Sheets
export interface Test7CompleteData {
  page1: {
    answers: {
      [questionId: number]: {
        question: string;
        answer: string;
      };
    };
  };
  page2: {
    answers: {
      [questionId: number]: {
        question: string;
        answer: string;
      };
    };
  };
  page3: {
    answers: {
      [questionId: number]: {
        question: string;
        answer: string;
      };
    };
  };
  page4: {
    answers: {
      [questionId: number]: {
        question: string;
        answer: string;
      };
    };
  };
  page5: {
    answers: {
      [questionId: number]: {
        question: string;
        answer: string;
      };
    };
  };
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number | null;
}

// Варианты ответов для группы "Важность"
export const TEST7_IMPORTANCE_OPTIONS: Test7Option[] = [
  { id: 'a', text: 'Совершенно не важно' },
  { id: 'b', text: 'Почти не важно' },
  { id: 'c', text: 'Скорее не важно, чем важно' },
  { id: 'd', text: 'Скорее важно, чем не важно' },
  { id: 'e', text: 'Достаточно важно' },
  { id: 'f', text: 'Очень важно' }
];

// Варианты ответов для группы "Сложность"
export const TEST7_DIFFICULTY_OPTIONS: Test7Option[] = [
  { id: 'a', text: 'Очень сложно' },
  { id: 'b', text: 'Достаточно сложно' },
  { id: 'c', text: 'Скорее сложно, чем несложно' },
  { id: 'd', text: 'Скорее несложно, чем сложно' },
  { id: 'e', text: 'Почти несложно' },
  { id: 'f', text: 'Совершенно несложно' }
];

// Варианты ответов для группы "Готовность выполнять"
export const TEST7_READINESS_OPTIONS: Test7Option[] = [
  { id: 'a', text: 'Ни за что не буду' },
  { id: 'b', text: 'Вероятнее всего не буду' },
  { id: 'c', text: 'Скорее не буду, чем буду' },
  { id: 'd', text: 'Скорее буду, чем не буду' },
  { id: 'e', text: 'Вероятнее всего буду' },
  { id: 'f', text: 'Обязательно буду' }
];

// Данные для страницы 1 (вопросы 1-5)
export const TEST7_PAGE1_QUESTIONS: Test7Question[] = [
  {
    id: 1,
    text: 'Врач выявил у вас хроническую болезнь. Важно ли вам знать, какими признаками она проявляется?',
    options: TEST7_IMPORTANCE_OPTIONS,
    answerGroup: 'importance'
  },
  {
    id: 2,
    text: 'Врач назначил вам лекарство, которое нужно принимать каждый день в течение многих лет. Насколько сложно для вас выполнять эту рекомендацию?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  },
  {
    id: 3,
    text: 'Врач назначил вам лекарство, которое нужно принимать несколько раз в день в течение многих лет. Насколько сложно для вас выполнять эту рекомендацию?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  },
  {
    id: 4,
    text: 'Врач назначил вам несколько лекарств, которые нужно принимать каждый день в течение многих лет. Насколько сложно для вас выполнять эту рекомендацию?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  },
  {
    id: 5,
    text: 'Врач предложил вам каждый день в течение многих лет отмечать имеющиеся проявления болезни. Насколько сложно для вас выполнять эту рекомендацию?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  }
];

// Данные для страницы 2 (вопросы 6-10)
export const TEST7_PAGE2_QUESTIONS: Test7Question[] = [
  {
    id: 6,
    text: 'Хроническая болезнь имеет свои проявления. Насколько важно для вас не ощущать эти проявления?',
    options: TEST7_IMPORTANCE_OPTIONS,
    answerGroup: 'importance'
  },
  {
    id: 7,
    text: 'Если у вас есть сексуальная жизнь, насколько важно для вас сохранять её на привычном уровне?',
    options: TEST7_IMPORTANCE_OPTIONS,
    answerGroup: 'importance'
  },
  {
    id: 8,
    text: 'Хроническая болезнь вынуждает изменить привычный образ жизни. Насколько сложно для вас такое изменение?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  },
  {
    id: 9,
    text: 'Хроническая болезнь вынуждает изменить привычную диету. Насколько сложно для вас такое изменение?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  },
  {
    id: 10,
    text: 'Хроническая болезнь может привести к инвалидности. Насколько важно для вас получить или подтвердить группу инвалидности?',
    options: TEST7_IMPORTANCE_OPTIONS,
    answerGroup: 'importance'
  }
];

// Данные для страницы 3 (вопросы 11-15)
export const TEST7_PAGE3_QUESTIONS: Test7Question[] = [
  {
    id: 11,
    text: 'Хроническая болезнь может изменить работу внутренних органов и анализы. Насколько важно для вас знать результаты анализов?',
    options: TEST7_IMPORTANCE_OPTIONS,
    answerGroup: 'importance'
  },
  {
    id: 12,
    text: 'Все люди верят или не верят в Бога. Насколько важно для вас верить в Бога?',
    options: TEST7_IMPORTANCE_OPTIONS,
    answerGroup: 'importance'
  },
  {
    id: 13,
    text: 'Хроническая болезнь приводит к необходимости регулярно посещать врача. Насколько сложно для вас такое врачебное наблюдение?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  },
  {
    id: 14,
    text: 'Приём лекарств может вызывать неприятные ощущения. Насколько сложно для вас будет переносить такие ощущения?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  },
  {
    id: 15,
    text: 'Хроническая болезнь может ограничить привычную жизнь, активный отдых и развлечения. Насколько сложно для вас пойти на такие ограничения?',
    options: TEST7_DIFFICULTY_OPTIONS,
    answerGroup: 'difficulty'
  }
];

// Данные для страницы 4 (вопросы 16-20)
export const TEST7_PAGE4_QUESTIONS: Test7Question[] = [
  {
    id: 16,
    text: 'Врач назначил лекарство, которое нужно принимать каждый день в течение многих лет. Будете ли вы точно выполнять эту рекомендацию?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  },
  {
    id: 17,
    text: 'Врач назначил лекарство, которое нужно принимать несколько раз в день в течение многих лет. Будете ли вы точно выполнять эту рекомендацию?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  },
  {
    id: 18,
    text: 'Врач назначил несколько лекарств, которые нужно принимать каждый день в течение многих лет. Будете ли вы точно выполнять эту рекомендацию?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  },
  {
    id: 19,
    text: 'Врач предложил каждый день в течение многих лет отмечать имеющиеся проявления болезни. Будете ли вы точно выполнять эту рекомендацию?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  },
  {
    id: 20,
    text: 'Врач сообщил, что назначенные лекарства могут вызывать неприятные ощущения, в том числе и те, что вы у себя уже наблюдаете. Будете ли вы принимать такие лекарства?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  }
];

// Данные для страницы 5 (вопросы 21-25)
export const TEST7_PAGE5_QUESTIONS: Test7Question[] = [
  {
    id: 21,
    text: 'Врач сообщил, что назначенные лекарства могут ухудшать сексуальную жизнь. Будете ли вы после этого принимать такие лекарства?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  },
  {
    id: 22,
    text: 'Врач сообщил, что в связи с болезнью нужно изменить привычный образ жизни. Будете ли вы точно выполнять эту рекомендацию?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  },
  {
    id: 23,
    text: 'Врач сообщил, что в связи с болезнью нужно изменить привычную диету. Будете ли вы точно выполнять эту рекомендацию?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  },
  {
    id: 24,
    text: 'Врач сообщил, что в связи с болезнью нужно регулярно приходить на приём. Будете ли вы точно выполнять эту рекомендацию?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  },
  {
    id: 25,
    text: 'Врач сообщил, что в связи с болезнью нужно регулярно сдавать анализы. Будете ли вы точно выполнять эту рекомендацию?',
    options: TEST7_READINESS_OPTIONS,
    answerGroup: 'readiness'
  }
];

// Все вопросы теста
export const TEST7_ALL_QUESTIONS = [
  ...TEST7_PAGE1_QUESTIONS,
  ...TEST7_PAGE2_QUESTIONS,
  ...TEST7_PAGE3_QUESTIONS,
  ...TEST7_PAGE4_QUESTIONS,
  ...TEST7_PAGE5_QUESTIONS
];
