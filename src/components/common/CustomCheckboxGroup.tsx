import React from 'react';
import styled from 'styled-components';
import CustomCheckbox from './CustomCheckbox';
import Tooltip from './Tooltip';
import { theme } from '../../theme/theme';
import { TextNormal } from './Typography';

interface Option {
  value: string;
  label: string;
}

interface CustomCheckboxGroupProps {
  name: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  error?: string;
  showError?: boolean;
  disabled?: boolean;
  maxSelections?: number;
}

const CheckboxGroupContainer = styled.div`
  margin-bottom: 0;
  position: relative;
`;

const Label = styled(TextNormal)`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  font-weight: ${theme.typography.textNormalMedium.fontWeight};
  color: ${theme.colors.typography.primary};
`;

const OptionsContainer = styled.div<{ $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: ${theme.borderRadius.sm};
  padding: 0;
  border: ${(props) => (props.$hasError ? `1px solid ${theme.colors.background.error}` : 'none')};
`;

const HelperText = styled.div`
  color: ${theme.colors.typography.secondary};
  font-size: ${theme.typography.textSmall.fontSize};
  font-family: ${theme.typography.textSmall.fontFamily};
  margin-top: ${theme.spacing.xs};
`;

const CustomCheckboxGroup: React.FC<CustomCheckboxGroupProps> = ({
  name,
  options,
  values,
  onChange,
  label,
  error,
  showError = false,
  disabled = false,
  maxSelections,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      // Если достигнут максимум выбранных элементов, не добавляем новый
      if (maxSelections && values.length >= maxSelections) {
        return;
      }
      onChange([...values, value]);
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  return (
    <CheckboxGroupContainer>
      {label && <Label>{label}</Label>}
      <OptionsContainer $hasError={!!error && showError}>
        {options.map((option) => (
          <CustomCheckbox
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={values.includes(option.value)}
            onChange={handleChange}
            disabled={disabled || (maxSelections ? !values.includes(option.value) && values.length >= maxSelections : false)}
          />
        ))}
      </OptionsContainer>
      {maxSelections && (
        <HelperText>
          Выбрано {values.length} из {maxSelections}
        </HelperText>
      )}
      <Tooltip text={error || ''} $isVisible={!!error && showError} $isError={true} />
    </CheckboxGroupContainer>
  );
};

export default CustomCheckboxGroup;
