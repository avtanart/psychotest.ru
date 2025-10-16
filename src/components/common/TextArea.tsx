import React, { TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const TextAreaContainer = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333333;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 16px;
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.3s;
  font-family: inherit;

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

const CharCount = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: #666666;
  margin-top: 0.25rem;
`;

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  maxLength,
  showCharCount = true,
  ...props
}) => {
  const value = props.value as string || '';
  const charCount = value.length;

  return (
    <TextAreaContainer>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledTextArea 
        maxLength={maxLength} 
        {...props}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      {maxLength && showCharCount && (
        <CharCount>
          {charCount} / {maxLength}
        </CharCount>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </TextAreaContainer>
  );
};

export default TextArea;
