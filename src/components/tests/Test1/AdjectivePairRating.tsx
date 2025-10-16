import React from 'react';
import styled from 'styled-components';
import { AdjectivePair, RatingValue } from '../../../types/test1Types';
import Tooltip from '../../common/Tooltip';

const PairContainer = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const PairRow = styled.div<{ $hasError: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.$hasError ? '#e74c3c' : '#e0e0e0'};
  background-color: ${props => props.$hasError ? '#fff6f6' : '#ffffff'};
`;

const Adjective = styled.div`
  width: 150px;
  font-weight: 500;
  color: #333;
`;

const RatingButtons = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0 1rem;
`;

const RatingButton = styled.button<{ $isSelected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${props => props.$isSelected ? '#3498db' : '#cccccc'};
  background-color: ${props => props.$isSelected ? '#3498db' : '#ffffff'};
  color: ${props => props.$isSelected ? '#ffffff' : '#333333'};
  font-weight: ${props => props.$isSelected ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isSelected ? '#3498db' : '#f5f5f5'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
  }
`;

interface AdjectivePairRatingProps {
  pair: AdjectivePair;
  value: RatingValue | null;
  onChange: (value: RatingValue) => void;
  showError: boolean;
}

const AdjectivePairRating: React.FC<AdjectivePairRatingProps> = ({
  pair,
  value,
  onChange,
  showError
}) => {
  const handleRatingClick = (buttonIndex: number) => {
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
    <PairContainer>
      <PairRow $hasError={hasError}>
        <Adjective>{pair.left}</Adjective>
        <RatingButtons>
          {[0, 1, 2, 3, 4, 5].map((buttonIndex) => (
            <RatingButton
              key={buttonIndex}
              $isSelected={isButtonSelected(buttonIndex)}
              onClick={() => handleRatingClick(buttonIndex)}
              type="button"
              data-selected={isButtonSelected(buttonIndex).toString()}
            >
              {buttonIndex < 3 ? 3 - buttonIndex : buttonIndex - 2}
            </RatingButton>
          ))}
        </RatingButtons>
        <Adjective>{pair.right}</Adjective>
      </PairRow>
      {hasError && (
        <Tooltip 
          $isVisible={true} 
          $isError={true} 
          text="Выберите вариант ответа" 
        />
      )}
    </PairContainer>
  );
};

export default AdjectivePairRating;
