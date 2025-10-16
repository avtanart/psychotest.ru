import React from 'react';
import styled from 'styled-components';
import CustomButton from '../common/CustomButton';
import { useAppSelector } from '../../store';

const TestIntroContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333333;
  margin: 0;
`;

const TestCounter = styled.div`
  font-size: 1rem;
  color: #666666;
`;

const SubTitle = styled.h2`
  font-size: 1.4rem;
  color: #333333;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Description = styled.div`
  font-size: 1rem;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  white-space: pre-line;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

interface TestIntroProps {
  testId: string;
  title: string;
  subtitle: string;
  description: string;
  onStartTest: () => void;
}

const TestIntro: React.FC<TestIntroProps> = ({ 
  testId, 
  title, 
  subtitle, 
  description, 
  onStartTest 
}) => {
  const session = useAppSelector((state) => state.session);
  
  // Подсчет пройденных тестов
  const completedTests = Object.entries(session.progress)
    .filter(([key, value]) => key !== 'profile' && key !== 'email' && value === true)
    .length;
  
  return (
    <TestIntroContainer>
      <HeaderContainer>
        <Title>{title}</Title>
        <TestCounter>Пройдено тестов: {completedTests} из 7</TestCounter>
      </HeaderContainer>
      
      <SubTitle>{subtitle}</SubTitle>
      <Description>{description}</Description>
      
      <ButtonContainer>
        <CustomButton onClick={onStartTest} style={{ width: '100%' }}>
          Начать тест
        </CustomButton>
      </ButtonContainer>
    </TestIntroContainer>
  );
};

export default TestIntro;
