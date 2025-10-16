import { RootState } from '../store';
import { ProfileData } from '../types';

// Ключи для хранения данных в localStorage
const STORAGE_KEYS = {
  STATE: 'psycho_tests_state',
  SESSION: 'psycho_tests_session',
  PROFILE: 'psycho_tests_profile',
  ANSWERS: 'psycho_tests_answers',
};

// Сохранение всего состояния в localStorage
export const saveState = (state: RootState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEYS.STATE, serializedState);
  } catch (error) {
    console.error('Ошибка при сохранении состояния:', error);
  }
};

// Загрузка всего состояния из localStorage
export const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEYS.STATE);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Ошибка при загрузке состояния:', error);
    return undefined;
  }
};

// Сохранение сессии
export const saveSession = (session: RootState['session']): void => {
  try {
    const serializedSession = JSON.stringify(session);
    localStorage.setItem(STORAGE_KEYS.SESSION, serializedSession);
  } catch (error) {
    console.error('Ошибка при сохранении сессии:', error);
  }
};

// Загрузка сессии
export const loadSession = (): RootState['session'] | undefined => {
  try {
    const serializedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!serializedSession) return undefined;
    return JSON.parse(serializedSession);
  } catch (error) {
    console.error('Ошибка при загрузке сессии:', error);
    return undefined;
  }
};

// Сохранение профиля - исправляем типизацию
export const saveProfile = (profile: ProfileData): void => {
  try {
    const serializedProfile = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, serializedProfile);
  } catch (error) {
    console.error('Ошибка при сохранении профиля:', error);
  }
};

// Загрузка профиля
export const loadProfile = (): ProfileData | undefined => {
  try {
    const serializedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!serializedProfile) return undefined;
    return JSON.parse(serializedProfile);
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error);
    return undefined;
  }
};

// Сохранение ответов
export const saveAnswers = (answers: RootState['answers']): void => {
  try {
    const serializedAnswers = JSON.stringify(answers);
    localStorage.setItem(STORAGE_KEYS.ANSWERS, serializedAnswers);
  } catch (error) {
    console.error('Ошибка при сохранении ответов:', error);
  }
};

// Загрузка ответов
export const loadAnswers = (): RootState['answers'] | undefined => {
  try {
    const serializedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
    if (!serializedAnswers) return undefined;
    return JSON.parse(serializedAnswers);
  } catch (error) {
    console.error('Ошибка при загрузке ответов:', error);
    return undefined;
  }
};

// Очистка всех данных
export const clearStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Ошибка при очистке хранилища:', error);
  }
};

// Проверка валидности сессии
export const isSessionValid = (session: RootState['session']): boolean => {
  if (!session) return false;
  
  const now = new Date();
  const expiryTime = new Date(session.expiresAt);
  
  return now < expiryTime;
};

// Генерация уникального ID пользователя
export const generateUniqueUserId = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `user_${timestamp}_${random}`;
};