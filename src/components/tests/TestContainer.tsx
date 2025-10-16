import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store';
import { startTest, saveAnswer, completeTest } from '../../store/slices/answersSlice';
import { setCurrentTest, setCurrentPage, updateProgress } from '../../store/slices/sessionSlice';
import { saveAnswers } from '../../utils/storage';
import { getTestById, getNextTest, getPrevTest } from '../../data/testData';
import { Test, Question, Answer, TestPage } from '../../types';

import CustomButton from '../common/CustomButton';
import ProgressBar from '../common/ProgressBar';
import TestQuestion from './TestQuestion';

const TestContainerWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333333;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #666666;
  line-height: 1.5;
`;

const PageTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #333333;
`;

const QuestionsContainer = styled.div`
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  margin-bottom: 1rem;
  
  @media (max-width: 900px) {
    justify-content: stretch;
    
    button {
      width: 100%;
    }
  }
`;

const ProgressContainer = styled.div`
  margin-top: 2rem;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  color: #666666;
  text-align: right;
  margin-top: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fde2e2;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const TestContainer: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const answers = useAppSelector((state) => state.answers);
  const session = useAppSelector((state) => state.session);
  
  const [currentTest, setCurrentTestState] = useState<Test | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [currentAnswers, setCurrentAnswers] = useState<{ [key: string]: Answer }>({});
  const [error, setError] = useState<string>('');
  
  // Загрузка теста и инициализация
  useEffect(() => {
    if (testId) {
      const test = getTestById(testId);
      if (test) {
        setCurrentTestState(test);
        dispatch(setCurrentTest(testId));
        
        // Инициализация теста в хранилище ответов
        dispatch(startTest({ testId }));
        
        // Загрузка сохраненных ответов
        if (answers[testId] && answers[testId].answers) {
          setCurrentAnswers(answers[testId].answers);
        }
        
        // Проверка сохраненного прогресса
        const testProgress = session.progress[testId];
        if (testProgress && typeof testProgress !== 'boolean') {
          const savedPageId = testProgress.currentPage;
          const pageIndex = test.pages.findIndex(page => page.id === savedPageId);
          if (pageIndex !== -1) {
            setCurrentPageIndex(pageIndex);
          }
        }
      } else {
        // Если тест не найден, перенаправляем на главную
        navigate('/');
      }
    }
  }, [testId, dispatch, navigate, answers, session.progress]);
  
  // Обновление текущей страницы в сессии
  useEffect(() => {
    if (currentTest && currentPageIndex >= 0 && currentPageIndex < currentTest.pages.length) {
      const currentPage = currentTest.pages[currentPageIndex];
      dispatch(setCurrentPage(currentPage.id));
      
      // Обновление прогресса
      if (testId) {
        const answeredQuestions = Object.keys(currentAnswers);
        dispatch(updateProgress({
          key: testId,
          value: {
            completed: false,
            currentPage: currentPage.id,
            answeredQuestions
          }
        }));
      }
    }
  }, [currentTest, currentPageIndex, dispatch, currentAnswers, testId]);
  
  // Если тест не загружен, показываем заглушку
  if (!currentTest || !testId) {
    return <div>Загрузка теста...</div>;
  }
  
  const currentPage: TestPage = currentTest.pages[currentPageIndex];
  
  // Обработка изменения ответа
  const handleAnswerChange = (questionId: string, answer: Answer) => {
    setCurrentAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: answer };
      
      // Сохраняем ответ в хранилище
      dispatch(saveAnswer({ testId, questionId, answer }));
      saveAnswers(answers);
      
      return newAnswers;
    });
    
    // Очищаем ошибку при изменении ответа
    setError('');
  };
  
  // Валидация ответов на текущей странице
  const validateCurrentPage = (): boolean => {
    const unansweredQuestions = currentPage.questions.filter(
      question => !currentAnswers[question.id]
    );
    
    if (unansweredQuestions.length > 0) {
      setError('Пожалуйста, ответьте на все вопросы перед тем, как продолжить.');
      return false;
    }
    
    return true;
  };
  
  // Переход к следующей странице
  const handleNextPage = () => {
    if (!validateCurrentPage()) {
      return;
    }
    
    if (currentPageIndex < currentTest.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      // Это последняя страница теста
      finishTest();
    }
  };
  
  
  // Завершение теста
  const finishTest = () => {
    // Отмечаем тест как завершенный
    dispatch(completeTest({ testId }));
    
    // Обновляем прогресс
    dispatch(updateProgress({
      key: testId,
      value: true
    }));
    
    // Сохраняем ответы
    saveAnswers(answers);
    
    // Переходим к следующему тесту или на главную страницу
    const nextTest = getNextTest(testId);
    if (nextTest) {
      navigate(`/test/${nextTest.id}`);
    } else {
      navigate('/');
    }
  };
  
  // Расчет прогресса
  const calculateProgress = () => {
    const totalPages = currentTest.pages.length;
    const currentPageNumber = currentPageIndex + 1;
    return {
      current: currentPageNumber,
      total: totalPages,
      percentage: Math.round((currentPageNumber / totalPages) * 100)
    };
  };
  
  const progress = calculateProgress();
  const isLastPage = currentPageIndex === currentTest.pages.length - 1;
  const isLastTest = !getNextTest(testId);
  
  return (
    <TestContainerWrapper>
      <Title>{currentTest.title}</Title>
      <Description>{currentTest.description}</Description>
      
      <PageTitle>{currentPage.title}</PageTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <QuestionsContainer>
        {currentPage.questions.map((question: Question) => (
          <TestQuestion
            key={question.id}
            question={question}
            value={currentAnswers[question.id] || undefined}
            onChange={(answer) => handleAnswerChange(question.id, answer)}
          />
        ))}
      </QuestionsContainer>
      
      <ButtonContainer>
        <CustomButton 
          variant="primary" 
          onClick={handleNextPage}
          iconRight={isLastPage ? (isLastTest ? undefined : 'arrow-right.svg') : 'arrow-right.svg'}
        >
          {isLastPage ? (isLastTest ? 'Завершить' : 'Следующий тест') : 'Далее'}
        </CustomButton>
      </ButtonContainer>
      
      <ProgressContainer>
        <ProgressBar value={progress.current} max={progress.total} />
        <ProgressText>
          Страница {progress.current} из {progress.total}
        </ProgressText>
      </ProgressContainer>
    </TestContainerWrapper>
  );
};

export default TestContainer;
