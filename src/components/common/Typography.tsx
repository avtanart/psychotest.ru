import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

// Интерфейсы для компонентов типографики
interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

// Заголовок
export const Header = styled.h1<TypographyProps>`
  font-size: ${theme.typography.header.fontSize};
  font-family: ${theme.typography.header.fontFamily};
  font-weight: ${theme.typography.header.fontWeight};
  line-height: ${theme.typography.header.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

// Основной текст
export const TextNormal = styled.p<TypographyProps>`
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

// Основной текст (medium)
export const TextNormalMedium = styled.p<TypographyProps>`
  font-size: ${theme.typography.textNormalMedium.fontSize};
  font-family: ${theme.typography.textNormalMedium.fontFamily};
  font-weight: ${theme.typography.textNormalMedium.fontWeight};
  line-height: ${theme.typography.textNormalMedium.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

// Основной текст (semibold)
export const TextNormalSemibold = styled.p<TypographyProps>`
  font-size: ${theme.typography.textNormalSemibold.fontSize};
  font-family: ${theme.typography.textNormalSemibold.fontFamily};
  font-weight: ${theme.typography.textNormalSemibold.fontWeight};
  line-height: ${theme.typography.textNormalSemibold.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

// Основной текст (bold)
export const TextNormalBold = styled.p<TypographyProps>`
  font-size: ${theme.typography.textNormalBold.fontSize};
  font-family: ${theme.typography.textNormalBold.fontFamily};
  font-weight: ${theme.typography.textNormalBold.fontWeight};
  line-height: ${theme.typography.textNormalBold.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

// Мелкий текст
export const TextSmall = styled.p<TypographyProps>`
  font-size: ${theme.typography.textSmall.fontSize};
  font-family: ${theme.typography.textSmall.fontFamily};
  font-weight: ${theme.typography.textSmall.fontWeight};
  line-height: ${theme.typography.textSmall.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

// Вторичный текст
export const TextSecondary = styled.p<TypographyProps>`
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.secondary};
  margin: 0;
`;

// Призрачный текст
export const TextGhost = styled.p<TypographyProps>`
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.ghost};
  margin: 0;
`;

// Белый текст
export const TextWhite = styled.p<TypographyProps>`
  font-size: ${theme.typography.textNormal.fontSize};
  font-family: ${theme.typography.textNormal.fontFamily};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.white};
  margin: 0;
`;

// Компонент для заголовков с разными уровнями
interface HeadingProps extends TypographyProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, children, ...props }) => {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;
  return React.createElement(Component, props, children);
};

// Стилизованный заголовок
export const StyledHeading = styled(Heading)`
  font-size: ${theme.typography.header.fontSize};
  font-family: ${theme.typography.header.fontFamily};
  font-weight: ${theme.typography.header.fontWeight};
  line-height: ${theme.typography.header.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

// Заголовки разных уровней с предустановленными стилями
export const H1 = styled.h1<TypographyProps>`
  font-size: ${theme.typography.header.fontSize};
  font-family: ${theme.typography.header.fontFamily};
  font-weight: ${theme.typography.header.fontWeight};
  line-height: ${theme.typography.header.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

export const H2 = styled.h2<TypographyProps>`
  font-size: ${theme.typography.textNormalSemibold.fontSize};
  font-family: ${theme.typography.textNormalSemibold.fontFamily};
  font-weight: ${theme.typography.textNormalSemibold.fontWeight};
  line-height: ${theme.typography.textNormalSemibold.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

export const H3 = styled.h3<TypographyProps>`
  font-size: ${theme.typography.textNormalMedium.fontSize};
  font-family: ${theme.typography.textNormalMedium.fontFamily};
  font-weight: ${theme.typography.textNormalMedium.fontWeight};
  line-height: ${theme.typography.textNormalMedium.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

// Экспорт всех компонентов
export default {
  Header,
  TextNormal,
  TextNormalMedium,
  TextNormalSemibold,
  TextNormalBold,
  TextSmall,
  TextSecondary,
  TextGhost,
  TextWhite,
  Heading,
  StyledHeading,
  H1,
  H2,
  H3,
};
