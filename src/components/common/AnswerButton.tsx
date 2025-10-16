import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

interface AnswerButtonProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'error';
}

const AnswerButtonContainer = styled.button<{
  $isSelected: boolean;
  $disabled?: boolean;
  $variant?: 'default' | 'error';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  height: 40px;
  padding: 0 8px; /* Левый и правый паддинг 8px */
  border-radius: 8px; /* Скругление 8px */
  border: 1px solid;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-family: ${theme.typography.textSmall.fontFamily};
  font-size: ${theme.typography.textSmall.fontSize};
  font-weight: ${theme.typography.textSmall.fontWeight};
  line-height: ${theme.typography.textSmall.lineHeight};
  transition: all 0.2s ease-in-out;
  user-select: none;
  flex: 1;
  text-align: center;
  white-space: normal; /* Позволяем перенос текста */
  word-wrap: break-word; /* Переносим длинные слова */
  
  /* Мобильная адаптация */
  @media (max-width: ${theme.breakpoints.desktop}) {
    padding: 0 4px;         /* Отступы слева и справа 4px */
    transition: none;       /* Отключаем анимацию на мобильных */
  }
  
  /* Default состояние */
  ${props => !props.$isSelected && !props.$disabled && props.$variant !== 'error' && `
    background-color: ${theme.colors.controls.background.ghost};
    border-color: ${theme.colors.controls.background.border};
    color: ${theme.colors.controls.typography.active};
    
    &:hover {
      border-color: ${theme.colors.controls.background.borderHover};
    }
  `}

  /* Error состояние */
  ${props => !props.$isSelected && !props.$disabled && props.$variant === 'error' && `
    background-color: ${theme.colors.controls.background.ghost};
    border-color: ${theme.colors.background.error};
    color: ${theme.colors.controls.typography.active};
    
    &:hover {
      border-color: ${theme.colors.background.error};
    }
  `}
  
  /* Active состояние */
  ${props => props.$isSelected && !props.$disabled && `
    background-color: ${theme.colors.controls.background.default};
    border: 1px solid transparent;
    color: ${theme.colors.button.primary.typography};
  `}
  
  /* Disabled состояние */
  ${props => props.$disabled && `
    background-color: ${theme.colors.button.disabled.background};
    border-color: ${theme.colors.controls.background.border};
    color: ${theme.colors.button.disabled.typography};
    cursor: not-allowed;
  `}
`;

const AnswerButton: React.FC<AnswerButtonProps> = ({
  children,
  isSelected = false,
  onClick,
  disabled = false,
  className,
  style,
  variant = 'default',
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <AnswerButtonContainer
      $isSelected={isSelected}
      $disabled={disabled}
      $variant={variant}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={style}
    >
      {children}
    </AnswerButtonContainer>
  );
};

export default AnswerButton;
