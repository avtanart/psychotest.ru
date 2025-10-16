import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const HeaderContainer = styled.header`
  background-color: ${theme.colors.controls.background.default};
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  color: ${theme.colors.typography.white};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  font-family: ${theme.typography.textNormalBold.fontFamily};
  color: ${theme.colors.typography.white};
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.typography.white};
    text-decoration: none;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: ${theme.spacing.lg};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${theme.colors.typography.white};
  text-decoration: none;
  font-family: ${theme.typography.textNormal.fontFamily};
  font-size: ${theme.typography.textNormal.fontSize};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: ${theme.transitions.normal};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.typography.white};
    text-decoration: none;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">Психологические тесты</Logo>
        <Navigation>
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/design-demo">Демо дизайна</NavLink>
          <NavLink to="/radio-example">Радиокнопки</NavLink>
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
