import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

interface CustomRadioButtonProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const RadioContainer = styled.label<{ $disabled?: boolean; $checked?: boolean }>`
  display: flex;
  align-items: center; /* Выравнивание по центру */
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  gap: 4px; /* Расстояние между контейнером и текстом 4px */
  padding: 4px 0;
  
  /* Hover эффект для дефолтного состояния */
  ${props => !props.$checked && !props.$disabled && `
    &:hover div::before {
      border-color: ${theme.colors.controls.background.borderHover} !important;
    }
  `}
  
  /* Hover эффект для активного состояния */
  ${props => props.$checked && !props.$disabled && `
    &:hover div::before {
      border-color: ${theme.colors.controls.background.borderHover} !important;
    }
  `}
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
`;

const RadioVisual = styled.div<{ $checked: boolean; $disabled?: boolean }>`
  position: relative;
  width: 24px; /* Контейнер 24x24px */
  height: 24px; /* Контейнер 24x24px */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  
  /* Большой круг (внешний) - 20x20px с внутренней обводкой, центрирован в контейнере 24x24px */
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-sizing: border-box; /* Включаем border в размер */
    transition: all 0.2s ease-in-out;
    
    /* Дефолтное состояние */
    ${props => !props.$checked && !props.$disabled && `
      background-color: transparent;
      border: 2px solid ${theme.colors.controls.background.border};
    `}
    
    /* Активное состояние */
    ${props => props.$checked && !props.$disabled && `
      background-color: transparent;
      border: 2px solid ${theme.colors.controls.background.default};
    `}
    
    /* Неактивное состояние */
    ${props => props.$disabled && `
      background-color: ${theme.colors.button.disabled.background};
      border: none;
    `}
  }
  
  /* Маленький круг (внутренний) - 10x10px, центрирован в большом круге */
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${theme.colors.controls.background.default};
    opacity: ${props => props.$checked && !props.$disabled ? 1 : 0};
    transition: opacity 0.2s ease-in-out;
  }
  
`;

const RadioLabel = styled.span<{ $disabled?: boolean }>`
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${props => 
    props.$disabled 
      ? theme.colors.button.disabled.typography 
      : theme.colors.typography.primary
  };
  user-select: none;
`;

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.value);
    }
  };

  return (
    <RadioContainer $disabled={disabled} $checked={checked}>
      <RadioInput
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <RadioVisual $checked={checked} $disabled={disabled} />
      <RadioLabel $disabled={disabled}>{label}</RadioLabel>
    </RadioContainer>
  );
};

export default CustomRadioButton;
