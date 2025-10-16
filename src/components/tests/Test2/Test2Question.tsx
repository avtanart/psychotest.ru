import React, { useState } from 'react';
import styled from 'styled-components';
import { Test2Question as QuestionType, Test2Answer } from '../../../types/test2Types';
import AnswerButton from '../../common/AnswerButton';
import CustomTooltip from '../../common/CustomTooltip';
import { TextNormalSemibold } from '../../common/Typography';
import { theme } from '../../../theme/theme';

// Хук для определения размера экрана
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= parseInt(theme.breakpoints.desktop));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const QuestionContainer = styled.div`
  margin-bottom: 24px;
`;

const QuestionText = styled(TextNormalSemibold)`
  margin-bottom: 8px;
`;

const AnswersContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
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

interface Test2QuestionProps {
  question: QuestionType;
  answerOptions: string[];
  value: Test2Answer;
  onChange: (value: Test2Answer) => void;
  showError?: boolean;
}

const Test2Question: React.FC<Test2QuestionProps> = ({
  question,
  answerOptions,
  value,
  onChange,
  showError = false
}) => {
  const isMobile = useIsMobile();
  
  const handleChange = (selectedAnswer: string) => {
    onChange(selectedAnswer as Test2Answer);
  };

  const hasError = showError && (!value || value === null || value === undefined);

  return (
    <QuestionContainer id={`question-${question.id}`}>
      <QuestionText>
        {question.id}. {question.text}
      </QuestionText>
      <AnswersWrapper>
        <CustomTooltip
          content="Выберите вариант ответа"
          type="error"
          position={isMobile ? "bottom" : "left"}
          forceVisible={hasError}
          disabled={!hasError}
        >
          <AnswersRow $hasError={hasError}>
            {answerOptions.map((option) => (
              <AnswerButton
                key={option}
                isSelected={value === option}
                onClick={() => handleChange(option)}
                variant={hasError ? 'error' : 'default'}
              >
                {option}
              </AnswerButton>
            ))}
          </AnswersRow>
        </CustomTooltip>
      </AnswersWrapper>
    </QuestionContainer>
  );
};

export default Test2Question;
