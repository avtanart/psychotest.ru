import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import CustomButton from '../common/CustomButton';
import Snackbar from '../common/Snackbar';
import CompletionModal from '../common/CompletionModal';
import CustomRadioButton from '../common/CustomRadioButton';
import CustomTooltip from '../common/CustomTooltip';
import { TextNormal, TextNormalSemibold } from '../common/Typography';
import { Test7Answer, TEST7_PAGE5_QUESTIONS } from '../../types/test7Types';
import { setAnswer, completeTest } from '../../store/slices/test7Slice';
import { submitAllData, submitEmailOnly } from '../../utils/api';
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
  margin-bottom: 2rem;
`;

const QuestionsContainer = styled.div`
  margin-top: 24px;
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
  margin-bottom: 12px;
  flex-shrink: 0;
`;

const QuestionText = styled(TextNormalSemibold)`
  position: relative;
  display: inline-block;
  margin: 0;
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

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
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

const Test7Page5: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const test7State = useAppSelector((state) => state.test7);
  const { page5 } = test7State;
  const profile = useAppSelector((state) => state.profile);
  
  const [answers, setAnswers] = useState<{ [key: number]: Test7Answer }>(page5.answers);
  const [showError, setShowError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [questionErrors, setQuestionErrors] = useState<Record<number, boolean>>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleAnswerChange = (questionId: number, answer: Test7Answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Сохраняем в Redux
    dispatch(setAnswer({ page: 'page5', questionId, answer }));
    
    // Скрываем ошибку для конкретного вопроса при выборе ответа
    if (questionErrors[questionId]) {
      setQuestionErrors(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const validateAnswers = (): boolean => {
    const unansweredQuestions = TEST7_PAGE5_QUESTIONS.filter(
      question => !answers[question.id]
    );
    
    if (unansweredQuestions.length > 0) {
      // Устанавливаем ошибки для всех незаполненных вопросов
      const newErrors: Record<number, boolean> = {};
      unansweredQuestions.forEach(question => {
        newErrors[question.id] = true;
      });
      setQuestionErrors(newErrors);
      
      // Прокручиваем к первому вопросу с ошибкой
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
      }
      
      return false;
    }
    
    return true;
  };

  const handleComplete = async () => {
    if (validateAnswers()) {
      try {
        // Отправляем ВСЕ данные тестов БЕЗ email
        const userId = localStorage.getItem('userId') || '';
        await submitAllData(userId, profile);
        console.log('Все данные тестов отправлены успешно');
        
        // Отмечаем тест как завершенный
        dispatch(completeTest());
        
        // Показываем модальное окно для ввода email
        setShowCompletionModal(true);
      } catch (error) {
        console.error('Ошибка при отправке данных тестов:', error);
        setSnackbarMessage('Ошибка при отправке данных. Попробуйте еще раз.');
        setShowSnackbar(true);
      }
    }
  };


  const handleModalClose = () => {
    // Данные уже отправлены при нажатии "Завершить тестирование"
    // Просто закрываем модальное окно и переходим на главную
    setShowCompletionModal(false);
    navigate('/');
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      // Отправляем только email для обновления существующей записи
      // Данные тестов уже были отправлены при нажатии "Завершить тестирование"
      await submitEmailOnly(email);
      
      setSnackbarMessage('Email успешно добавлен!');
      setShowSnackbar(true);
      
      // Закрываем модальное окно и переходим на главную
      setShowCompletionModal(false);
      navigate('/');
    } catch (error) {
      console.error('Ошибка при отправке email:', error);
      setSnackbarMessage('Ошибка при отправке email. Попробуйте еще раз.');
      setShowSnackbar(true);
    }
  };

  return (
    <TaskContainer>
      <HeaderContainer>
        <Title>Блок №7</Title>
        <TestCounter>Блоков пройдено: 6 из 7</TestCounter>
      </HeaderContainer>

      <Instruction>
        Выберите один вариант ответа, который наиболее соответствует вашему мнению.
      </Instruction>

      <QuestionsContainer>
        {TEST7_PAGE5_QUESTIONS.map((question) => {
          const hasError = questionErrors[question.id];
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
                    onChange={(value) => handleAnswerChange(question.id, value as Test7Answer)}
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
          variant="primary" 
          onClick={handleComplete}
          iconRight="arrow-right.svg"
        >
          Завершить тестирование
        </CustomButton>
      </ButtonsContainer>

      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          isOpen={showSnackbar}
          onClose={() => setShowSnackbar(false)}
        />
      )}

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={handleModalClose}
        onSubmit={handleEmailSubmit}
        onDataSubmit={() => {}} // Пустая функция, так как данные уже отправлены
      />
    </TaskContainer>
  );
};

export default Test7Page5;
