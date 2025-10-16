import React from 'react';
import Test2Task from '../tests/Test2/Test2Task';

// Вопросы для задания 1
const task1Questions = [
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

// Варианты ответов для задания 1
const task1AnswerOptions = [
  'Совсем нет',
  'Слабо выражено',
  'Выражено',
  'Очень выражено'
];

const Test2Task1: React.FC = () => {
  return (
    <Test2Task
      taskId="task1"
      title="Задание 1"
      instruction={{
        paragraph1: "Ниже вам предложены несколько утверждений, касающихся вашего эмоционального состояния.",
        paragraph2: "В отношении каждого из них нужно решить, насколько данное состояние выражено именно СЕЙЧАС, В ДАННЫЙ МОМЕНТ, СЕГОДНЯ. В зависимости от этого выберите один из четырех вариантов ответа.",
        highlightText: "именно СЕЙЧАС, В ДАННЫЙ МОМЕНТ, СЕГОДНЯ"
      }}
      questions={task1Questions}
      answerOptions={task1AnswerOptions}
      nextRoute="/test2/task2"
      isLastTask={false}
    />
  );
};

export default Test2Task1;