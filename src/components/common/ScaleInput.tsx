import React from 'react';
import styled from 'styled-components';

interface ScaleInputProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  label?: string;
  error?: string;
}

const ScaleContainer = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

const Label = styled.div`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333333;
`;

const ScaleWrapper = styled.div`
  padding: 1rem 0;
`;

const ScaleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666666;
`;

const ScaleValues = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const ScaleValue = styled.div`
  text-align: center;
  font-size: 14px;
  color: #333333;
  width: 30px;
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  margin: 10px 0;
  background: transparent;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #f5f5f5;
    border-radius: 4px;
  }

  &::-webkit-slider-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -6px;
  }

  &::-moz-range-track {
    width: 100%;
    height: 8px;
    cursor: pointer;
    background: #f5f5f5;
    border-radius: 4px;
  }

  &::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 0.25rem;
`;

const ScaleInput: React.FC<ScaleInputProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  minLabel,
  maxLabel,
  label,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  // Создаем массив значений для отображения
  const values = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  return (
    <ScaleContainer>
      {label && <Label>{label}</Label>}
      <ScaleWrapper>
        <ScaleLabels>
          <span>{minLabel || min}</span>
          <span>{maxLabel || max}</span>
        </ScaleLabels>
        <RangeInput
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
        />
        <ScaleValues>
          {values.map((val) => (
            <ScaleValue key={val}>{val}</ScaleValue>
          ))}
        </ScaleValues>
      </ScaleWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </ScaleContainer>
  );
};

export default ScaleInput;
