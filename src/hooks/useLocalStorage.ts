import { useState, useEffect } from 'react';

// Хук для работы с localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Получаем значение из localStorage или используем initialValue
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка при чтении из localStorage для ключа "${key}":`, error);
      return initialValue;
    }
  };

  // Состояние для хранения текущего значения
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Функция для обновления значения в localStorage и состоянии
  const setValue = (value: T): void => {
    try {
      // Сохраняем в состоянии
      setStoredValue(value);
      
      // Сохраняем в localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
      
      // Уведомляем другие вкладки об изменении
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.error(`Ошибка при записи в localStorage для ключа "${key}":`, error);
    }
  };

  // Слушаем изменения в других вкладках
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    // Слушаем событие storage
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
