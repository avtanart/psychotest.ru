import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { updateSession, updateLastActivity } from '../store/slices/sessionSlice';
import { setProfile } from '../store/slices/profileSlice';
import { setTestAnswers } from '../store/slices/answersSlice';
import { loadSession, loadProfile, loadAnswers, isSessionValid, saveSession } from '../utils/storage';
import useSessionTimeout from '../hooks/useSessionTimeout';

interface SessionManagerProps {
  children: React.ReactNode;
}

const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const session = useAppSelector((state) => state.session);
  
  // Флаг для отслеживания, выполнялось ли уже восстановление сессии
  const restorationAttemptedRef = useRef(false);
  
  // Флаг для отслеживания, что мы находимся на главной странице
  const isHomePage = location.pathname === '/';
  
  // Использование хука для управления таймаутом сессии
  useSessionTimeout();
  
  // Загрузка состояния при инициализации
  useEffect(() => {
    const loadStoredState = () => {
      try {
        // Если мы на главной странице, не загружаем состояние
        if (isHomePage) {
          return;
        }
        
        // Загрузка сессии
        const storedSession = loadSession();
        if (storedSession && isSessionValid(storedSession)) {
          dispatch(updateSession(storedSession));
        }
        
        // Загрузка профиля
        const storedProfile = loadProfile();
        if (storedProfile) {
          dispatch(setProfile(storedProfile));
        }
        
        // Загрузка ответов
        const storedAnswers = loadAnswers();
        if (storedAnswers) {
          Object.entries(storedAnswers).forEach(([testId, testResult]) => {
            dispatch(setTestAnswers({ testId, testResult }));
          });
        }
      } catch (error) {
        console.error('Error loading state from storage:', error);
      }
    };
    
    loadStoredState();
  }, [dispatch, isHomePage]);
  
  // Сохранение сессии при изменении
  useEffect(() => {
    // Не сохраняем сессию, если мы на главной странице
    if (!isHomePage) {
      saveSession(session);
    }
  }, [session, isHomePage]);
  
  // Обновление последней активности при изменении маршрута
  useEffect(() => {
    // Не обновляем активность на главной странице
    if (!isHomePage) {
      dispatch(updateLastActivity());
    }
  }, [location, dispatch, isHomePage]);
  
  // Восстановление прогресса
  useEffect(() => {
    // Если мы на главной странице, не восстанавливаем прогресс
    if (isHomePage) {
      // Сбрасываем флаг попытки восстановления на главной странице
      restorationAttemptedRef.current = false;
      return;
    }
    
    // Предотвращаем бесконечное перенаправление
    if (restorationAttemptedRef.current) {
      return;
    }
    
    const restoreProgress = () => {
      // Отмечаем, что попытка восстановления была выполнена
      restorationAttemptedRef.current = true;
      
      // Проверяем прогресс и перенаправляем на последнюю активную страницу
      if (session.progress) {
        // Если профиль не заполнен, перенаправляем на страницу профиля
        if (!session.progress.profile && location.pathname !== '/profile') {
          navigate('/profile');
          return;
        }
        
        // Если email отправлен, перенаправляем на страницу благодарности
        if (session.progress.email && location.pathname !== '/thank-you') {
          navigate('/thank-you');
          return;
        }
        
        // Проверяем тесты
        const testIds = Object.keys(session.progress).filter(
          key => key !== 'profile' && key !== 'email' && typeof session.progress[key] !== 'undefined'
        );
        
        // Находим первый незавершенный тест
        const incompleteTest = testIds.find(
          testId => session.progress[testId] !== true
        );
        
        if (incompleteTest && location.pathname !== `/test/${incompleteTest}`) {
          navigate(`/test/${incompleteTest}`);
          return;
        }
        
        // Если все тесты завершены, но email не отправлен
        const allTestsCompleted = testIds.length > 0 && testIds.every(
          testId => session.progress[testId] === true
        );
        
        if (allTestsCompleted && !session.progress.email) {
          navigate('/');
          return;
        }
      }
    };
    
    // Восстанавливаем прогресс только при первой загрузке
    const timer = setTimeout(restoreProgress, 500);
    
    return () => clearTimeout(timer);
  }, [session.progress, location.pathname, navigate, isHomePage]);
  
  return <>{children}</>;
};

export default SessionManager;