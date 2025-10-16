// Дизайн-система проекта "Психологические тесты"
// Основана на предоставленных CSS стилях

export const theme = {
  // Цветовая палитра
  colors: {
    // Фоновые цвета
    background: {
      default: '#ffffff',
      secondary: '#eff0f1',
      grayLight: 'hsla(220, 8%, 96%, 1)',
      border: '#c8ccd0',
      warning: '#f28900',
      warningLight: '#fef6ec',
      error: '#f23000',
      errorLight: '#feefec',
      paranja: 'rgba(15, 23, 35, 0.7)',
    },
    
    // Типографические цвета
    typography: {
      primary: '#101418',
      secondary: '#757d8a',
      ghost: '#acb1b9',
      white: '#ffffff',
    },
    
    // Цвета для контролов
    controls: {
      background: {
        default: '#136aec',
        ghost: '#f3f5f8',
        border: '#c8ccd0',
        borderHover: '#5a97f2',
        borderFocus: '#136aec',
      },
      typography: {
        default: '#757d8a',
        active: '#101418',
      },
    },
    
    // Цвета для кнопок
    button: {
      primary: {
        background: '#136aec',
        backgroundHover: '#5a97f2',
        typography: '#ffffff',
      },
      ghost: {
        background: '#eff2f5',
        backgroundHover: '#dadfe7',
        typography: '#757d8a',
      },
      disabled: {
        background: '#eceff4',
        typography: '#9dadbe',
      },
    },
  },
  
  // Типографика
  typography: {
    // Заголовки
    header: {
      fontSize: '24px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      lineHeight: '28px',
    },
    
    // Основной текст
    textNormal: {
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      lineHeight: '24px',
    },
    
    textNormalMedium: {
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      lineHeight: '24px',
    },
    
    textNormalSemibold: {
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      lineHeight: '24px',
    },
    
    textNormalBold: {
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      lineHeight: '24px',
    },
    
    // Мелкий текст
    textSmall: {
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      lineHeight: '16px',
    },
  },
  
  // Размеры и отступы
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Радиусы скругления
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  
  // Тени
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  
  // Переходы
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  // Брейкпоинты для адаптивного дизайна
  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '900px',
  },
} as const;

// Типы для TypeScript
export type Theme = typeof theme;
export type ColorKey = keyof typeof theme.colors;
export type TypographyKey = keyof typeof theme.typography;
