import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import CustomButton from '../common/CustomButton';
import CustomRadioButton from '../common/CustomRadioButton';
import CustomTooltip from '../common/CustomTooltip';
import { TextNormal, TextNormalBold, TextNormalSemibold } from '../common/Typography';
import { Test6Answer, TEST6_TASK2_QUESTIONS } from '../../types/test6Types';
import { setAnswer, completeTest } from '../../store/slices/test6Slice';
import { submitAllData } from '../../utils/api';
import { theme } from '../../theme/theme';

const TaskContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
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

const Instruction = styled(TextNormal)`
  margin-top: 12px;
  margin-bottom: 24px;
`;

const TaskTitle = styled(TextNormalBold)`
  margin-bottom: 16px;
`;

const QuestionsContainer = styled.div`
  margin-bottom: 2rem;
`;

const QuestionItem = styled.div`
  margin-bottom: 24px;
`;

const QuestionContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 100%;
  margin-bottom: 8px;
  flex-shrink: 0;
`;

const QuestionText = styled(TextNormalSemibold)`
  position: relative;
  display: inline-block;
`;

const TooltipContainer = styled.div`
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  pointer-events: none;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    right: auto;
    left: 50%;
    top: 0;
    bottom: auto;
    transform: translateX(-50%);
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ButtonsContainer = styled.div`
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
`;

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

const Test6Task2: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const [answers, setAnswers] = useState<Record<number, Test6Answer>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const test6State = useAppSelector((state) => state.test6);
  const profile = useAppSelector((state) => state.profile);

  useEffect(() => {
    // Загружаем сохраненные ответы из localStorage
    const savedData = localStorage.getItem('test6');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.task2?.answers) {
          setAnswers(parsedData.task2.answers);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных test6 из localStorage:', error);
      }
    }

    // Также загружаем из Redux store
    if (test6State.task2.answers) {
      setAnswers(test6State.task2.answers);
    }
  }, [test6State.task2.answers]);

  const handleAnswerChange = (questionId: number, answer: Test6Answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    dispatch(setAnswer({ task: 'task2', questionId, answer }));
    
    // Убираем ошибку только для текущего вопроса
    if (answer) {
      setQuestionErrors(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const validateAnswers = (): boolean => {
    const unansweredQuestions = TEST6_TASK2_QUESTIONS.filter(
      question => !answers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      // Устанавливаем ошибки только для неотвеченных вопросов
      const newErrors: Record<number, boolean> = {};
      unansweredQuestions.forEach(question => {
        newErrors[question.id] = true;
      });
      setQuestionErrors(prev => ({ ...prev, ...newErrors }));
      
      // Прокрутка к первому неотвеченному вопросу
      const firstUnansweredId = unansweredQuestions[0].id;
      const element = document.getElementById(`question-${firstUnansweredId}`);
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
      }
      
      return false;
    }

    return true;
  };

  const handleNextTest = async () => {
    if (!validateAnswers()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Завершаем тест и записываем время окончания
      dispatch(completeTest());
      
      // Сохраняем ответы в localStorage для использования в submitAllData
      const test6Data = {
        task1: test6State.task1 || { answers: {} },
        task2: {
          answers: answers
        },
        startedAt: test6State.startedAt,
        completedAt: new Date().toISOString(),
        timeSpent: test6State.startedAt ? Math.floor((new Date().getTime() - new Date(test6State.startedAt).getTime()) / 1000) : null
      };
      
      console.log('Сохраняем данные test6 в localStorage:', test6Data);
      localStorage.setItem('test6', JSON.stringify(test6Data));

      // Получаем userId
      const userId = localStorage.getItem('userId') || '';
      console.log('UserId:', userId);
      console.log('Profile из Redux:', profile);
      console.log('Profile из localStorage:', localStorage.getItem('profile'));

      // Данные будут отправлены только при завершении всего тестирования
      
      // Переходим к следующему тесту
      navigate('/test-intro/test7');
    } catch (error) {
      console.error('Ошибка при отправке данных теста 6:', error);
      setIsSubmitting(false);
    }
  };


  return (
    <TaskContainer>
      <HeaderContainer>
        <Title>Тест №6</Title>
        <TestCounter>Пройдено тестов: 5 из 7</TestCounter>
      </HeaderContainer>

      <Instruction>
        Каждому утверждению соответствуют 4 варианта ответа. Выберите тот из ответов, который соответствует вашему состоянию.
      </Instruction>

      <TaskTitle>Задание 2</TaskTitle>

      <QuestionsContainer>
        {TEST6_TASK2_QUESTIONS.map((question) => {
          const hasError = questionErrors[question.id] || false;
          
          return (
            <QuestionItem key={question.id} id={`question-${question.id}`}>
              <QuestionContainer>
                <QuestionText>
                  {question.id}. {question.text}
                  {hasError && (
                    <TooltipContainer>
                      <CustomTooltip
                        content="Выберите вариант ответа"
                        type="error"
                        position={isMobile ? "bottom" : "left"}
                        forceVisible={true}
                        disabled={false}
                      >
                        <div style={{ width: '1px', height: '1px' }} />
                      </CustomTooltip>
                    </TooltipContainer>
                  )}
                </QuestionText>
              </QuestionContainer>
              <OptionsContainer>
                {question.options.map((option) => (
                  <CustomRadioButton
                    key={option.id}
                    name={`question_${question.id}`}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={(value) => handleAnswerChange(question.id, value as Test6Answer)}
                    label={option.text}
                  />
                ))}
              </OptionsContainer>
            </QuestionItem>
          );
        })}
      </QuestionsContainer>

      <ButtonsContainer>
        <CustomButton 
          onClick={handleNextTest} 
          variant="primary" 
          disabled={isSubmitting}
          iconRight="arrow-right.svg"
        >
          {isSubmitting ? 'Отправка...' : 'Следующий тест'}
        </CustomButton>
      </ButtonsContainer>

    </TaskContainer>
  );
};

export default Test6Task2;
