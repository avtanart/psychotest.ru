import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { updateAnswer, nextTask } from '../../../store/slices/test1Slice';
import { updateProgress } from '../../../store/slices/sessionSlice';
import { adjectivePairs, taskInstructions, taskTitles } from '../../../data/test1Data';
import { RatingValue, Test1CompleteData } from '../../../types/test1Types';
import CustomButton from '../../common/CustomButton';
import SemanticDifferentialScale from './SemanticDifferentialScale';
import { submitTest1Data, submitAllData } from '../../../utils/api';
import { theme } from '../../../theme/theme';

const TaskContainer = styled.div`
  width: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: ${theme.typography.header.fontSize};
  font-family: ${theme.typography.header.fontFamily};
  font-weight: ${theme.typography.header.fontWeight};
  line-height: ${theme.typography.header.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

const TestCounter = styled.div`
  font-size: ${theme.typography.textSmall.fontSize};
  font-family: ${theme.typography.textSmall.fontFamily};
  font-weight: ${theme.typography.textSmall.fontWeight};
  line-height: ${theme.typography.textSmall.lineHeight};
  color: ${theme.colors.typography.ghost};
`;

const TaskTitle = styled.h2`
  font-size: ${theme.typography.textNormalBold.fontSize};
  font-family: ${theme.typography.textNormalBold.fontFamily};
  font-weight: ${theme.typography.textNormalBold.fontWeight};
  line-height: ${theme.typography.textNormalBold.lineHeight};
  color: ${theme.colors.typography.primary};
  margin-top: 1rem;
  margin-bottom: 4px;
`;

const Instruction = styled.div`
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  margin-bottom: 24px;
  
  p {
    margin: 0 0 8px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const BoldText = styled.span`
  font-size: ${theme.typography.textNormalBold.fontSize};
  font-family: ${theme.typography.textNormalBold.fontFamily};
  font-weight: ${theme.typography.textNormalBold.fontWeight};
  line-height: ${theme.typography.textNormalBold.lineHeight};
  color: ${theme.colors.typography.primary};
`;

const PairsContainer = styled.div`
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    justify-content: stretch;
    
    button {
      width: 100%;
    }
  }
`;

const SkipButton = styled(CustomButton)`
  margin-right: auto;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    margin-right: 0;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fde2e2;
  border-radius: 4px;
  font-size: 0.9rem;
`;

interface Test1TaskProps {
  taskId: 'task1' | 'task2' | 'task3';
}

// Хук для определения размера экрана
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Синхронная инициализация для правильного определения мобильной версии
    if (typeof window !== 'undefined') {
      return window.innerWidth <= parseInt(theme.breakpoints.desktop);
    }
    return false;
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= parseInt(theme.breakpoints.desktop));
    };

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const Test1Task: React.FC<Test1TaskProps> = ({ taskId }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  
  const test1State = useAppSelector((state) => state.test1);
  const session = useAppSelector((state) => state.session);
  const profile = useAppSelector((state) => state.profile);
  
  const [showErrors, setShowErrors] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Получаем ответы для текущего задания
  const taskAnswers = test1State.answers[taskId];
  
  // Подсчет пройденных тестов
  const completedTests = Object.entries(session.progress)
    .filter(([key, value]) => key !== 'profile' && key !== 'email' && value === true)
    .length;
  
  // Обработчик изменения ответа
  const handleAnswerChange = (pairId: number, value: RatingValue) => {
    dispatch(updateAnswer({ task: taskId, pairId, value }));
    
    // Сбрасываем ошибки при изменении ответа
    setFormError('');
  };
  
  // Валидация ответов
  const validateAnswers = (): boolean => {
    // Проверяем, что все пары имеют ответы
    const unansweredPairs = adjectivePairs.filter(pair => taskAnswers[pair.id] === null);
    
    if (unansweredPairs.length > 0) {
      setFormError(`Пожалуйста, ответьте на все вопросы (${unansweredPairs.length} без ответа)`);
      
      // Прокручиваем страницу к первому незаполненному вопросу
      const firstUnansweredId = unansweredPairs[0].id;
      const element = document.getElementById(`pair-${firstUnansweredId}`);
      if (element) {
        // Якорный скролл до ошибки
        const windowWidth = window.innerWidth;
        const isMobileScreen = windowWidth <= 900;
        
        if (isMobileScreen) {
          // Для мобильной версии - якорный скролл до элемента
          const elementTop = element.offsetTop;
          const scrollPosition = elementTop - 20; // 20px отступ сверху
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        } else {
          // Для десктопной версии - центрирование
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        window.scrollTo(0, 0);
      }
      
      return false;
    }
    
    return true;
  };
  
  // Обработчик нажатия кнопки "Продолжить"
  const handleContinue = () => {
    setShowErrors(true);
    
    if (!validateAnswers()) {
      return;
    }
    
    // Переходим к следующему заданию
    dispatch(nextTask());
    
    // Обновляем прогресс в сессии
    if (taskId === 'task3') {
      // Если это последнее задание, отмечаем тест как завершенный
      dispatch(updateProgress({ key: 'test1', value: true }));
      
      // Переходим к следующему тесту или к форме ввода email
      navigate('/test-intro/test2'); // Предполагаем, что следующий тест - test2
    } else {
      // Если это не последнее задание, переходим к следующему заданию
      const nextTask = taskId === 'task1' ? 'task2' : 'task3';
      navigate(`/test1/${nextTask}`);
    }
  };

  
  
  // Форматирование ответов для отправки
  const formatAnswers = (taskId: 'task1' | 'task2' | 'task3') => {
    const answers = test1State.answers[taskId];
    const formattedAnswers: { [key: number]: { adjective: string; value: number } } = {};
    
    Object.entries(answers).forEach(([pairId, answer]) => {
      if (answer) {
        const pair = adjectivePairs.find(p => p.id === parseInt(pairId));
        if (pair) {
          const adjectiveText = answer.adjective === 'left' ? pair.left : pair.right;
          formattedAnswers[parseInt(pairId)] = {
            adjective: adjectiveText,
            value: answer.value
          };
        }
      }
    });
    
    return formattedAnswers;
  };

  // Функция для рендеринга инструкций с выделением жирным шрифтом
  const renderInstruction = (taskId: 'task1' | 'task2' | 'task3') => {
    const instruction = taskInstructions[taskId];
    
    if (taskId === 'task1') {
      return (
        <Instruction>
          <p>
            Далее Вам будут предложены 25 пар противоположных по смыслу прилагательных, например, «белое – черное». Проанализировав каждую пару, определите, какое из двух прилагательных точнее описывает <BoldText>ваше НАСТОЯЩЕЕ</BoldText>, то, как вы его интуитивно воспринимаете.
          </p>
          <p>
            Постарайтесь выбирать то или иное прилагательное в каждой из пар, опираясь не на логику и здравый смысл, а на интуицию и воображение. <BoldText>Выбрав одно из прилагательных, отметьте на 3-балльной шкале, насколько точно оно характеризует ваше НАСТОЯЩЕЕ.</BoldText> Чем ближе показатель к «3», тем точнее, с вашей точки зрения, прилагательное описывает ваше НАСТОЯЩЕЕ.
          </p>
          <p>
            Старайтесь долго не задумываться над вопросами, поскольку правильных или неправильных ответов нет.
          </p>
        </Instruction>
      );
    } else if (taskId === 'task2') {
      return (
        <Instruction>
          <p>
            Теперь точно так же, проанализировав каждую из 25 пар противоположных по смыслу прилагательных, определите, какие из них наиболее точно описывают <BoldText>ваше ПРОШЛОЕ и насколько</BoldText>. Вновь постарайтесь выбирать то или иное прилагательное в каждой из пар, опираясь не на логику и здравый смысл, а на интуицию и воображение.
          </p>
        </Instruction>
      );
    } else if (taskId === 'task3') {
      return (
        <Instruction>
          <p>
            Теперь точно так же, проанализировав каждую из 25 пар противоположных по смыслу прилагательных, определите, какие из них наиболее точно описывают <BoldText>ваше БУДУЩЕЕ и насколько</BoldText>. Вновь постарайтесь выбирать то или иное прилагательное в каждой из пар, опираясь не на логику и здравый смысл, а на интуицию и воображение.
          </p>
        </Instruction>
      );
    }
    
    return <Instruction>{instruction}</Instruction>;
  };
  
  
  return (
    <TaskContainer>
      <HeaderContainer>
        <Title>Тест №1</Title>
        <TestCounter>Пройдено тестов: {completedTests} из 7</TestCounter>
      </HeaderContainer>
      
      <TaskTitle>{taskTitles[taskId]}</TaskTitle>
      {renderInstruction(taskId)}
      
      
      <PairsContainer>
        {adjectivePairs.map(pair => (
          <SemanticDifferentialScale
            key={pair.id}
            pair={pair}
            value={taskAnswers[pair.id]}
            onChange={(value) => handleAnswerChange(pair.id, value)}
            showError={showErrors}
          />
        ))}
      </PairsContainer>
      
      <ButtonContainer>
        <CustomButton 
          onClick={handleContinue}
          iconRight="arrow-right.svg"
        >
          {taskId === 'task3' ? 'Следующий тест' : 'Продолжить'}
        </CustomButton>
      </ButtonContainer>
      
    </TaskContainer>
  );
};

export default Test1Task;