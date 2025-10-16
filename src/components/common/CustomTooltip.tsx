import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

/**
 * CustomTooltip - универсальный компонент для отображения всплывающих подсказок
 * 
 * @param children - элемент, к которому привязан тултип
 * @param content - текст тултипа
 * @param type - тип тултипа: 'default' (обычный) или 'error' (ошибка)
 * @param position - позиция тултипа: 'left', 'right' или 'bottom'
 * @param disabled - отключить тултип (не реагирует на hover)
 * @param forceVisible - принудительно показать тултип (игнорирует hover)
 * 
 * Особенности:
 * - Максимальная ширина контейнера: 280px
 * - Автоматическое позиционирование с треугольником-указателем
 * - Поддержка двух типов: default (темный) и error (красный)
 * - Плавные анимации появления/исчезновения
 */
interface CustomTooltipProps {
  children: React.ReactNode;
  content: string;
  type?: 'default' | 'error';
  position?: 'left' | 'right' | 'bottom';
  disabled?: boolean;
  forceVisible?: boolean;
}

const TooltipContainer = styled.div<{ $disabled?: boolean }>`
  position: relative;
  display: block;
  cursor: default;
  width: 100%;
`;

const TooltipContent = styled.div<{ 
  $type: 'default' | 'error';
  $position: 'left' | 'right' | 'bottom';
  $visible: boolean;
}>`
  position: absolute;
  z-index: 1000;
  max-width: 280px;
  width: max-content;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: ${theme.typography.textNormal.fontFamily};
  font-size: ${theme.typography.textNormal.fontSize};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  white-space: normal;
  word-wrap: break-word;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  pointer-events: none;

  /* Default стили */
  ${props => props.$type === 'default' && `
    background-color: ${theme.colors.typography.primary};
    color: ${theme.colors.typography.white};
    box-shadow: 0 8px 16px 0 rgba(41, 50, 58, 0.08), 0 4px 8px 0 rgba(41, 50, 58, 0.08), 0 2px 4px 0 rgba(41, 50, 58, 0.08);
  `}

  /* Error стили */
  ${props => props.$type === 'error' && `
    background-color: ${theme.colors.background.errorLight};
    color: ${theme.colors.typography.primary};
    border: 1px solid ${theme.colors.background.error};
    box-shadow: 0 8px 16px 0 rgba(242, 48, 0, 0.08), 0 4px 8px 0 rgba(242, 48, 0, 0.08), 0 2px 4px 0 rgba(242, 48, 0, 0.08);
  `}

  /* Позиционирование */
  ${props => {
    const isError = props.$type === 'error';
    const baseOffset = 4; // Базовый отступ 4px
    const errorOffset = isError ? 2 : 0; // Дополнительный отступ для error тултипов из-за border
    const triangleOffset = 8; // Отступ для треугольника (8px - размер треугольника)
    const totalOffset = baseOffset + errorOffset + triangleOffset;
    
    switch (props.$position) {
      case 'left':
        return `
          left: calc(100% + ${totalOffset}px);
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'right':
        return `
          right: calc(100% + ${totalOffset}px);
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'bottom':
        return `
          bottom: calc(100% + ${totalOffset}px);
          left: 50%;
          transform: translateX(-50%);
        `;
      default:
        return '';
    }
  }}
`;

const Triangle = styled.div<{ 
  $type: 'default' | 'error';
  $position: 'left' | 'right' | 'bottom';
  $visible: boolean;
}>`
  position: absolute;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;

  /* Default цвет треугольника - typo-primary без прозрачности */
  ${props => props.$type === 'default' && `
    /* Цвет уже правильный в SVG файлах */
  `}

  /* Error цвет треугольника - bg-error */
  ${props => props.$type === 'error' && `
    filter: brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(7500%) hue-rotate(0deg) brightness(100%) contrast(118%);
  `}

  /* Позиционирование треугольника */
  ${props => {
    const isError = props.$type === 'error';
    const errorOffset = isError ? 2 : 0; // Дополнительный отступ для error тултипов из-за border
    
    switch (props.$position) {
      case 'left':
        return `
          left: ${-8 - errorOffset}px;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 16px;
        `;
      case 'right':
        return `
          right: ${-8 - errorOffset}px;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 16px;
        `;
      case 'bottom':
        return `
          bottom: ${-8 - errorOffset}px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 10px;
        `;
      default:
        return '';
    }
  }}

  /* SVG треугольники */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  ${props => {
    switch (props.$position) {
      case 'left':
        return `
          &::before {
            background-image: url('/TriangleLeft.svg');
          }
        `;
      case 'right':
        return `
          &::before {
            background-image: url('/TriangleRight.svg');
          }
        `;
      case 'bottom':
        return `
          &::before {
            background-image: url('/TriangleDown.svg');
          }
        `;
      default:
        return '';
    }
  }}
`;

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  content,
  type = 'default',
  position = 'bottom',
  disabled = false,
  forceVisible = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const handleMouseEnter = () => {
    if (!disabled && !forceVisible) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!forceVisible) {
      setIsVisible(false);
    }
  };

  // Показываем тултип если forceVisible или обычный hover
  const shouldShow = forceVisible || isVisible;

  return (
    <TooltipContainer
      $disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <TooltipContent
        $type={type}
        $position={position}
        $visible={shouldShow}
      >
        {content}
        <Triangle
          $type={type}
          $position={position}
          $visible={shouldShow}
        />
      </TooltipContent>
    </TooltipContainer>
  );
};

export default CustomTooltip;
