import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import CustomButton from '../common/CustomButton';
import AnswerButton from '../common/AnswerButton';
import CustomTooltip from '../common/CustomTooltip';
import { TextNormal, TextNormalBold, TextNormalSemibold } from '../common/Typography';
import { Test3AnswerOption } from '../../types/test3Types';
import { getTestById } from '../../data/testData';
import { setAnswer, setStartTime, completeTest } from '../../store/slices/test3Slice';
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
  margin-top: 8px;
  margin-bottom: 24px;
`;

const QuestionsContainer = styled.div`
`;

const QuestionItem = styled.div`
  margin-bottom: 24px;
`;

const QuestionText = styled(TextNormalSemibold)`
  margin-bottom: 8px;
`;

const AnswersWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const AnswersRow = styled.div<{ $hasError: boolean }>`
  display: flex;
  gap: 8px;
  flex: 1;
  position: relative;
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
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    margin-right: 0;
  }
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

const Test3Task: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const [answers, setAnswers] = useState<Record<string, Test3AnswerOption>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  
  // Получаем данные теста
  const test = getTestById('test3');
  const questions = test?.pages[0]?.questions || [];
  
  // Получаем данные профиля и ID пользователя
  const userId = useAppSelector(state => (state as any).session.userId);
  const profile = useAppSelector(state => state.profile);
  
  // Устанавливаем время начала теста
  useEffect(() => {
    dispatch(setStartTime());
  }, [dispatch]);

  // Обработчик изменения ответа
  const handleAnswerChange = (questionId: string, value: Test3AnswerOption) => {
    // Обновляем локальное состояние
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Обновляем состояние в Redux
    const questionNumber = parseInt(questionId.replace('test3_q', ''));
    dispatch(setAnswer({ questionId: questionNumber, answer: value }));
  };

  // Проверка заполнения всех вопросов
  const validateAnswers = () => {
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    
    if (unansweredQuestions.length > 0) {
      // Прокручиваем страницу к первому незаполненному вопросу
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

  // Обработчик нажатия кнопки "Проверить"
  const handleCheck = async () => {
    // Защита от повторной отправки
    if (isSubmitting) {
      return;
    }

    setShowErrors(true);
    
    if (!validateAnswers()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Завершаем тест и записываем время окончания
      dispatch(completeTest());
      
      // Сохраняем ответы в localStorage для использования в submitAllData
      localStorage.setItem('test3', JSON.stringify({
        answers: Object.keys(answers).reduce((acc, key) => {
          acc[key] = answers[key];
          return acc;
        }, {} as Record<string, Test3AnswerOption>)
      }));
      
      // Данные будут отправлены только при завершении всего тестирования
    } catch (error) {
      console.error('Ошибка при отправке данных теста 3:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик нажатия кнопки "Следующий тест"
  const handleNext = async () => {
    // Защита от повторной отправки
    if (isSubmitting) {
      return;
    }

    setShowErrors(true);
    
    if (!validateAnswers()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Завершаем тест и записываем время окончания
      dispatch(completeTest());
      
      // Сохраняем ответы в localStorage для использования в submitAllData
      localStorage.setItem('test3', JSON.stringify({
        answers: Object.keys(answers).reduce((acc, key) => {
          acc[key] = answers[key];
          return acc;
        }, {} as Record<string, Test3AnswerOption>)
      }));
      
      // Обновляем профиль в localStorage для гарантии актуальности данных
      localStorage.setItem('profile', JSON.stringify(profile));
      
      // Данные будут отправлены только при завершении всего тестирования
      
      // Переходим к следующему тесту
      navigate('/test-intro/test4');
    } catch (error) {
      console.error('Ошибка при отправке данных теста 3:', error);
      setIsSubmitting(false);
    }
  };

  

  return (
    <TaskContainer>
      <HeaderContainer>
        <Title>Тест №3</Title>
        <TestCounter>Пройдено тестов: 2 из 7</TestCounter>
      </HeaderContainer>
      
      <Instruction>
        Ответьте на следующие вопросы, выбирая тот ответ, который наилучшим образом отражает ваше мнение.
      </Instruction>
      
      <QuestionsContainer>
        {questions.map((question, index) => {
          const questionNumber = index + 1;
          const isAnswered = !!answers[question.id];
          const hasError = showErrors && !isAnswered;
          
          return (
            <QuestionItem key={question.id} id={`question-${question.id}`}>
              <QuestionText>{questionNumber}. {question.text}</QuestionText>
              <AnswersWrapper>
                <CustomTooltip
                  content="Выберите вариант ответа"
                  type="error"
                  position={isMobile ? "bottom" : "left"}
                  forceVisible={hasError}
                  disabled={!hasError}
                >
                  <AnswersRow $hasError={hasError}>
                    {['Нет', 'Скорее нет, чем да', 'Скорее да, чем нет', 'Да'].map((option) => (
                      <AnswerButton
                        key={option}
                        isSelected={answers[question.id] === option}
                        onClick={() => handleAnswerChange(question.id, option as Test3AnswerOption)}
                        variant={hasError ? 'error' : 'default'}
                      >
                        {option}
                      </AnswerButton>
                    ))}
                  </AnswersRow>
                </CustomTooltip>
              </AnswersWrapper>
            </QuestionItem>
          );
        })}
      </QuestionsContainer>
      
      <ButtonsContainer>
        <CustomButton 
          variant="primary"
          onClick={handleNext}
          disabled={isSubmitting}
          iconRight="arrow-right.svg"
        >
          Следующий тест
        </CustomButton>
      </ButtonsContainer>
      
    </TaskContainer>
  );
};

export default Test3Task;