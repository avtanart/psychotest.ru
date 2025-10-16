import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch } from '../../store';
import { resetSession } from '../../store/slices/sessionSlice';
import { clearProfile } from '../../store/slices/profileSlice';
import { clearAnswers } from '../../store/slices/answersSlice';
import { resetTest as resetTest1 } from '../../store/slices/test1Slice';
import { resetTest as resetTest2 } from '../../store/slices/test2Slice';
import { resetTest as resetTest3 } from '../../store/slices/test3Slice';
import { resetTest as resetTest4 } from '../../store/slices/test4Slice';
import { resetTest as resetTest5 } from '../../store/slices/test5Slice';
import { resetTest as resetTest6 } from '../../store/slices/test6Slice';
import { clearTest as resetTest7 } from '../../store/slices/test7Slice';
import { clearStorage } from '../../utils/storage';
import { fullReset } from '../../utils/clearTestData';
import CustomButton from '../common/CustomButton';
import { theme } from '../../theme/theme';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const Image = styled.img`
  width: 96px;
  height: 96px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: ${theme.typography.header.fontSize};
  font-weight: ${theme.typography.header.fontWeight};
  line-height: ${theme.typography.header.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0 0 12px 0;
`;

const Description = styled.p`
  font-size: ${theme.typography.textNormal.fontSize};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0 0 24px 0;
`;

const InfoBox = styled.div`
  background-color: ${theme.colors.background.warningLight};
  border: 1px solid ${theme.colors.background.warning};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 8px;
  }
`;

const WarningIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  path {
    fill: ${theme.colors.background.warning};
  }
`;

const InfoContent = styled.div`
  flex: 1;
  text-align: left;
`;

const InfoTitle = styled.h3`
  font-size: ${theme.typography.textNormalBold.fontSize};
  font-weight: ${theme.typography.textNormalBold.fontWeight};
  line-height: ${theme.typography.textNormalBold.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0 0 4px 0;
`;

const InfoText = styled.p`
  font-size: ${theme.typography.textNormal.fontSize};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

const ButtonContainer = styled.div`
  width: 100%;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    button {
      width: 100%;
    }
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // При монтировании компонента очищаем хранилище и состояние
  useEffect(() => {
    // Полная очистка всех данных при загрузке главной страницы
    fullReset();
    dispatch(resetSession());
    dispatch(clearProfile());
    dispatch(clearAnswers());
    
    // Сброс всех тестов
    dispatch(resetTest1());
    dispatch(resetTest2());
    dispatch(resetTest3());
    dispatch(resetTest4());
    dispatch(resetTest5());
    dispatch(resetTest6());
    dispatch(resetTest7());
    
    clearStorage();
  }, [dispatch]);

  const handleStartTest = () => {
    // Переходим к анкете
    navigate('/profile');
  };


  return (
    <HomeContainer>
      <Image src="/FirstPageImage.png" alt="Таня" />
      <Title>Привет! Меня зовут Таня, я учусь на клинического психолога</Title>
      <Description>
        Я очень рада, что вы согласились пройти мой опрос, который нужен мне, чтобы написать диплом. 
        На заполнение опроса у вас уйдет примерно 30 минут.
      </Description>
      
      <InfoBox>
        <WarningIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9902 1.98608C12.5209 1.98608 13.0425 2.12711 13.501 2.39429C13.9583 2.66084 14.3371 3.04349 14.5986 3.50366L22.5967 17.4998L22.6895 17.6736C22.8922 18.085 22.9979 18.5384 22.9981 18.9988C22.9982 19.5251 22.8606 20.0428 22.5977 20.4988C22.3347 20.9547 21.9556 21.3329 21.5 21.5964C21.0444 21.8599 20.5273 21.9992 20.001 21.9998H4.00001C3.47436 22.0028 2.9571 21.868 2.50001 21.6082C2.04019 21.3468 1.65714 20.9683 1.39063 20.5115C1.12426 20.0547 0.9836 19.5354 0.982429 19.0066C0.981281 18.4791 1.11967 17.9608 1.38282 17.5037L9.38184 3.50366C9.64344 3.04334 10.023 2.66087 10.4805 2.39429C10.9389 2.12722 11.4597 1.98612 11.9902 1.98608ZM11.9902 3.98608C11.8136 3.98612 11.64 4.03294 11.4873 4.12183C11.3345 4.21089 11.2073 4.33902 11.1201 4.49292L11.1191 4.49585L3.11915 18.4958L3.11622 18.4998C3.02806 18.6524 2.98204 18.8264 2.98243 19.0027C2.98289 19.1787 3.02956 19.3516 3.11817 19.5037C3.207 19.6559 3.33501 19.7827 3.48829 19.8699C3.64145 19.9569 3.81507 20.0013 3.99122 19.9998H19.999C20.1744 19.9996 20.3472 19.9537 20.499 19.866C20.6508 19.7782 20.7766 19.6516 20.8643 19.4998C20.9519 19.3478 20.9981 19.1752 20.9981 18.9998C20.998 18.8243 20.952 18.6517 20.8643 18.4998L20.8623 18.4958L12.8623 4.49585L12.8604 4.49292C12.7732 4.3391 12.6469 4.21086 12.4941 4.12183C12.3413 4.03277 12.1671 3.98608 11.9902 3.98608Z" fill="black"/>
            <path d="M11.0004 13V8.99998C11.0004 8.4477 11.4481 7.99998 12.0004 7.99998C12.5527 7.99998 13.0004 8.4477 13.0004 8.99998V13C13.0004 13.5523 12.5527 14 12.0004 14C11.4481 14 11.0004 13.5523 11.0004 13Z" fill="black"/>
            <path d="M12.0102 16C12.5625 16 13.0102 16.4477 13.0102 17C13.0102 17.5523 12.5625 18 12.0102 18H12.0004C11.4481 18 11.0004 17.5523 11.0004 17C11.0004 16.4477 11.4481 16 12.0004 16H12.0102Z" fill="black"/>
          </svg>
        </WarningIcon>
        <InfoContent>
          <InfoTitle>Важно!</InfoTitle>
          <InfoText>
            При заполнении опроса внимательно читайте вводную часть и задание, чтобы ваши результаты были релевантными.
          </InfoText>
        </InfoContent>
      </InfoBox>
      
      <ButtonContainer>
        <CustomButton onClick={handleStartTest} variant="primary">
          Начать тестирование
        </CustomButton>
      </ButtonContainer>
      
    </HomeContainer>
  );
};

export default HomePage;