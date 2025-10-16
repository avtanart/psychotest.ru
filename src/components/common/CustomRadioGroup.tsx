import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';
import CustomRadioButton from './CustomRadioButton';
import Tooltip from './Tooltip';

interface Option {
  value: string;
  label: string;
}

interface CustomRadioGroupProps {
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  showError?: boolean;
  disabled?: boolean;
}

const RadioGroupContainer = styled.div`
  margin-bottom: 0;
  position: relative;
`;

const Label = styled.div`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormalSemibold.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
`;

const OptionsContainer = styled.div<{ $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: ${theme.borderRadius.sm};
  padding: 0;
  border: ${props => props.$hasError ? `1px solid ${theme.colors.background.error}` : 'none'};
`;

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  showError = false,
  disabled = false,
}) => {
  return (
    <RadioGroupContainer>
      {label && <Label>{label}</Label>}
      <OptionsContainer $hasError={!!error && showError}>
        {options.map((option) => (
          <CustomRadioButton
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            label={option.label}
            disabled={disabled}
          />
        ))}
      </OptionsContainer>
      <Tooltip text={error || ''} $isVisible={!!error && showError} $isError={true} />
    </RadioGroupContainer>
  );
};

export default CustomRadioGroup;
