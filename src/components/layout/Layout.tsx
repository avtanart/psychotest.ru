import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background.secondary};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0;
  overflow-x: hidden;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    background-color: ${theme.colors.background.default};
  }
`;

const Main = styled.main`
  width: 900px;
  min-height: 100vh;
  background-color: ${theme.colors.background.default};
  padding: 40px 64px;
  box-sizing: border-box;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    display: none;
  }
`;

const MobileContent = styled.div`
  display: none;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    display: block;
    width: 100%;
    min-height: 100vh;
    padding: 40px 16px;
    box-sizing: border-box;
  }
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Main>{children}</Main>
      <MobileContent>
        {children}
      </MobileContent>
    </LayoutContainer>
  );
};

export default Layout;
