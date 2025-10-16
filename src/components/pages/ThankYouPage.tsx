import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CustomButton from '../common/CustomButton';

const ThankYouContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #333333;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666666;
  line-height: 1.6;
`;

const InfoBox = styled.div`
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  width: 100%;
  text-align: left;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #555555;
  line-height: 1.5;
  margin: 0;
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <ThankYouContainer>
      <Title>Спасибо!</Title>
      <Description>
        Ваши результаты успешно отправлены на указанный email.
        Благодарим вас за участие в исследовании!
      </Description>
      
      <InfoBox>
        <InfoText>
          Проверьте вашу почту в течение ближайших 15 минут. Если вы не получили письмо, 
          проверьте папку "Спам" или свяжитесь с нами.
        </InfoText>
      </InfoBox>
      
      <ButtonContainer>
        <CustomButton onClick={handleReturnHome}>
          Вернуться на главную
        </CustomButton>
      </ButtonContainer>
    </ThankYouContainer>
  );
};

export default ThankYouPage;
