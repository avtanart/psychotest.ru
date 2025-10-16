import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { updateProgress } from '../../../store/slices/sessionSlice';
import { clearTestData } from '../../../store/slices/test2Slice';
import { Test2Question as QuestionType, Test2Answer } from '../../../types/test2Types';
import CustomButton from '../../common/CustomButton';
import Test2Question from './Test2Question';
import { submitTest2Data, submitAllData } from '../../../utils/api';
import { theme } from '../../../theme/theme';
import { TextNormal, TextNormalBold } from '../../common/Typography';

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

const TaskTitle = styled(TextNormalBold)`
  margin-top: 24px;
  margin-bottom: 4px;
`;

const InstructionContainer = styled.div`
  margin-bottom: 24px;
`;

const InstructionParagraph = styled(TextNormal)`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const HighlightedText = styled(TextNormalBold)`
  display: inline;
`;

const QuestionsContainer = styled.div`
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


interface Test2TaskProps {
  taskId: 'task1' | 'task2';
  title: string;
  instruction: {
    paragraph1: string;
    paragraph2: string;
    highlightText: string;
  };
  questions: QuestionType[];
  answerOptions: string[];
  nextRoute: string;
  isLastTask?: boolean;
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

const Test2Task: React.FC<Test2TaskProps> = ({
  taskId,
  title,
  instruction,
  questions,
  answerOptions,
  nextRoute,
  isLastTask = false
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  
  const test2State = useAppSelector((state) => state.test2 as any);
  const session = useAppSelector((state) => state.session);
  const profile = useAppSelector((state) => state.profile);
  
  const [showErrors, setShowErrors] = useState(false);
  
  // Очищаем данные теста при монтировании компонента
  useEffect(() => {
    dispatch(clearTestData());
  }, [dispatch]);
  
  // Получаем ответы для текущего задания
  const taskAnswers = test2State.answers[taskId];
  
  // Подсчет пройденных тестов
  const completedTests = Object.entries(session.progress)
    .filter(([key, value]) => key !== 'profile' && key !== 'email' && value === true)
    .length;
  
  // Обработчик изменения ответа
  const handleAnswerChange = (questionId: number, answer: Test2Answer) => {
    // Используем dispatch напрямую без импорта action creator
    dispatch({
      type: 'test2/updateAnswer',
      payload: { task: taskId, questionId, answer }
    });
  };
  
  // Валидация ответов
  const validateAnswers = (): boolean => {
    // Проверяем, что все вопросы имеют ответы
    const unansweredQuestions = questions.filter(question => 
      !taskAnswers[question.id] || taskAnswers[question.id] === null || taskAnswers[question.id] === undefined
    );
    
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
    dispatch({ type: 'test2/nextTask' });
    
    // Обновляем прогресс в сессии
    if (isLastTask) {
      // Если это последнее задание, отмечаем тест как завершенный
      dispatch(updateProgress({ key: 'test2', value: true }));
      
      // Переходим к следующему тесту или к форме ввода email
      navigate(nextRoute);
    } else {
      // Если это не последнее задание, переходим к следующему заданию
      navigate(nextRoute);
    }
    
  };

  
  
  return (
    <TaskContainer>
      <HeaderContainer>
        <Title>Блок №2</Title>
        <TestCounter>Блоков пройдено: {completedTests} из 7</TestCounter>
      </HeaderContainer>
      
      <TaskTitle>{title}</TaskTitle>
      <InstructionContainer>
        <InstructionParagraph>{instruction.paragraph1}</InstructionParagraph>
        <InstructionParagraph>
          {instruction.paragraph2.split(instruction.highlightText).map((part, index) => (
            <React.Fragment key={index}>
              {index === 0 && part}
              {index === 0 && <HighlightedText>{instruction.highlightText}</HighlightedText>}
              {index > 0 && part}
            </React.Fragment>
          ))}
        </InstructionParagraph>
      </InstructionContainer>
      
      
      <QuestionsContainer>
        {questions.map(question => (
          <Test2Question
            key={question.id}
            question={question}
            answerOptions={answerOptions}
            value={taskAnswers[question.id]}
            onChange={(value) => handleAnswerChange(question.id, value)}
            showError={showErrors}
          />
        ))}
      </QuestionsContainer>
      
      <ButtonContainer>
        <CustomButton 
          onClick={handleContinue}
          iconRight="arrow-right.svg"
        >
          {isLastTask ? 'Следующий блок' : 'Продолжить'}
        </CustomButton>
      </ButtonContainer>
      
    </TaskContainer>
  );
};

export default Test2Task;