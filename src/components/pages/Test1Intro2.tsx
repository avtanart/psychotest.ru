import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CustomButton from '../common/CustomButton';
import { taskIntroInstructions } from '../../data/test1Data';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setCurrentPage } from '../../store/slices/navigationSlice';

// Стили из TestIntro.tsx
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
  display: flex;
  justify-content: center;
`;

const Test1Intro2: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);
  
  // Подсчет пройденных тестов
  const completedTests = Object.entries(session.progress)
    .filter(([key, value]) => key !== 'profile' && key !== 'email' && value === true)
    .length;

  const handleContinue = () => {
    dispatch(setCurrentPage('test1/task2'));
    navigate('/test1/task2');
  };

  return (
    <TestIntroContainer>
      <HeaderContainer>
        <Title>Тест №1</Title>
        <TestCounter>Пройдено тестов: {completedTests} из 7</TestCounter>
      </HeaderContainer>
      
      <SubTitle>Задание 2</SubTitle>
      <Description>{taskIntroInstructions.task2}</Description>
      
      <ButtonContainer>
        <CustomButton 
          onClick={handleContinue}
          iconRight="arrow-right.svg"
        >
          Продолжить
        </CustomButton>
      </ButtonContainer>
    </TestIntroContainer>
  );
};

export default Test1Intro2;