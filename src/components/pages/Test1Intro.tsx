import React from 'react';
import { useNavigate } from 'react-router-dom';
import TestIntro from '../tests/TestIntro';

const Test1Intro: React.FC = () => {
  const navigate = useNavigate();
  const title = 'Тест №1';
  const subtitle = 'Задание 1';
  const description = `Далее Вам будут предложены 25 пар противоположных по смыслу прилагательных, например, «белое – черное». Проанализировав каждую пару, определите, какое из двух прилагательных точнее описывает ваше НАСТОЯЩЕЕ, то, как вы его интуитивно воспринимаете.

Постарайтесь выбирать то или иное прилагательное в каждой из пар, опираясь не на логику и здравый смысл, а на интуицию и воображение. Выбрав одно из прилагательных, отметьте на 3-балльной шкале, насколько точно оно характеризует ваше НАСТОЯЩЕЕ. Чем ближе показатель к «3», тем точнее, с вашей точки зрения, прилагательное описывает ваше НАСТОЯЩЕЕ.

Старайтесь долго не задумываться над вопросами, поскольку правильных или неправильных ответов нет.`;

  const handleStartTest = () => {
    navigate('/test1/task1');
  };

  return (
    <TestIntro 
      testId="test1" 
      title={title} 
      subtitle={subtitle} 
      description={description}
      onStartTest={handleStartTest}
    />
  );
};

export default Test1Intro;
