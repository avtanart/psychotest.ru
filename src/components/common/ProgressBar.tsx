import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
  value: number;
  max: number;
  showPercentage?: boolean;
}

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressBarFill = styled.div<{ width: string }>`
  height: 8px;
  background-color: #3498db;
  width: ${(props) => props.width};
  transition: width 0.3s ease;
`;

const ProgressBarLabel = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: #666666;
  margin-top: 0.25rem;
`;

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, showPercentage = true }) => {
  const percentage = Math.round((value / max) * 100);
  const width = `${percentage}%`;

  return (
    <div>
      <ProgressBarContainer>
        <ProgressBarFill width={width} />
      </ProgressBarContainer>
      {showPercentage && <ProgressBarLabel>{percentage}%</ProgressBarLabel>}
    </div>
  );
};

export default ProgressBar;
