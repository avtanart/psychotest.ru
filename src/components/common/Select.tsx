import React, { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const SelectContainer = styled.div<{ fullWidth?: boolean }>`
  margin-bottom: 1rem;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333333;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    border-color: #3498db;
    outline: none;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 0.25rem;
`;

const Select: React.FC<SelectProps> = ({ options, label, error, fullWidth = false, ...props }) => {
  return (
    <SelectContainer fullWidth={fullWidth}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledSelect {...props}>
        <option value="">Выберите...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectContainer>
  );
};

export default Select;
