/**
 * Утилита для очистки данных тестов при обновлении страницы
 */

/**
 * Очищает данные тестов из localStorage
 */
export const clearTestData = (): void => {
  try {
    // Очищаем данные всех тестов
    localStorage.removeItem('test1');
    localStorage.removeItem('test2');
    localStorage.removeItem('test3');
    localStorage.removeItem('test4');
    localStorage.removeItem('test5');
    localStorage.removeItem('test6');
    localStorage.removeItem('test7');
    
    // Очищаем общее состояние
    localStorage.removeItem('psycho_tests_state');
    localStorage.removeItem('psycho_tests_answers');
    
    console.log('Данные тестов очищены');
  } catch (error) {
    console.error('Ошибка при очистке данных тестов:', error);
  }
};

/**
 * Очищает данные анкеты из localStorage
 */
export const clearProfileData = (): void => {
  try {
    localStorage.removeItem('profile');
    localStorage.removeItem('psycho_tests_profile');
    console.log('Данные анкеты очищены');
  } catch (error) {
    console.error('Ошибка при очистке данных анкеты:', error);
  }
};

/**
 * Очищает все данные из localStorage
 */
export const clearAllData = (): void => {
  try {
    clearTestData();
    clearProfileData();
    localStorage.removeItem('session');
    localStorage.removeItem('psycho_tests_session');
    console.log('Все данные очищены');
  } catch (error) {
    console.error('Ошибка при очистке всех данных:', error);
  }
};

/**
 * Очищает userId - использовать только для полного сброса
 */
export const clearUserId = (): void => {
  try {
    localStorage.removeItem('userId');
    console.log('UserId очищен');
  } catch (error) {
    console.error('Ошибка при очистке userId:', error);
  }
};

/**
 * Полная очистка для нового пользователя
 */
export const fullReset = (): void => {
  try {
    clearAllData();
    clearUserId();
    console.log('Выполнен полный сброс данных');
  } catch (error) {
    console.error('Ошибка при полном сбросе:', error);
  }
};
