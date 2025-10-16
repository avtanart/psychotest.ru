import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'primary' | 'secondary' | 'ghost';
  $fullWidth?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  background-color: ${(props) => {
    if (props.$variant === 'secondary') return theme.colors.button.ghost.background;
    if (props.$variant === 'ghost') return theme.colors.button.ghost.background;
    return theme.colors.button.primary.background;
  }};
  color: ${(props) => {
    if (props.$variant === 'secondary') return theme.colors.button.primary.typography;
    if (props.$variant === 'ghost') return theme.colors.button.ghost.typography;
    return theme.colors.button.primary.typography;
  }};
  padding: 12px 24px;
  border-radius: ${theme.borderRadius.sm};
  font-weight: 500;
  border: ${(props) => {
    if (props.$variant === 'secondary') return `1px solid ${theme.colors.button.primary.background}`;
    if (props.$variant === 'ghost') return '1px solid transparent';
    return 'none';
  }};
  cursor: pointer;
  transition: ${theme.transitions.normal};
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  font-size: 16px;
  font-family: ${theme.typography.textNormal.fontFamily};

  &:hover {
    background-color: ${(props) => {
      if (props.$variant === 'secondary') return theme.colors.button.ghost.backgroundHover;
      if (props.$variant === 'ghost') return theme.colors.button.ghost.backgroundHover;
      return theme.colors.button.primary.backgroundHover;
    }};
    color: ${(props) => {
      if (props.$variant === 'ghost') return theme.colors.typography.primary;
      return undefined;
    }};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: ${theme.colors.button.disabled.background};
    color: ${theme.colors.button.disabled.typography};
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({ children, $variant = 'primary', ...props }) => {
  return (
    <StyledButton $variant={$variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
