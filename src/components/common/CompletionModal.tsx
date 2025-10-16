import React, { useState } from 'react';
import styled from 'styled-components';
import CustomButton from './CustomButton';
import CustomFormInput from './CustomFormInput';
import { TextNormal, TextNormalBold } from './Typography';
import { theme } from '../../theme/theme';

// Хук для определения размера экрана
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= parseInt(theme.breakpoints.desktop));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  onDataSubmit: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.background.paranja};
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    background-color: ${theme.colors.background.default};
    align-items: flex-start;
    padding: 0;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    background: ${theme.colors.background.default};
    border-radius: 0;
    padding: 40px 16px;
    max-width: none;
    width: 100%;
    max-height: none;
    height: 100vh;
    overflow-y: auto;
    box-shadow: none;
    justify-content: space-between;
  }
`;

const ImageContainer = styled.div`
  width: 96px;
  height: 96px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ModalTitle = styled.h1`
  font-size: ${theme.typography.header.fontSize};
  font-family: ${theme.typography.header.fontFamily};
  font-weight: ${theme.typography.header.fontWeight};
  line-height: ${theme.typography.header.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0 0 8px 0;
  text-align: left;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  text-align: left;
`;

const ModalText = styled(TextNormal)`
  margin: 0;
`;

const BoldText = styled(TextNormalBold)`
  display: inline;
`;

const EmailContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    margin-top: auto;
  }
`;

const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDataSubmit
}) => {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email.trim()) {
      onSubmit(email);
    } else {
      onClose();
    }
  };

  const handleModalOpen = () => {
    // Выгружаем данные тестов при открытии модального окна
    onDataSubmit();
  };

  // Вызываем выгрузку данных при открытии модального окна
  React.useEffect(() => {
    if (isOpen) {
      handleModalOpen();
    }
  }, [isOpen]);

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent>
        {isMobile ? (
          // Мобильная версия: отдельный экран
          <>
            <div>
              <ImageContainer>
                <ModalImage 
                  src="/LastPageImage.png" 
                  alt="Completion" 
                />
              </ImageContainer>
              
              <ModalTitle>Ура! Это был последний вопрос</ModalTitle>
              
              <TextContainer>
                <ModalText>
                  Большое спасибо за то, что прошли эти тесты.
                </ModalText>
                <ModalText>
                  Если вы хотите <BoldText>получить результаты,</BoldText> то оставьте ваш email ниже.
                </ModalText>
              </TextContainer>
              
              <EmailContainer>
                <CustomFormInput
                  type="email"
                  placeholder="Введите email"
                  value={email}
                  onChange={(value) => setEmail(value)}
                />
              </EmailContainer>
            </div>

            <ButtonContainer>
              <CustomButton
                variant="primary"
                onClick={handleSubmit}
                style={{ width: '100%' }}
              >
                {email.trim() ? 'Отправить email и закрыть' : 'Закрыть'}
              </CustomButton>
            </ButtonContainer>
          </>
        ) : (
          // Десктопная версия: модальное окно
          <>
            <ImageContainer>
              <ModalImage 
                src="/LastPageImage.png" 
                alt="Completion" 
              />
            </ImageContainer>
            
            <ModalTitle>Ура! Это был последний вопрос</ModalTitle>
            
            <TextContainer>
              <ModalText>
                Большое спасибо за то, что прошли эти тесты.
              </ModalText>
              <ModalText>
                Если вы хотите <BoldText>получить результаты,</BoldText> то оставьте ваш email ниже.
              </ModalText>
            </TextContainer>
            
            <EmailContainer>
              <CustomFormInput
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(value) => setEmail(value)}
              />
            </EmailContainer>

            <ButtonContainer>
              <CustomButton
                variant="primary"
                onClick={handleSubmit}
                style={{ width: '100%' }}
              >
                {email.trim() ? 'Отправить email и закрыть' : 'Закрыть'}
              </CustomButton>
            </ButtonContainer>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default CompletionModal;
