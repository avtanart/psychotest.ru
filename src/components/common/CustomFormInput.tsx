import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

// Типы состояний инпута
type InputState = 'default' | 'hover' | 'active' | 'filled' | 'disabled' | 'error';

// Интерфейс пропсов
interface CustomFormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onFocus' | 'onBlur'> {
  label?: string;
  error?: string;
  showError?: boolean;
  rightText?: string;
  showRightText?: boolean;
  fullWidth?: boolean;
  value?: string | number | readonly string[];
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Контейнер для всего инпута
const InputContainer = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  gap: 8px;
`;

// Лейбл для инпута
const Label = styled.label`
  font-family: ${theme.typography.textNormal.fontFamily};
  font-size: ${theme.typography.textNormal.fontSize};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  user-select: none;
  pointer-events: none;
`;

// Обертка для инпута с правым текстом
const InputWrapper = styled.div<{ $state: InputState; $hasError: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 40px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  /* Default состояние */
  ${props => props.$state === 'default' && `
    background-color: ${theme.colors.background.default};
    border: 1px solid ${theme.colors.controls.background.border};
  `}
  
  /* Hover состояние */
  ${props => props.$state === 'hover' && `
    background-color: ${theme.colors.background.default};
    border: 1px solid ${theme.colors.controls.background.borderHover};
  `}
  
  /* Active состояние */
  ${props => props.$state === 'active' && `
    background-color: ${theme.colors.background.default};
    border: 1px solid ${theme.colors.controls.background.borderFocus};
  `}
  
  /* Filled состояние */
  ${props => props.$state === 'filled' && `
    background-color: ${theme.colors.background.default};
    border: 1px solid ${theme.colors.controls.background.border};
  `}
  
  /* Disabled состояние */
  ${props => props.$state === 'disabled' && `
    background-color: ${theme.colors.controls.background.ghost};
    border: 1px solid ${theme.colors.controls.background.border};
    cursor: not-allowed;
  `}
  
  /* Error состояние */
  ${props => props.$state === 'error' && `
    background-color: ${theme.colors.background.default};
    border: 1px solid ${theme.colors.background.error};
  `}
`;

// Стилизованный инпут
const StyledInput = styled.input<{ $state: InputState }>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${theme.typography.textNormal.fontFamily};
  font-size: ${theme.typography.textNormal.fontSize};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  padding: 8px 12px;
  cursor: text;
  
  /* Default состояние */
  ${props => props.$state === 'default' && `
    color: ${theme.colors.controls.typography.default};
  `}
  
  /* Hover состояние */
  ${props => props.$state === 'hover' && `
    color: ${theme.colors.controls.typography.default};
  `}
  
  /* Active состояние */
  ${props => props.$state === 'active' && `
    color: ${theme.colors.controls.typography.active};
  `}
  
  /* Filled состояние */
  ${props => props.$state === 'filled' && `
    color: ${theme.colors.controls.typography.active};
  `}
  
  /* Disabled состояние */
  ${props => props.$state === 'disabled' && `
    color: ${theme.colors.button.disabled.typography};
    cursor: not-allowed;
  `}
  
  /* Error состояние */
  ${props => props.$state === 'error' && `
    color: ${theme.colors.controls.typography.default};
  `}
  
  &::placeholder {
    color: ${theme.colors.controls.typography.default};
  }
`;

// Правый текст
const RightText = styled.span<{ $state: InputState }>`
  font-family: ${theme.typography.textNormal.fontFamily};
  font-size: ${theme.typography.textNormal.fontSize};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  text-align: right;
  user-select: none;
  pointer-events: none;
  margin-left: 8px;
  padding-right: 12px;
  
  /* Default состояние */
  ${props => props.$state === 'default' && `
    color: ${theme.colors.controls.typography.default};
  `}
  
  /* Hover состояние */
  ${props => props.$state === 'hover' && `
    color: ${theme.colors.controls.typography.default};
  `}
  
  /* Active состояние */
  ${props => props.$state === 'active' && `
    color: ${theme.colors.controls.typography.active};
  `}
  
  /* Filled состояние */
  ${props => props.$state === 'filled' && `
    color: ${theme.colors.controls.typography.active};
  `}
  
  /* Disabled состояние */
  ${props => props.$state === 'disabled' && `
    color: ${theme.colors.button.disabled.typography};
  `}
  
  /* Error состояние */
  ${props => props.$state === 'error' && `
    color: ${theme.colors.controls.typography.default};
  `}
`;

const CustomFormInput: React.FC<CustomFormInputProps> = ({
  label,
  error,
  showError = false,
  rightText = '',
  showRightText = true,
  placeholder = '',
  value,
  disabled = false,
  fullWidth = false,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const [state, setState] = useState<InputState>('default');
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Определяем состояние на основе пропсов и внутреннего состояния
  useEffect(() => {
    if (disabled) {
      setState('disabled');
    } else if (isFocused) {
      setState('active'); // При фокусе всегда Active, даже если есть ошибка
    } else if (error && showError) {
      setState('error');
    } else if (value && value.toString().trim() !== '') {
      setState('filled');
    } else if (isHovered) {
      setState('hover');
    } else {
      setState('default');
    }
  }, [disabled, error, showError, isFocused, value, isHovered]);

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
      onFocus?.();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <InputWrapper
        $state={state}
        $hasError={!!error && showError}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <StyledInput
          $state={state}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
        {showRightText && rightText && (
          <RightText $state={state}>
            {rightText}
          </RightText>
        )}
      </InputWrapper>
    </InputContainer>
  );
};

export default CustomFormInput;