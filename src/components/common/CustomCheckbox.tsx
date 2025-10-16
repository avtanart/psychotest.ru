import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

interface CustomCheckboxProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  onDisabledClick?: () => void;
}

const CheckboxContainer = styled.label<{ $disabled?: boolean; $checked?: boolean }>`
  display: flex;
  align-items: flex-start; /* Выравнивание по верхнему краю */
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
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

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
`;

const CheckboxVisual = styled.div<{ $checked: boolean; $disabled?: boolean }>`
  position: relative;
  width: 24px; /* Контейнер 24x24px */
  height: 24px; /* Контейнер 24x24px */
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start; /* Выравнивание по верхнему краю относительно первой строки текста */
  flex-shrink: 0; /* Предотвращаем сжатие чекбокса */
  transition: all 0.2s ease-in-out;
  
  /* Квадрат (внешний) - 18x18px с внутренней обводкой, центрирован в контейнере 24x24px */
  &::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 4px; /* Скругление 4px */
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
  
  /* Галочка (внутренняя) - 10x8px, центрирована в квадрате */
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 8px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0.244212 4.65301C-0.0814039 4.29234 -0.0814039 3.70758 0.244212 3.34691C0.569828 2.98624 1.09776 2.98624 1.42337 3.34691L3.61126 5.77034L8.57663 0.270427C8.9022 -0.0901927 9.43016 -0.0900922 9.75579 0.270427C10.0814 0.631098 10.0814 1.21586 9.75579 1.57653L4.20084 7.7295C3.87523 8.09017 3.3473 8.09017 3.02168 7.7295L0.244212 4.65301Z' fill='%23136aec'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: ${props => props.$checked && !props.$disabled ? 1 : 0};
    transition: opacity 0.2s ease-in-out;
  }
`;

const CheckboxLabel = styled.span<{ $disabled?: boolean }>`
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

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  onDisabledClick,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e);
    }
  };

  const handleClick = () => {
    if (disabled && onDisabledClick) {
      onDisabledClick();
    }
  };

  return (
    <CheckboxContainer $disabled={disabled} $checked={checked} onClick={handleClick}>
      <CheckboxInput
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <CheckboxVisual $checked={checked} $disabled={disabled} />
      <CheckboxLabel $disabled={disabled}>{label}</CheckboxLabel>
    </CheckboxContainer>
  );
};

export default CustomCheckbox;
