import { Test2Question, Task1AnswerOption, Task2AnswerOption, Test2TaskAnswers } from '../types/test2Types';

// Список вопросов для Задания 1
export const task1Questions: Test2Question[] = [
  { id: 1, text: 'Я нахожусь в напряжении' },
  { id: 2, text: 'Я расстроен' },
  { id: 3, text: 'Я тревожусь о будущем' },
  { id: 4, text: 'Я нервничаю' },
  { id: 5, text: 'Я озабочен' },
  { id: 6, text: 'Я возбужден' },
  { id: 7, text: 'Я ощущаю непонятную угрозу' },
  { id: 8, text: 'Я устаю быстрее обычного' },
  { id: 9, text: 'Я неуверен в себе' },
  { id: 10, text: 'Я избегаю любых конфликтов' },
  { id: 11, text: 'Я чувствую замешательство' },
  { id: 12, text: 'Я ощущаю свою бесполезность' },
  { id: 13, text: 'Я спал беспокойно' },
  { id: 14, text: 'Я ощущаю себя утомленным' },
  { id: 15, text: 'Я эмоционально чувствителен' }
];

// Список вопросов для Задания 2
export const task2Questions: Test2Question[] = [
  { id: 1, text: 'Я находился в напряжении' },
  { id: 2, text: 'Я расстраивался' },
  { id: 3, text: 'Я тревожился о будущем' },
  { id: 4, text: 'Я нервничал' },
  { id: 5, text: 'Я бывал озабочен' },
  { id: 6, text: 'Я бывал возбужден' },
  { id: 7, text: 'Я ощущал непонятную угрозу' },
  { id: 8, text: 'Я быстро уставал' },
  { id: 9, text: 'Я бывал неуверен в себе' },
  { id: 10, text: 'Я избегал любых конфликтов' },
  { id: 11, text: 'Я легко приходил в замешательство' },
  { id: 12, text: 'Я ощущал свою бесполезность' },
  { id: 13, text: 'Я плохо спал' },
  { id: 14, text: 'Я ощущал себя утомленным' },
  { id: 15, text: 'Я бывал эмоционально чувствителен' }
];

// Варианты ответов для Задания 1
export const task1AnswerOptions = [
  Task1AnswerOption.NOT_AT_ALL,
  Task1AnswerOption.SLIGHTLY,
  Task1AnswerOption.MODERATE,
  Task1AnswerOption.VERY_MUCH
];

// Варианты ответов для Задания 2
export const task2AnswerOptions = [
  Task2AnswerOption.ALMOST_NEVER,
  Task2AnswerOption.RARELY,
  Task2AnswerOption.OFTEN,
  Task2AnswerOption.ALMOST_ALWAYS
];

// Инструкции для каждого задания
export const taskInstructions = {
  task1: 'Ниже вам предложены несколько утверждений, касающихся вашего эмоционального состояния. В отношении каждого из них нужно решить, насколько данное состояние выражено именно СЕЙЧАС, В ДАННЫЙ МОМЕНТ, СЕГОДНЯ. В зависимости от этого выберите один из четырех вариантов ответа.',
  task2: 'Ниже вам предложены несколько утверждений, касающихся вашего эмоционального состояния. В отношении каждого из них нужно решить, КАК ЧАСТО на протяжении последнего времени (например, на протяжении последнего года) вы его испытывали. В зависимости от этого выберите один из четырех вариантов ответа.'
};

// Заголовки для каждого задания
export const taskTitles = {
  task1: 'Задание 1',
  task2: 'Задание 2'
};

// Инициализация пустых ответов для задания
export const initializeEmptyTaskAnswers = (questions: Test2Question[]): Test2TaskAnswers => {
  const answers: Test2TaskAnswers = {};
  questions.forEach(question => {
    answers[question.id] = null;
  });
  return answers;
};
