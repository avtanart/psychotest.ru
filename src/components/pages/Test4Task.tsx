import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import CustomButton from '../common/CustomButton';
import AnswerButton from '../common/AnswerButton';
import CustomTooltip from '../common/CustomTooltip';
import { TextNormal, TextNormalBold, TextNormalSemibold } from '../common/Typography';
import { Test4AnswerOption } from '../../types/test4Types';
import { setAnswer, setStartTime, completeTest } from '../../store/slices/test4Slice';
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
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    gap: 8px;
  }
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

const Test4Task: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const [answers, setAnswers] = useState<Record<string, Test4AnswerOption>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  
  // Получаем данные профиля и ID пользователя
  const userId = useAppSelector(state => state.session.userId);
  const profile = useAppSelector(state => state.profile);
  
  // Устанавливаем время начала теста
  useEffect(() => {
    dispatch(setStartTime());
  }, [dispatch]);

  // Список вопросов для теста 4
  const questions = [
    { id: 'test4_q1', text: 'У меня есть люди, которые в мое отсутствие могут позаботиться о моей квартире (цветах, домашних животных)' },
    { id: 'test4_q2', text: 'Есть люди, которые принимают меня таким, какой я есть' },
    { id: 'test4_q3', text: 'Моим друзьям и родственникам важно мое мнение по определенным вопросам' },
    { id: 'test4_q4', text: 'Мне хотелось бы больше внимания и понимания от других людей' },
    { id: 'test4_q5', text: 'Я знаю одного человека, которому я могу полностью довериться и с его помощью решить любой вопрос' },
    { id: 'test4_q6', text: 'Я могу по необходимости одолжить у кого-то бытовой прибор или продукты' },
    { id: 'test4_q7', text: 'У меня есть друзья (родственники), которые умеют хорошо слушать, когда мне хочется выговориться' },
    { id: 'test4_q8', text: 'У меня нет никого, к кому бы я мог запросто и охотно зайти' },
    { id: 'test4_q9', text: 'У меня есть друзья (родственники), которые меня запросто обнимают' },
    { id: 'test4_q10', text: 'Если я болен, я могу без колебаний попросить друзей или родственников купить важные для меня вещи, например, еду' },
    { id: 'test4_q11', text: 'Если я сильно подавлен, я знаю – к кому мне пойти' },
    { id: 'test4_q12', text: 'Я часто чувствую себя аутсайдером (неудачником)' },
    { id: 'test4_q13', text: 'Есть люди, которые делят со мной горе и радость' },
    { id: 'test4_q14', text: 'С некоторыми друзьями (родственниками) я могу полностью расслабиться' },
    { id: 'test4_q15', text: 'У меня есть близкие люди, рядом с которыми я очень хорошо себя чувствую' },
    { id: 'test4_q16', text: 'У меня достаточно людей, которые по-настоящему мне помогут, если я не буду знать, как быть дальше' },
    { id: 'test4_q17', text: 'Есть люди, которые считаются со мной, даже когда я делаю ошибки' },
    { id: 'test4_q18', text: 'Мне бы хотелось больше безопасности и близости с другими людьми' },
    { id: 'test4_q19', text: 'Есть достаточно людей, с которыми у меня хорошие отношения' },
    { id: 'test4_q20', text: 'Есть группа людей (компания), к которой я себя отношу' },
    { id: 'test4_q21', text: 'С помощью друзей и знакомых я часто получаю полезную информацию (например, о хорошем враче и т. п.)' },
    { id: 'test4_q22', text: 'Есть люди, которым я могу открыть все мои чувства, не ощущая при этом неудобства' }
  ];

  // Обработчик изменения ответа
  const handleAnswerChange = (questionId: string, value: Test4AnswerOption) => {
    // Обновляем локальное состояние
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Обновляем состояние в Redux
    const questionNumber = parseInt(questionId.replace('test4_q', ''));
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


  // Обработчик нажатия кнопки "Следующий тест"
  const handleNext = async () => {
    setShowErrors(true);
    
    if (!validateAnswers()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Завершаем тест и записываем время окончания
      dispatch(completeTest());
      
      // Сохраняем ответы в localStorage для использования в submitAllData
      localStorage.setItem('test4', JSON.stringify({
        answers: Object.keys(answers).reduce((acc, key) => {
          acc[key] = answers[key];
          return acc;
        }, {} as Record<string, Test4AnswerOption>)
      }));
      
      // Обновляем профиль в localStorage для гарантии актуальности данных
      localStorage.setItem('profile', JSON.stringify(profile));
      
      // Данные будут отправлены только при завершении всего тестирования
      
      // Переходим к следующему тесту
      navigate('/test-intro/test5');
    } catch (error) {
      console.error('Ошибка при отправке данных теста 4:', error);
      setIsSubmitting(false);
    }
  };

  

  return (
    <TaskContainer>
      <HeaderContainer>
        <Title>Тест №4</Title>
        <TestCounter>Пройдено тестов: 3 из 7</TestCounter>
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
                    {Object.values(Test4AnswerOption).map((option) => (
                      <AnswerButton
                        key={option}
                        isSelected={answers[question.id] === option}
                        onClick={() => handleAnswerChange(question.id, option)}
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

export default Test4Task;
