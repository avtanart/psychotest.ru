import React from 'react';
import styled from 'styled-components';

interface TooltipProps {
  text: string;
  $isVisible: boolean;
  $isError?: boolean;
}

const TooltipContainer = styled.div<{ $isVisible: boolean; $isError?: boolean }>`
  position: absolute;
  right: -220px;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${props => props.$isError ? '#ffebee' : '#e3f2fd'};
  color: ${props => props.$isError ? '#d32f2f' : '#1976d2'};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 200px;
  width: 200px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.2s, visibility 0.2s;
  border-left: 3px solid ${props => props.$isError ? '#d32f2f' : '#1976d2'};
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent ${props => props.$isError ? '#ffebee' : '#e3f2fd'} transparent transparent;
  }
  
  @media (max-width: 768px) {
    right: 0;
    top: 100%;
    transform: translateY(8px);
    width: 100%;
    max-width: 100%;
    
    &::before {
      left: 20px;
      top: -12px;
      transform: none;
      border-color: transparent transparent ${props => props.$isError ? '#ffebee' : '#e3f2fd'} transparent;
    }
  }
`;

const Tooltip: React.FC<TooltipProps> = ({ text, $isVisible, $isError = true }) => {
  return (
    <TooltipContainer $isVisible={$isVisible} $isError={$isError}>
      {text}
    </TooltipContainer>
  );
};

export default Tooltip;