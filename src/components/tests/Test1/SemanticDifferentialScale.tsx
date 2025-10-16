import React, { useState } from 'react';
import styled from 'styled-components';
import { AdjectivePair, RatingValue } from '../../../types/test1Types';
import AnswerButton from '../../common/AnswerButton';
import CustomTooltip from '../../common/CustomTooltip';
import { theme } from '../../../theme/theme';

const ScaleContainer = styled.div`
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    .custom-tooltip {
      margin-top: 0 !important;
    }
  }
`;

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

const ScaleRow = styled.div<{ $hasError: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    width: 100%;
  }
`;

const AdjectiveText = styled.div<{ $isLeft?: boolean }>`
  width: 160px;
  min-width: 160px; /* Фиксируем минимальную ширину */
  flex-shrink: 0; /* Не позволяем сжиматься */
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  text-align: ${props => props.$isLeft ? 'right' : 'left'};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    display: none;
  }
`;

const AdjectiveTextMobile = styled.div<{ $isLeft?: boolean }>`
  display: none;
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  text-align: ${props => props.$isLeft ? 'left' : 'right'};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    display: block;
  }
`;

const AdjectivesRow = styled.div`
  display: none;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0; /* Позволяем сжиматься, но не меньше содержимого */
  margin: 0 12px;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    margin: 0;
    width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    gap: 0; /* Убираем gap на мобильных, используем marginRight */
  }
`;

const ButtonGroupSeparator = styled.div`
  width: 24px;
  flex-shrink: 0;
`;

interface SemanticDifferentialScaleProps {
  pair: AdjectivePair;
  value: RatingValue | null;
  onChange: (value: RatingValue) => void;
  showError: boolean;
}

const SemanticDifferentialScale: React.FC<SemanticDifferentialScaleProps> = ({
  pair,
  value,
  onChange,
  showError
}) => {
  const isMobile = useIsMobile();
  
  const handleButtonClick = (buttonIndex: number) => {
    // Определяем, какое прилагательное выбрано (левое или правое)
    const adjective = buttonIndex < 3 ? 'left' : 'right';
    
    // Определяем значение (1-3)
    const ratingValue = buttonIndex < 3 
      ? 3 - buttonIndex as 1 | 2 | 3 // Для левого: 3, 2, 1
      : buttonIndex - 2 as 1 | 2 | 3; // Для правого: 1, 2, 3
    
    onChange({ adjective, value: ratingValue });
  };
  
  // Проверяем, выбрана ли кнопка с данным индексом
  const isButtonSelected = (buttonIndex: number) => {
    if (!value) return false;
    
    if (value.adjective === 'left') {
      return buttonIndex === 3 - value.value; // Для левого: 3->0, 2->1, 1->2
    } else {
      return buttonIndex === value.value + 2; // Для правого: 1->3, 2->4, 3->5
    }
  };
  
  const hasError = showError && value === null;
  
  return (
    <ScaleContainer id={`pair-${pair.id}`}>
      <ScaleRow $hasError={hasError}>
        {/* Мобильная версия: прилагательные на одном уровне */}
        <AdjectivesRow>
          <AdjectiveTextMobile $isLeft={true}>{pair.left}</AdjectiveTextMobile>
          <AdjectiveTextMobile $isLeft={false}>{pair.right}</AdjectiveTextMobile>
        </AdjectivesRow>
        
        {/* Десктопная версия: прилагательные по бокам */}
        <AdjectiveText $isLeft={true}>{pair.left}</AdjectiveText>
        
        <CustomTooltip
          content="Выберите вариант ответа"
          type="error"
          position={isMobile ? "bottom" : "left"}
          forceVisible={hasError}
          disabled={!hasError}
        >
          <ButtonsContainer>
            {isMobile ? (
              // Мобильная версия: все кнопки в одном ряду
              <ButtonGroup>
                {[0, 1, 2, 3, 4, 5].map((buttonIndex) => (
                  <AnswerButton
                    key={buttonIndex}
                    isSelected={isButtonSelected(buttonIndex)}
                    onClick={() => handleButtonClick(buttonIndex)}
                    variant={hasError ? 'error' : 'default'}
                    style={{
                      marginRight: buttonIndex === 2 ? '16px' : '8px'
                    }}
                  >
                    {buttonIndex < 3 ? 3 - buttonIndex : buttonIndex - 2}
                  </AnswerButton>
                ))}
              </ButtonGroup>
            ) : (
              // Десктопная версия: две группы с сепаратором
              <>
                <ButtonGroup>
                  {[0, 1, 2].map((buttonIndex) => (
                    <AnswerButton
                      key={buttonIndex}
                      isSelected={isButtonSelected(buttonIndex)}
                      onClick={() => handleButtonClick(buttonIndex)}
                      variant={hasError ? 'error' : 'default'}
                    >
                      {3 - buttonIndex}
                    </AnswerButton>
                  ))}
                </ButtonGroup>
                
                <ButtonGroupSeparator />
                
                <ButtonGroup>
                  {[3, 4, 5].map((buttonIndex) => (
                    <AnswerButton
                      key={buttonIndex}
                      isSelected={isButtonSelected(buttonIndex)}
                      onClick={() => handleButtonClick(buttonIndex)}
                      variant={hasError ? 'error' : 'default'}
                    >
                      {buttonIndex - 2}
                    </AnswerButton>
                  ))}
                </ButtonGroup>
              </>
            )}
          </ButtonsContainer>
        </CustomTooltip>
        
        <AdjectiveText $isLeft={false}>{pair.right}</AdjectiveText>
      </ScaleRow>
    </ScaleContainer>
  );
};

export default SemanticDifferentialScale;
