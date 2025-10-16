import { useEffect } from 'react';

/**
 * Хук для автоматической прокрутки страницы вверх
 * @param dependencies - массив зависимостей, при изменении которых происходит прокрутка
 */
export const useScrollToTop = (dependencies: any[] = []) => {
  useEffect(() => {
    // Мгновенная прокрутка к началу страницы
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, dependencies);
};

/**
 * Функция для принудительной прокрутки вверх
 * Используется в обработчиках событий
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });
};
