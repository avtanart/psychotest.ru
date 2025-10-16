// Типы для Теста №6

// Вопрос теста
export interface Test6Question {
  id: number;
  text: string;
  options: Test6Option[];
}

// Вариант ответа
export interface Test6Option {
  id: string;
  text: string;
}

// Тип ответа на вопрос (выбранный вариант)
export type Test6Answer = string | null;

// Ответы на задание
export interface Test6TaskAnswers {
  [questionId: number]: Test6Answer;
}

// Ответы на тест
export interface Test6Answers {
  task1: Test6TaskAnswers;
  task2: Test6TaskAnswers;
}

// Данные для отправки в Google Sheets
export interface Test6CompleteData {
  task1: {
    answers: {
      [questionId: number]: {
        question: string;
        answer: string;
      };
    };
  };
  task2: {
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

// Данные для задания 1
export const TEST6_TASK1_QUESTIONS: Test6Question[] = [
  {
    id: 1,
    text: 'Я испытываю напряжение, мне не по себе',
    options: [
      { id: 'a', text: 'Все время' },
      { id: 'b', text: 'Часто' },
      { id: 'c', text: 'Время от времени, иногда' },
      { id: 'd', text: 'Совсем не испытываю' }
    ]
  },
  {
    id: 2,
    text: 'Я испытываю страх, кажется, что что-то ужасное может вот-вот случиться',
    options: [
      { id: 'a', text: 'Определенно это так, и страх очень велик' },
      { id: 'b', text: 'Да, это так, но страх не очень велик' },
      { id: 'c', text: 'Иногда, но это меня не беспокоит' },
      { id: 'd', text: 'Совсем не испытываю' }
    ]
  },
  {
    id: 3,
    text: 'Беспокойные мысли крутятся у меня в голове',
    options: [
      { id: 'a', text: 'Постоянно' },
      { id: 'b', text: 'Большую часть времени' },
      { id: 'c', text: 'Время от времени и не так часто' },
      { id: 'd', text: 'Только иногда' }
    ]
  },
  {
    id: 4,
    text: 'Я легко могу присесть и расслабиться',
    options: [
      { id: 'a', text: 'Определенно, это так' },
      { id: 'b', text: 'Наверно, это так' },
      { id: 'c', text: 'Лишь изредка, это так' },
      { id: 'd', text: 'Совсем не могу' }
    ]
  },
  {
    id: 5,
    text: 'Я испытываю внутреннее напряжение или дрожь',
    options: [
      { id: 'a', text: 'Совсем не испытываю' },
      { id: 'b', text: 'Иногда' },
      { id: 'c', text: 'Часто' },
      { id: 'd', text: 'Очень часто' }
    ]
  },
  {
    id: 6,
    text: 'Я испытываю неусидчивость, мне постоянно нужно двигаться',
    options: [
      { id: 'a', text: 'Определенно, это так' },
      { id: 'b', text: 'Наверно, это так' },
      { id: 'c', text: 'Лишь в некоторой степени, это так' },
      { id: 'd', text: 'Совсем не испытываю' }
    ]
  },
  {
    id: 7,
    text: 'У меня бывает внезапное чувство паники',
    options: [
      { id: 'a', text: 'Очень часто' },
      { id: 'b', text: 'Довольно часто' },
      { id: 'c', text: 'Не так уж часто' },
      { id: 'd', text: 'Совсем не бывает' }
    ]
  }
];

// Данные для задания 2
export const TEST6_TASK2_QUESTIONS: Test6Question[] = [
  {
    id: 1,
    text: 'То, что приносило мне большое удовольствие, и сейчас вызывает у меня такое же чувство',
    options: [
      { id: 'a', text: 'Определенно, это так' },
      { id: 'b', text: 'Наверное, это так' },
      { id: 'c', text: 'Лишь в очень малой степени, это так' },
      { id: 'd', text: 'Это совсем не так' }
    ]
  },
  {
    id: 2,
    text: 'Я способен рассмеяться и увидеть в том или ином событии смешное',
    options: [
      { id: 'a', text: 'Определенно, это так' },
      { id: 'b', text: 'Наверное, это так' },
      { id: 'c', text: 'Лишь в очень малой степени, это так' },
      { id: 'd', text: 'Совсем не способен' }
    ]
  },
  {
    id: 3,
    text: 'Я испытываю бодрость',
    options: [
      { id: 'a', text: 'Совсем не испытываю' },
      { id: 'b', text: 'Очень редко' },
      { id: 'c', text: 'Иногда' },
      { id: 'd', text: 'Практически все время' }
    ]
  },
  {
    id: 4,
    text: 'Мне кажется, что я стал все делать очень медленно',
    options: [
      { id: 'a', text: 'Практически все время' },
      { id: 'b', text: 'Часто' },
      { id: 'c', text: 'Иногда' },
      { id: 'd', text: 'Совсем нет' }
    ]
  },
  {
    id: 5,
    text: 'Я не слежу за своей внешностью',
    options: [
      { id: 'a', text: 'Определенно, это так' },
      { id: 'b', text: 'Я не уделяю этому столько времени, сколько нужно' },
      { id: 'c', text: 'Может быть, я стал меньше уделять этому времени' },
      { id: 'd', text: 'Я слежу за собой так же, как и раньше' }
    ]
  },
  {
    id: 6,
    text: 'Я считаю, что мои дела (занятия, увлечения) могут принести мне чувство удовлетворения',
    options: [
      { id: 'a', text: 'Точно так же, как и обычно' },
      { id: 'b', text: 'Да, но не в той степени, как раньше' },
      { id: 'c', text: 'Значительно меньше, чем обычно' },
      { id: 'd', text: 'Совсем так не считаю' }
    ]
  },
  {
    id: 7,
    text: 'Я могу получить удовольствие от хорошей книги, радио- или телепрограммы',
    options: [
      { id: 'a', text: 'Часто' },
      { id: 'b', text: 'Иногда' },
      { id: 'c', text: 'Редко' },
      { id: 'd', text: 'Очень редко' }
    ]
  }
];
