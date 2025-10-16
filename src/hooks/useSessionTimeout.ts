import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { updateLastActivity } from '../store/slices/sessionSlice';
import { saveSession } from '../utils/storage';

// Интервал обновления активности в миллисекундах (5 минут)
const ACTIVITY_UPDATE_INTERVAL = 5 * 60 * 1000;

// Хук для управления таймаутом сессии
const useSessionTimeout = (): void => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Обновление времени последней активности
  const updateActivity = () => {
    dispatch(updateLastActivity());
    saveSession(session);
  };

  // Установка таймера для периодического обновления активности
  useEffect(() => {
    // Очищаем предыдущий таймер
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Устанавливаем новый таймер
    timerRef.current = setInterval(() => {
      updateActivity();
    }, ACTIVITY_UPDATE_INTERVAL);

    // Очистка при размонтировании
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session.userId]);

  // Обновление активности при взаимодействии пользователя
  useEffect(() => {
    const handleUserActivity = () => {
      updateActivity();
    };

    // События для отслеживания активности пользователя
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [session.userId]);
};

export default useSessionTimeout;
