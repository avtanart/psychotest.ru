import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.background.secondary};
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.typography.secondary};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  font-family: ${theme.typography.textNormal.fontFamily};
  font-size: ${theme.typography.textSmall.fontSize};
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; {new Date().getFullYear()} Психологические тесты. Все права защищены.</p>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
