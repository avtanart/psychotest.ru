import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import CustomButton from '../common/CustomButton';
import Snackbar from '../common/Snackbar';
import { Test7Answer, TEST7_PAGE1_QUESTIONS, TEST7_PAGE2_QUESTIONS } from '../../types/test7Types';
import { setAnswer } from '../../store/slices/test7Slice';
import { scrollToTop } from '../../hooks/useScrollToTop';
import { theme } from '../../theme/theme';

const TaskContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
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

const Instruction = styled.p`
  font-size: 1rem;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const QuestionsContainer = styled.div`
  margin-bottom: 2rem;
`;

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
`;


const QuestionText = styled.div`
  font-size: 1.1rem;
  color: #333333;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    border-color: #007bff;
  }

  input[type="radio"]:checked + & {
    background-color: #e3f2fd;
    border-color: #007bff;
  }
`;

const RadioInput = styled.input`
  margin-right: 0.75rem;
  transform: scale(1.1);
`;

const OptionText = styled.span`
  font-size: 0.95rem;
  color: #333333;
  line-height: 1.4;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
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

const Test7Page2: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { page1, page2, startedAt } = useAppSelector((state) => state.test7);
  const profile = useAppSelector((state) => state.profile);
  
  const [answers, setAnswers] = useState<{ [key: number]: Test7Answer }>(page2.answers);
  const [showError, setShowError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAnswerChange = (questionId: number, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    // Сохраняем в Redux
    dispatch(setAnswer({ page: 'page2', questionId, answer }));
    
    // Скрываем ошибку при выборе ответа
    if (showError) {
      setShowError(false);
    }
  };

  const validateAnswers = (): boolean => {
    const unansweredQuestions = TEST7_PAGE2_QUESTIONS.filter(
      question => !answers[question.id]
    );
    
    if (unansweredQuestions.length > 0) {
      setShowError(true);
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (validateAnswers()) {
      scrollToTop();
      navigate('/test7/page3');
    }
  };

  const handleSkip = () => {
    // Переходим к следующей странице без валидации
    scrollToTop();
    navigate('/test7/page3');
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

      {showError && (
        <ErrorMessage>
          Пожалуйста, ответьте на все вопросы (5 без ответа)
        </ErrorMessage>
      )}

      <QuestionsContainer>
        {TEST7_PAGE2_QUESTIONS.map((question) => (
          <QuestionContainer key={question.id}>
            <QuestionText>{question.id}. {question.text}</QuestionText>
            <OptionsContainer>
              {question.options.map((option) => (
                <OptionLabel key={option.id}>
                  <RadioInput
                    type="radio"
                    name={`question_${question.id}`}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleAnswerChange(question.id, option.id)}
                  />
                  <OptionText>{option.text}</OptionText>
                </OptionLabel>
              ))}
            </OptionsContainer>
          </QuestionContainer>
        ))}
      </QuestionsContainer>

      <ButtonsContainer>
        <SkipButton 
          variant="ghost"
          onClick={handleSkip}
        >
          Пропустить
        </SkipButton>
        
        <CustomButton 
          variant="primary" 
          onClick={handleContinue}
          iconRight="arrow-right.svg"
        >
          Продолжить
        </CustomButton>
      </ButtonsContainer>

      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          isOpen={showSnackbar}
          onClose={() => setShowSnackbar(false)}
        />
      )}
    </TaskContainer>
  );
};

export default Test7Page2;
