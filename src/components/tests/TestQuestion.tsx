import React from 'react';
import styled from 'styled-components';
import { Question, Answer } from '../../types';
import CustomRadioGroup from '../common/CustomRadioGroup';
import CustomCheckboxGroup from '../common/CustomCheckboxGroup';
import ScaleInput from '../common/ScaleInput';
import TextArea from '../common/TextArea';

interface TestQuestionProps {
  question: Question;
  value?: Answer;
  onChange: (answer: Answer) => void;
}

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const QuestionText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #333333;
`;

const MatrixContainer = styled.div`
  margin-top: 1rem;
`;

const MatrixTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const MatrixHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  color: #333333;
  font-size: 0.9rem;
`;

const MatrixRowHeader = styled.td`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  color: #333333;
  width: 30%;
`;

const MatrixCell = styled.td`
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
`;

const RadioInput = styled.input`
  cursor: pointer;
`;

const TestQuestion: React.FC<TestQuestionProps> = ({ question, value, onChange }) => {
  // Обработчик для вопросов с одним вариантом ответа
  const handleSingleChoice = (selectedValue: string) => {
    onChange(selectedValue);
  };

  // Обработчик для вопросов с множественным выбором
  const handleMultipleChoice = (selectedValues: string[]) => {
    onChange(selectedValues);
  };

  // Обработчик для шкалы
  const handleScaleChange = (selectedValue: number) => {
    onChange(selectedValue);
  };

  // Обработчик для текстового ответа
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Обработчик для матрицы
  const handleMatrixChange = (rowId: string, columnId: string) => {
    const newValue = { ...(value as { [key: string]: string }) || {} };
    newValue[rowId] = columnId;
    onChange(newValue);
  };

  // Рендер вопроса в зависимости от типа
  const renderQuestion = () => {
    switch (question.type) {
      case 'single':
        return (
          <CustomRadioGroup
            name={question.id}
            options={question.options.map(option => ({
              value: option.id,
              label: option.text
            }))}
            value={value as string || ''}
            onChange={handleSingleChoice}
          />
        );

      case 'multiple':
        return (
          <CustomCheckboxGroup
            name={question.id}
            options={question.options.map(option => ({
              value: option.id,
              label: option.text
            }))}
            values={(value as string[]) || []}
            onChange={handleMultipleChoice}
            maxSelections={question.maxSelections}
          />
        );

      case 'scale':
        return (
          <ScaleInput
            min={question.min}
            max={question.max}
            step={question.step || 1}
            value={value as number || question.min}
            onChange={handleScaleChange}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
          />
        );

      case 'text':
        return (
          <TextArea
            value={value as string || ''}
            onChange={handleTextChange}
            placeholder="Введите ваш ответ..."
            maxLength={question.maxLength}
            showCharCount={true}
          />
        );

      case 'matrix':
        const matrixValue = (value as { [key: string]: string }) || {};
        return (
          <MatrixContainer>
            <MatrixTable>
              <thead>
                <tr>
                  <th></th>
                  {question.columns.map(column => (
                    <MatrixHeaderCell key={column.id}>
                      {column.text}
                    </MatrixHeaderCell>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.rows.map(row => (
                  <tr key={row.id}>
                    <MatrixRowHeader>{row.text}</MatrixRowHeader>
                    {question.columns.map(column => (
                      <MatrixCell key={`${row.id}-${column.id}`}>
                        <RadioInput
                          type="radio"
                          name={`${question.id}-${row.id}`}
                          checked={matrixValue[row.id] === column.id}
                          onChange={() => handleMatrixChange(row.id, column.id)}
                        />
                      </MatrixCell>
                    ))}
                  </tr>
                ))}
              </tbody>
            </MatrixTable>
          </MatrixContainer>
        );

      default:
        return <div>Неподдерживаемый тип вопроса</div>;
    }
  };

  return (
    <QuestionContainer>
      <QuestionText>{question.text}</QuestionText>
      {renderQuestion()}
    </QuestionContainer>
  );
};

export default TestQuestion;
