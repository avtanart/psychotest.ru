import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import CustomButton from '../common/CustomButton';
import Snackbar from '../common/Snackbar';
import CustomCheckbox from '../common/CustomCheckbox';
import CustomTooltip from '../common/CustomTooltip';
import { TextNormal, TextNormalBold } from '../common/Typography';
import { Test5Answer, TEST5_TASKS_DATA } from '../../types/test5Types';
import { setAnswer, setStartTime, completeTest } from '../../store/slices/test5Slice';
import { theme } from '../../theme/theme';

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

const InstructionText = styled(TextNormal)`
  margin-top: 8px;
  margin-bottom: 12px;
`;

const InformerContainer = styled.div`
  background-color: ${theme.colors.background.warningLight};
  border: 1px solid ${theme.colors.background.warning};
  border-radius: 16px;
  padding: 16px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const InformerIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
    
    path {
      fill: ${theme.colors.background.warning};
    }
  }
`;

const InformerText = styled(TextNormal)`
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

const TaskTitleContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 100%;
  margin-bottom: 0;
  flex-shrink: 0;
`;

const TaskTitleText = styled.span`
  position: relative;
  display: inline-block;
`;

const TaskTitle = styled(TextNormalBold)`
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
  margin-top: 12px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  
  /* Убираем паддинги у CustomCheckbox */
  label {
    padding: 0 !important;
  }
`;

const DisabledTooltipContainer = styled.div`
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  pointer-events: none;
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

interface Test5TaskProps {
  taskId: number;
}

const Test5Task: React.FC<Test5TaskProps> = ({ taskId }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const [answers, setAnswers] = useState<Record<number, Test5Answer>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
    isOpen: false
  });
  const [showErrors, setShowErrors] = useState(false);
  const [disabledTooltipId, setDisabledTooltipId] = useState<number | null>(null);

  // Получаем данные из Redux
  const test5State = useAppSelector((state) => state.test5);

  // Инициализируем состояние при загрузке компонента
  useEffect(() => {
    // Инициализируем ответы из Redux состояния
    setAnswers(test5State.answers || {});
    
    // Устанавливаем время начала, если тест еще не начат
    if (!test5State.startedAt) {
      dispatch(setStartTime());
    }
    
    // Помечаем как инициализированный
    setIsInitialized(true);
    
    // Небольшая задержка перед показом контента для избежания мигания
    setTimeout(() => {
      setShowContent(true);
    }, 50);
  }, [dispatch, test5State.startedAt]);

  // Синхронизируем локальное состояние с Redux при изменении ответов
  useEffect(() => {
    if (isInitialized) {
      setAnswers(test5State.answers || {});
    }
  }, [test5State.answers, isInitialized]);

  // Сбрасываем состояние показа контента при смене taskId
  useEffect(() => {
    setShowContent(false);
    if (isInitialized) {
      setTimeout(() => {
        setShowContent(true);
      }, 50);
    }
  }, [taskId, isInitialized]);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('test5', JSON.stringify({
      answers,
      currentTask: taskId,
      startedAt: test5State.startedAt,
      completedAt: test5State.completedAt,
      timeSpent: test5State.timeSpent
    }));
  }, [answers, taskId, test5State.startedAt, test5State.completedAt, test5State.timeSpent]);

  const currentTaskData = useMemo(() => 
    TEST5_TASKS_DATA.find(task => task.id === taskId), 
    [taskId]
  );
  
  const currentAnswers = useMemo(() => 
    answers[taskId] || [], 
    [answers, taskId]
  );

  const handleOptionChange = useCallback((optionId: number) => {
    const newAnswers = [...currentAnswers];
    const optionIndex = newAnswers.indexOf(optionId);
    
    if (optionIndex > -1) {
      // Убираем вариант, если он уже выбран
      newAnswers.splice(optionIndex, 1);
    } else {
      // Добавляем вариант, если не превышен лимит
      if (newAnswers.length < 2) {
        newAnswers.push(optionId);
      }
    }
    
    // Сбрасываем ошибки при изменении ответа
    setShowErrors(false);
    
    const newAnswersState = { ...answers, [taskId]: newAnswers };
    setAnswers(newAnswersState);
    dispatch(setAnswer({ taskId: taskId, answer: newAnswers }));
  }, [currentAnswers, answers, taskId, dispatch]);

  const handleDisabledClick = useCallback((optionId: number) => {
    // Показываем тултип для неактивного чекбокса
    setDisabledTooltipId(optionId);
    setTimeout(() => setDisabledTooltipId(null), 3000); // Скрываем через 3 секунды
  }, []);

  const isOptionSelected = useCallback((optionId: number) => {
    return currentAnswers.includes(optionId);
  }, [currentAnswers]);

  const isOptionDisabled = useCallback((optionId: number) => {
    return currentAnswers.length >= 2 && !currentAnswers.includes(optionId);
  }, [currentAnswers]);

  // Проверка заполнения задания
  const validateTask = useCallback(() => {
    return currentAnswers.length > 0;
  }, [currentAnswers]);

  const handleNext = () => {
    if (!validateTask()) {
      setShowErrors(true);
      
      // Прокручиваем страницу к заголовку задания
      const element = document.getElementById(`task-${taskId}`);
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
      
      return;
    }
    
    setShowErrors(false);
    
    if (taskId < 12) {
      // Переходим на следующую страницу
      navigate(`/test5/page/${taskId + 1}`);
    } else {
      // Завершаем тест
      dispatch(completeTest());
      navigate('/test-intro/test6');
    }
  };



  if (!currentTaskData || !isInitialized || !showContent) {
    return <div>Загрузка...</div>;
  }

  return (
    <TaskContainer>
      <HeaderContainer>
        <Title>Тест №5</Title>
        <TestCounter>Пройдено тестов: 4 из 7</TestCounter>
      </HeaderContainer>

      <InstructionText>
        Ниже приведён ряд утверждений, касающихся вашего заболевания, самочувствия, а также некоторых аспектов жизни в целом. Отметьте утверждения, которые вы считаете верными в отношении себя.
      </InstructionText>

      <InformerContainer>
        <InformerIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9902 1.98608C12.5209 1.98608 13.0425 2.12711 13.501 2.39429C13.9583 2.66084 14.3371 3.04349 14.5986 3.50366L22.5967 17.4998L22.6895 17.6736C22.8922 18.085 22.9979 18.5384 22.9981 18.9988C22.9982 19.5251 22.8606 20.0428 22.5977 20.4988C22.3347 20.9547 21.9556 21.3329 21.5 21.5964C21.0444 21.8599 20.5273 21.9992 20.001 21.9998H4.00001C3.47436 22.0028 2.9571 21.868 2.50001 21.6082C2.04019 21.3468 1.65714 20.9683 1.39063 20.5115C1.12426 20.0547 0.9836 19.5354 0.982429 19.0066C0.981281 18.4791 1.11967 17.9608 1.38282 17.5037L9.38184 3.50366C9.64344 3.04334 10.023 2.66087 10.4805 2.39429C10.9389 2.12722 11.4597 1.98612 11.9902 1.98608ZM11.9902 3.98608C11.8136 3.98612 11.64 4.03294 11.4873 4.12183C11.3345 4.21089 11.2073 4.33902 11.1201 4.49292L11.1191 4.49585L3.11915 18.4958L3.11622 18.4998C3.02806 18.6524 2.98204 18.8264 2.98243 19.0027C2.98289 19.1787 3.02956 19.3516 3.11817 19.5037C3.207 19.6559 3.33501 19.7827 3.48829 19.8699C3.64145 19.9569 3.81507 20.0013 3.99122 19.9998H19.999C20.1744 19.9996 20.3472 19.9537 20.499 19.866C20.6508 19.7782 20.7766 19.6516 20.8643 19.4998C20.9519 19.3478 20.9981 19.1752 20.9981 18.9998C20.998 18.8243 20.952 18.6517 20.8643 18.4998L20.8623 18.4958L12.8623 4.49585L12.8604 4.49292C12.7732 4.3391 12.6469 4.21086 12.4941 4.12183C12.3413 4.03277 12.1671 3.98608 11.9902 3.98608Z" fill="black"/>
            <path d="M11.0004 13V8.99998C11.0004 8.4477 11.4481 7.99998 12.0004 7.99998C12.5527 7.99998 13.0004 8.4477 13.0004 8.99998V13C13.0004 13.5523 12.5527 14 12.0004 14C11.4481 14 11.0004 13.5523 11.0004 13Z" fill="black"/>
            <path d="M12.0102 16C12.5625 16 13.0102 16.4477 13.0102 17C13.0102 17.5523 12.5625 18 12.0102 18H12.0004C11.4481 18 11.0004 17.5523 11.0004 17C11.0004 16.4477 11.4481 16 12.0004 16H12.0102Z" fill="black"/>
          </svg>
        </InformerIcon>
        <InformerText>
          В каждом разделе вы можете выбрать не более двух вариантов.
        </InformerText>
      </InformerContainer>

      <TaskTitleContainer id={`task-${taskId}`}>
        <TaskTitleText>
          <TaskTitle>Задание {taskId} — {currentTaskData.title}</TaskTitle>
          {showErrors && !validateTask() && (
            <TooltipContainer>
              <CustomTooltip
                content="Выберите один или два варианта ответов"
                type="error"
                position={isMobile ? "bottom" : "left"}
                forceVisible={true}
                disabled={false}
              >
                <div style={{ width: '1px', height: '1px' }} />
              </CustomTooltip>
            </TooltipContainer>
          )}
        </TaskTitleText>
      </TaskTitleContainer>

      <OptionsContainer>
        {currentTaskData.options.map((option) => {
          const isSelected = isOptionSelected(option.id);
          const isDisabled = isOptionDisabled(option.id);
          
          return (
            <OptionItem key={option.id}>
              <CustomCheckbox
                name={`option_${option.id}`}
                value={option.id.toString()}
                label={`${option.id}. ${option.text}`}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => handleOptionChange(option.id)}
                onDisabledClick={() => handleDisabledClick(option.id)}
              />
              {disabledTooltipId === option.id && (
                <DisabledTooltipContainer>
                  <CustomTooltip
                    content="Можно выбрать только два ответа"
                    type="default"
                    position="right"
                    forceVisible={true}
                    disabled={false}
                  >
                    <div style={{ width: '1px', height: '1px' }} />
                  </CustomTooltip>
                </DisabledTooltipContainer>
              )}
            </OptionItem>
          );
        })}
      </OptionsContainer>

      <ButtonsContainer>
        <CustomButton
          variant="primary"
          onClick={handleNext}
          iconRight="arrow-right.svg"
        >
          {taskId === 12 ? 'Следующий тест' : 'Продолжить'}
        </CustomButton>
      </ButtonsContainer>

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </TaskContainer>
  );
};

export default Test5Task;
