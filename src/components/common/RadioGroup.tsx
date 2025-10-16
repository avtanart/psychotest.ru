import React from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';

interface Option {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  showError?: boolean;
}

const RadioGroupContainer = styled.div`
  margin-bottom: 1rem;
  position: relative;
  min-height: 100px;
`;

const Label = styled.div`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333333;
`;

const OptionsContainer = styled.div<{ $hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 4px;
  padding: 0.5rem 0;
  border: ${props => props.$hasError ? '1px solid #d32f2f' : 'none'};
`;

const RadioContainer = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const RadioCheckmark = styled.span`
  position: relative;
  height: 20px;
  width: 20px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 50%;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    content: '';
    position: absolute;
    display: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #3498db;
  }

  ${RadioInput}:checked ~ & {
    border-color: #3498db;
  }

  ${RadioInput}:checked ~ &:after {
    display: block;
  }
`;

const OptionLabel = styled.span`
  font-size: 16px;
  color: #333333;
`;

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  showError = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <RadioGroupContainer>
      {label && <Label>{label}</Label>}
      <OptionsContainer $hasError={!!error && showError}>
        {options.map((option) => (
          <RadioContainer key={option.value}>
            <RadioInput
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
            />
            <RadioCheckmark />
            <OptionLabel>{option.label}</OptionLabel>
          </RadioContainer>
        ))}
      </OptionsContainer>
      <Tooltip text={error || ''} $isVisible={!!error && showError} $isError={true} />
    </RadioGroupContainer>
  );
};

export default RadioGroup;