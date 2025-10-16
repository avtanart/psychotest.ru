import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

interface CustomButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  iconLeft?: string;
  iconRight?: string;
  onlyIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ButtonContainer = styled.button<{
  $variant: 'primary' | 'ghost';
  $disabled?: boolean;
  $onlyIcon?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Расстояние между кнопками и текстом 8px */
  border: none;
  border-radius: 8px; /* Скругление 8px */
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-family: ${theme.typography.textNormalMedium.fontFamily};
  font-size: ${theme.typography.textNormalMedium.fontSize};
  font-weight: ${theme.typography.textNormalMedium.fontWeight};
  line-height: ${theme.typography.textNormalMedium.lineHeight};
  transition: all 0.2s ease-in-out;
  user-select: none;
  width: auto; /* Автоматическая ширина по содержимому */
  flex-shrink: 0; /* Не сжимается */
  
  /* Паддинги для обычных кнопок */
  ${props => !props.$onlyIcon && `
    padding: 8px 24px; /* Сверху и снизу 8px, слева и справа 24px */
  `}
  
  /* Паддинги для кнопок только с иконкой */
  ${props => props.$onlyIcon && `
    padding: 10px; /* Все паддинги 10px */
    width: 40px; /* Фиксированная ширина 40px */
    height: 40px; /* Фиксированная высота 40px */
    min-width: 40px; /* Минимальная ширина 40px */
    min-height: 40px; /* Минимальная высота 40px */
  `}

  /* Primary вариант - Default состояние */
  ${props => props.$variant === 'primary' && !props.$disabled && `
    background-color: ${theme.colors.button.primary.background};
    color: ${theme.colors.button.primary.typography};
    
    &:hover {
      background-color: ${theme.colors.button.primary.backgroundHover};
    }
  `}

  /* Ghost вариант - Default состояние */
  ${props => props.$variant === 'ghost' && !props.$disabled && `
    background-color: ${theme.colors.button.ghost.background};
    color: ${theme.colors.button.ghost.typography};
    
    &:hover {
      background-color: ${theme.colors.button.ghost.backgroundHover};
    }
  `}

  /* Disabled состояние для всех вариантов */
  ${props => props.$disabled && `
    background-color: ${theme.colors.button.disabled.background};
    color: ${theme.colors.button.disabled.typography};
    cursor: not-allowed;
  `}
`;

const IconContainer = styled.div<{ $disabled?: boolean; $variant: 'primary' | 'ghost' }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: ${props => {
      if (props.$disabled) {
        // Для disabled состояния применяем цвет disabled и делаем полупрозрачным
        if (props.$variant === 'primary') return 'brightness(0) invert(1) opacity(0.6)'; // Белый с прозрачностью
        if (props.$variant === 'ghost') return 'brightness(0) saturate(100%) invert(45%) sepia(8%) saturate(1234%) hue-rotate(202deg) brightness(95%) contrast(86%) opacity(0.6)'; // Серый с прозрачностью
        return 'opacity(0.6)';
      }
      if (props.$variant === 'primary') return 'brightness(0) invert(1)'; // Белый цвет для primary
      if (props.$variant === 'ghost') return 'brightness(0) saturate(100%) invert(45%) sepia(8%) saturate(1234%) hue-rotate(202deg) brightness(95%) contrast(86%)'; // Серый цвет для ghost
      return 'none';
    }};
  }
`;

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  iconLeft,
  iconRight,
  onlyIcon = false,
  className,
  style,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <ButtonContainer
      $variant={variant}
      $disabled={disabled}
      $onlyIcon={onlyIcon}
      onClick={handleClick}
      type={type}
      disabled={disabled}
      className={className}
      style={style}
    >
      {iconLeft && (
        <IconContainer $disabled={disabled} $variant={variant}>
          <img src={`${process.env.PUBLIC_URL}/${iconLeft}`} alt="" />
        </IconContainer>
      )}
      
      {!onlyIcon && children}
      
      {iconRight && (
        <IconContainer $disabled={disabled} $variant={variant}>
          <img src={`${process.env.PUBLIC_URL}/${iconRight}`} alt="" />
        </IconContainer>
      )}
    </ButtonContainer>
  );
};

export default CustomButton;
