import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  showError?: boolean;
  allowOnlyLetters?: boolean;
  allowOnlyNumbers?: boolean;
  filter?: string;
}

const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  margin-bottom: 1rem;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  position: relative;
  min-height: 80px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333333;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.$hasError ? '#d32f2f' : '#cccccc'};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${props => props.$hasError ? '#d32f2f' : '#3498db'};
    outline: none;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  error, 
  fullWidth = false, 
  showError = false,
  allowOnlyLetters = false,
  allowOnlyNumbers = false,
  onChange,
  value,
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    console.log('FormInput onChange:', e.target.name, newValue);
    
    if (allowOnlyLetters) {
      newValue = newValue.replace(/[^A-Za-zА-Яа-яЁё\s]/g, '');
    } else if (allowOnlyNumbers) {
      newValue = newValue.replace(/[^0-9]/g, '');
    }
    
    // Create a synthetic event with the filtered value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: newValue
      }
    };
    
    if (onChange) {
      console.log('Calling parent onChange with:', syntheticEvent.target.name, syntheticEvent.target.value);
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Input 
        {...props} 
        value={value}
        onChange={handleChange}
        $hasError={!!error && showError}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      <Tooltip text={error || ''} $isVisible={!!error && showError} $isError={true} />
    </InputContainer>
  );
};

export default FormInput;