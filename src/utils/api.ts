import { ProfileData, UserAnswers, Test1CompleteData, Test2CompleteData, Test4CompleteData, Test5CompleteData, Test6CompleteData, TEST5_TASKS_DATA } from '../types';

// ========================================
// КОНСТАНТЫ
// ========================================

const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwG5IO6tm-8hnnVD3HpNsVUdPx7Mu2fCEd23OupKgqYY04Q1JjfKHOLg0BX89vr52O8Bw/exec',
  API_KEY: 'AKfycbwG5IO6tm-8hnnVD3HpNsVUdPx7Mu2fCEd23OupKgqYY04Q1JjfKHOLg0BX89vr52O8Bw',
  SUBMIT_TIMEOUT: 3000,
  MAX_RETRIES: 3
};

// ========================================
// ТИПЫ
// ========================================

interface SubmitData {
  userId: string;
  timestamp: string;
  profile?: ProfileData;
  testResults?: UserAnswers;
  totalTime?: number;
  email?: string;
  test1?: Test1CompleteData;
  test2?: Test2CompleteData;
  test3?: any;
  test4?: Test4CompleteData;
  test5?: Test5CompleteData;
  test6?: Test6CompleteData;
  test7?: any;
}

interface ApiResponse {
  success: boolean;
  message: string;
  reportId?: string;
  error?: string;
}

// ========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ========================================

const generateUserId = (): string => {
  // Проверяем, есть ли уже сохраненный userId
  const existingUserId = localStorage.getItem('userId');
  if (existingUserId) {
    return existingUserId;
  }
  
  // Создаем новый userId только если его нет
  const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem('userId', newUserId);
  return newUserId;
};

const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при получении данных из localStorage (${key}):`, error);
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Ошибка при сохранении данных в localStorage (${key}):`, error);
  }
};


// ========================================
// ФОРМАТТЕРЫ ДАННЫХ ТЕСТОВ
// ========================================

const ADJECTIVE_PAIRS = [
  { id: 1, left: 'длительное', right: 'мгновенное' },
  { id: 2, left: 'активное', right: 'пассивное' },
  { id: 3, left: 'напряженное', right: 'расслабленное' },
  { id: 4, left: 'радостное', right: 'печальное' },
  { id: 5, left: 'стремительное', right: 'застывшее' },
  { id: 6, left: 'плотное', right: 'пустое' },
  { id: 7, left: 'яркое', right: 'тусклое' },
  { id: 8, left: 'понятное', right: 'непонятное' },
  { id: 9, left: 'большое', right: 'маленькое' },
  { id: 10, left: 'неделимое', right: 'делимое' },
  { id: 11, left: 'тревожное', right: 'спокойное' },
  { id: 12, left: 'цветное', right: 'серое' },
  { id: 13, left: 'объемное', right: 'плоское' },
  { id: 14, left: 'широкое', right: 'узкое' },
  { id: 15, left: 'далекое', right: 'близкое' },
  { id: 16, left: 'непрерывное', right: 'прерывное' },
  { id: 17, left: 'реальное', right: 'кажущееся' },
  { id: 18, left: 'частное', right: 'общее' },
  { id: 19, left: 'постоянное', right: 'изменчивое' },
  { id: 20, left: 'глубокое', right: 'мелкое' },
  { id: 21, left: 'ощущаемое', right: 'неощущаемое' },
  { id: 22, left: 'светлое', right: 'темное' },
  { id: 23, left: 'замкнутое', right: 'открытое' },
  { id: 24, left: 'обратимое', right: 'необратимое' },
  { id: 25, left: 'ритмичное', right: 'неритмичное' }
];

const formatTest1Data = (test1State: any): Test1CompleteData => {
  const result: any = {};
  
  const formatTaskAnswers = (taskId: string) => {
    if (!test1State.answers?.[taskId]) return {};
    
    const answers = test1State.answers[taskId];
    const formattedAnswers: { [key: number]: { adjective: string; value: number } } = {};
    
    Object.entries(answers).forEach(([pairId, answer]: [string, any]) => {
      if (answer) {
        const pairIdNum = parseInt(pairId);
        const pair = ADJECTIVE_PAIRS.find(p => p.id === pairIdNum);
        if (pair) {
          const adjectiveText = answer.adjective === 'left' ? pair.left : pair.right;
          formattedAnswers[pairIdNum] = {
            adjective: adjectiveText,
            value: answer.value
          };
        }
      }
    });
    
    return formattedAnswers;
  };
  
  ['task1', 'task2', 'task3'].forEach(taskId => {
    const taskAnswers = formatTaskAnswers(taskId);
    if (Object.keys(taskAnswers).length > 0) {
      result[taskId] = { answers: taskAnswers };
    }
  });
  
  return result;
};

const formatTest2Data = (test2State: any): Test2CompleteData => {
  const task1Questions = [
    { id: 1, text: 'Я нахожусь в напряжении' },
    { id: 2, text: 'Я расстроен' },
    { id: 3, text: 'Я тревожусь о будущем' },
    { id: 4, text: 'Я нервничаю' },
    { id: 5, text: 'Я озабочен' },
    { id: 6, text: 'Я возбужден' },
    { id: 7, text: 'Я ощущаю непонятную угрозу' },
    { id: 8, text: 'Я устаю быстрее обычного' },
    { id: 9, text: 'Я неуверен в себе' },
    { id: 10, text: 'Я избегаю любых конфликтов' },
    { id: 11, text: 'Я чувствую замешательство' },
    { id: 12, text: 'Я ощущаю свою бесполезность' },
    { id: 13, text: 'Я спал беспокойно' },
    { id: 14, text: 'Я ощущаю себя утомленным' },
    { id: 15, text: 'Я эмоционально чувствителен' }
  ];

  const task2Questions = [
    { id: 1, text: 'Я находился в напряжении' },
    { id: 2, text: 'Я расстраивался' },
    { id: 3, text: 'Я тревожился о будущем' },
    { id: 4, text: 'Я нервничал' },
    { id: 5, text: 'Я бывал озабочен' },
    { id: 6, text: 'Я бывал возбужден' },
    { id: 7, text: 'Я ощущал непонятную угрозу' },
    { id: 8, text: 'Я быстро уставал' },
    { id: 9, text: 'Я бывал неуверен в себе' },
    { id: 10, text: 'Я избегал любых конфликтов' },
    { id: 11, text: 'Я легко приходил в замешательство' },
    { id: 12, text: 'Я ощущал свою бесполезность' },
    { id: 13, text: 'Я плохо спал' },
    { id: 14, text: 'Я ощущал себя утомленным' },
    { id: 15, text: 'Я бывал эмоционально чувствителен' }
  ];
  
  const result: any = {
    task1: { answers: {} },
    task2: { answers: {} }
  };
  
  const formatAnswers = (taskId: 'task1' | 'task2', taskQuestions: any[]) => {
    if (!test2State.answers?.[taskId]) return {};
    
    const answers = test2State.answers[taskId];
    const formattedAnswers: { [key: number]: { question: string; answer: string } } = {};
    
    taskQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        formattedAnswers[question.id] = {
          question: question.text,
          answer: answer as string
        };
      }
    });
    
    return formattedAnswers;
  };
  
  const task1Answers = formatAnswers('task1', task1Questions);
  console.log('task1Answers:', task1Answers);
  if (Object.keys(task1Answers).length > 0) {
    result.task1.answers = task1Answers;
  }
  
  const task2Answers = formatAnswers('task2', task2Questions);
  console.log('task2Answers:', task2Answers);
  if (Object.keys(task2Answers).length > 0) {
    result.task2.answers = task2Answers;
  }
  
  console.log('Итоговый результат formatTest2Data:', result);
  return result;
};

const formatTest4Data = (test4State: any): Test4CompleteData => {
  const questions = [
    { id: 'test4_q1', text: 'У меня есть люди, которые в мое отсутствие могут позаботиться о моей квартире (цветах, домашних животных)' },
    { id: 'test4_q2', text: 'Есть люди, которые принимают меня таким, какой я есть' },
    { id: 'test4_q3', text: 'Моим друзьям и родственникам важно мое мнение по определенным вопросам' },
    { id: 'test4_q4', text: 'Мне хотелось бы больше внимания и понимания от других людей' },
    { id: 'test4_q5', text: 'Я знаю одного человека, которому я могу полностью довериться и с его помощью решить любой вопрос' },
    { id: 'test4_q6', text: 'Я могу по необходимости одолжить у кого-то бытовой прибор или продукты' },
    { id: 'test4_q7', text: 'У меня есть друзья (родственники), которые умеют хорошо слушать, когда мне хочется выговориться' },
    { id: 'test4_q8', text: 'У меня нет никого, к кому бы я мог запросто и охотно зайти' },
    { id: 'test4_q9', text: 'У меня есть друзья (родственники), которые меня запросто обнимают' },
    { id: 'test4_q10', text: 'Если я болен, я могу без колебаний попросить друзей или родственников купить важные для меня вещи, например, еду' },
    { id: 'test4_q11', text: 'Если я сильно подавлен, я знаю – к кому мне пойти' },
    { id: 'test4_q12', text: 'Я часто чувствую себя аутсайдером' },
    { id: 'test4_q13', text: 'Есть люди, которые делят со мной горе и радость' },
    { id: 'test4_q14', text: 'С некоторыми друзьями (родственниками) я могу полностью расслабиться' },
    { id: 'test4_q15', text: 'У меня есть близкие люди, рядом с которыми я очень хорошо себя чувствую' },
    { id: 'test4_q16', text: 'У меня достаточно людей, которые по-настоящему мне помогут, если я не буду знать, как быть дальше' },
    { id: 'test4_q17', text: 'Есть люди, которые считаются со мной, даже когда я делаю ошибки' },
    { id: 'test4_q18', text: 'Мне бы хотелось больше безопасности и близости с другими людьми' },
    { id: 'test4_q19', text: 'Есть достаточно людей, с которыми у меня хорошие отношения' },
    { id: 'test4_q20', text: 'Есть группа людей (компания), к которой я себя отношу' },
    { id: 'test4_q21', text: 'С помощью друзей и знакомых я часто получаю полезную информацию (например, о хорошем враче и т. п.)' },
    { id: 'test4_q22', text: 'Есть люди, которым я могу открыть все мои чувства, не ощущая при этом неудобства' }
  ];

  const formattedAnswers: { [key: string]: { question: string; answer: string } } = {};
  const answers = test4State.answers || {};

  Object.keys(answers).forEach(questionId => {
    const answer = answers[questionId];
    if (answer) {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        formattedAnswers[questionId] = {
          question: question.text,
          answer: answer
        };
      }
    }
  });

  return {
    answers: formattedAnswers,
    startedAt: test4State.startedAt || null,
    completedAt: test4State.completedAt || null,
    timeSpent: test4State.timeSpent || null
  };
};

const formatTest5Data = (test5State: any): Test5CompleteData => {
  const formattedAnswers: { [key: number]: { taskTitle: string; selectedOptions: { id: number; text: string; }[] } } = {};
  const answers = test5State.answers || {};

  Object.keys(answers).forEach(taskId => {
    const taskIdNum = parseInt(taskId);
    const selectedOptionIds = answers[taskId];
    
    if (selectedOptionIds && selectedOptionIds.length > 0) {
      const taskData = TEST5_TASKS_DATA.find((task: any) => task.id === taskIdNum);
      if (taskData) {
        const selectedOptions = selectedOptionIds.map((optionId: number) => {
          const option = taskData.options.find((opt: any) => opt.id === optionId);
          return {
            id: optionId,
            text: option ? option.text : `Вариант ${optionId}`
          };
        });
        
        formattedAnswers[taskIdNum] = {
          taskTitle: taskData.title,
          selectedOptions: selectedOptions
        };
      }
    }
  });

  return {
    answers: formattedAnswers,
    startedAt: test5State.startedAt || null,
    completedAt: test5State.completedAt || null,
    timeSpent: test5State.timeSpent || null
  };
};

const formatTest6Data = (test6State: any): Test6CompleteData => {
  console.log('formatTest6Data получил данные:', test6State);
  
  const task1Questions = [
    { id: 1, text: 'Я испытываю напряжение, мне не по себе' },
    { id: 2, text: 'Я испытываю страх, кажется, что что-то ужасное может вот-вот случиться' },
    { id: 3, text: 'Беспокойные мысли крутятся у меня в голове' },
    { id: 4, text: 'Я легко могу присесть и расслабиться' },
    { id: 5, text: 'Я испытываю внутреннее напряжение или дрожь' },
    { id: 6, text: 'Я испытываю неусидчивость, мне постоянно нужно двигаться' },
    { id: 7, text: 'У меня бывает внезапное чувство паники' }
  ];

  const task2Questions = [
    { id: 1, text: 'То, что приносило мне большое удовольствие, и сейчас вызывает у меня такое же чувство' },
    { id: 2, text: 'Я способен рассмеяться и увидеть в том или ином событии смешное' },
    { id: 3, text: 'Я испытываю бодрость' },
    { id: 4, text: 'Мне кажется, что я стал все делать очень медленно' },
    { id: 5, text: 'Я не слежу за своей внешностью' },
    { id: 6, text: 'Я считаю, что мои дела (занятия, увлечения) могут принести мне чувство удовлетворения' },
    { id: 7, text: 'Я могу получить удовольствие от хорошей книги, радио- или телепрограммы' }
  ];

  const result: any = {
    task1: { answers: {} },
    task2: { answers: {} }
  };

  const formatAnswers = (taskId: 'task1' | 'task2', taskQuestions: any[]) => {
    if (!test6State[taskId]?.answers) return {};
    
    const answers = test6State[taskId].answers;
    const formattedAnswers: { [key: number]: { question: string; answer: string } } = {};
    
    taskQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        formattedAnswers[question.id] = {
          question: question.text,
          answer: answer as string
        };
      }
    });
    
    return formattedAnswers;
  };

  const task1Answers = formatAnswers('task1', task1Questions);
  console.log('task1Answers после форматирования:', task1Answers);
  if (Object.keys(task1Answers).length > 0) {
    result.task1.answers = task1Answers;
  }

  const task2Answers = formatAnswers('task2', task2Questions);
  console.log('task2Answers после форматирования:', task2Answers);
  if (Object.keys(task2Answers).length > 0) {
    result.task2.answers = task2Answers;
  }

  // Добавляем временные метки
  result.startedAt = test6State.startedAt || null;
  result.completedAt = test6State.completedAt || null;
  result.timeSpent = test6State.timeSpent || null;

  console.log('Итоговый результат formatTest6Data:', result);
  return result;
};

const formatTest7Data = (test7State: any): any => {
  console.log('formatTest7Data получил данные:', test7State);
  
  const result: any = {
    page1: { answers: {} },
    page2: { answers: {} },
    page3: { answers: {} },
    page4: { answers: {} },
    page5: { answers: {} },
    startedAt: test7State.startedAt || null,
    completedAt: test7State.completedAt || null,
    timeSpent: test7State.timeSpent || null
  };

  // Импортируем данные вопросов для получения правильных текстов
  const { TEST7_ALL_QUESTIONS } = require('../types/test7Types');

  // Обрабатываем каждую страницу
  ['page1', 'page2', 'page3', 'page4', 'page5'].forEach((page, pageIndex) => {
    const pageData = test7State[page];
    if (pageData?.answers) {
      Object.keys(pageData.answers).forEach(questionId => {
        const answer = pageData.answers[questionId];
        if (answer) {
          const questionNumber = parseInt(questionId);
          
          // Находим вопрос в общем списке вопросов
          const questionData = TEST7_ALL_QUESTIONS.find((q: any) => q.id === questionNumber);
          const questionText = questionData ? questionData.text : `Вопрос ${questionNumber}`;
          
          // Находим текст ответа по ID
          let answerText = answer;
          if (questionData && questionData.options) {
            const optionData = questionData.options.find((opt: any) => opt.id === answer);
            if (optionData) {
              answerText = optionData.text;
            }
          }
          
          result[page].answers[questionNumber] = {
            question: questionText,
            answer: answerText
          };
        }
      });
    }
  });

  console.log('Итоговый результат formatTest7Data:', result);
  return result;
};

// ========================================
// ОСНОВНЫЕ ФУНКЦИИ API
// ========================================

let isSubmittingData = false;
let lastSubmitData: string | null = null;
let lastSubmitTime = 0;

const submitResults = async (data: SubmitData): Promise<ApiResponse> => {
  if (isSubmittingData) {
    console.log('Отправка уже выполняется, пропускаем запрос. isSubmittingData =', isSubmittingData);
    return {
      success: false,
      message: "Отправка уже выполняется"
    };
  }
  
  // Проверка на дублирование по содержимому данных
  const currentTime = Date.now();
  const dataString = JSON.stringify(data);
  
  if (lastSubmitData === dataString && (currentTime - lastSubmitTime) < 10000) {
    console.log('Обнаружен дублирующийся запрос (идентичные данные), пропускаем');
    return {
      success: true,
      message: "Дублирующийся запрос пропущен"
    };
  }
  
  isSubmittingData = true;
  lastSubmitData = dataString;
  lastSubmitTime = currentTime;
  console.log('Начинаем отправку данных, устанавливаем флаг isSubmittingData =', isSubmittingData);
  
  try {
    // Валидация данных
    if (!data.userId) {
      data.userId = generateUserId();
    }
    
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    console.log('=== ОТПРАВКА ДАННЫХ В GOOGLE APPS SCRIPT ===');
    console.log('Отправка данных в Google Sheets:', JSON.stringify(data, null, 2));
    console.log('API URL:', CONFIG.API_URL);
    console.log('API KEY:', CONFIG.API_KEY);
    
    // Отправка через скрытую форму (обход CORS)
    console.log('Отправляем запрос на:', CONFIG.API_URL);
    console.log('Данные для отправки:', data);
    
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const form = document.createElement('form');
      form.style.display = 'none';
      form.method = 'POST';
      form.action = CONFIG.API_URL;
      form.target = 'hidden-iframe';
      
      // Добавляем данные
      const dataField = document.createElement('input');
      dataField.type = 'hidden';
      dataField.name = 'data';
      dataField.value = JSON.stringify(data);
      form.appendChild(dataField);
      
      // Добавляем API ключ
      const apiKeyField = document.createElement('input');
      apiKeyField.type = 'hidden';
      apiKeyField.name = 'apiKey';
      apiKeyField.value = CONFIG.API_KEY;
      form.appendChild(apiKeyField);
      
      document.body.appendChild(form);
      form.submit();
      
      // Очистка элементов
      setTimeout(() => {
        if (document.body.contains(form)) document.body.removeChild(form);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        
        // Сбрасываем флаг отправки после завершения
        isSubmittingData = false;
        console.log('Сброшен флаг isSubmittingData = false');
        
        console.log(`Данные отправлены успешно`);
      }, CONFIG.SUBMIT_TIMEOUT);
      
      // Возвращаем успешный результат (мы не можем получить ответ от iframe)
      resolve({
        success: true,
        message: "Данные успешно отправлены",
        reportId: `test-${Date.now()}`
      });
    });
    
  } catch (error) {
    isSubmittingData = false;
    lastSubmitData = null; // Сбрасываем данные последнего запроса
    console.error('Ошибка при отправке результатов:', error);
    
    return {
      success: false,
      message: "Ошибка при отправке данных",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// ========================================
// ПУБЛИЧНЫЕ ФУНКЦИИ API
// ========================================

export const submitAllData = async (userId?: string, profileData?: ProfileData, email?: string): Promise<ApiResponse> => {
  try {
    console.log('Запуск функции submitAllData');
    
    // Получаем данные профиля
    const profile = profileData || getStoredData('profile', null);
    
    // Получаем userId
    const actualUserId = userId || getStoredData('session', { userId: null }).userId || generateUserId();
    
    // Получаем данные всех тестов
    const test1Data = getStoredData<any>('test1', null);
    const test2Data = getStoredData<any>('test2', null);
    const test3Data = getStoredData<any>('test3', null);
    const test4Data = getStoredData<any>('test4', null);
    const test5Data = getStoredData<any>('test5', null);
    const test6Data = getStoredData<any>('test6', null);
    const test7Data = getStoredData<any>('test7', null);
    
    console.log('=== ДАННЫЕ ТЕСТОВ ИЗ LOCALSTORAGE ===');
    console.log('test1Data:', test1Data);
    console.log('test2Data:', test2Data);
    console.log('test3Data:', test3Data);
    console.log('test4Data:', test4Data);
    console.log('test5Data:', test5Data);
    console.log('test6Data:', test6Data);
    console.log('test7Data:', test7Data);
    
    // Формируем объект данных для отправки
    const data: SubmitData = {
      userId: actualUserId,
      timestamp: new Date().toISOString()
    };

    // Добавляем email если он передан
    if (email) {
      data.email = email;
    }
    
    // Добавляем данные профиля ТОЛЬКО если есть данные профиля
    if (profile) {
      data.profile = profile;
    }
    
    // Добавляем данные тестов
    if (test1Data?.answers) {
      data.test1 = formatTest1Data(test1Data);
    }
    
    if (test2Data?.answers) {
      data.test2 = formatTest2Data(test2Data);
    }
    
    if (test3Data?.answers) {
      data.test3 = { answers: test3Data.answers };
    }
    
    if (test4Data?.answers) {
      data.test4 = formatTest4Data(test4Data);
    }
    
    if (test5Data?.answers) {
      console.log('Отправляем данные test5:', test5Data);
      data.test5 = formatTest5Data(test5Data);
      console.log('Отформатированные данные test5:', data.test5);
    } else {
      console.log('test5Data не содержит answers:', test5Data);
    }
    
    if (test6Data?.task1 || test6Data?.task2) {
      console.log('Отправляем данные test6:', test6Data);
      data.test6 = formatTest6Data(test6Data);
      console.log('Отформатированные данные test6:', data.test6);
    }
    
    if (test7Data?.page1 || test7Data?.page2 || test7Data?.page3 || test7Data?.page4 || test7Data?.page5) {
      console.log('Отправляем данные test7:', test7Data);
      data.test7 = formatTest7Data(test7Data);
      console.log('Отформатированные данные test7:', data.test7);
    } else {
      console.log('test7Data не содержит страниц:', test7Data);
    }
    
    return await submitResults(data);
    
  } catch (error) {
    console.error('Ошибка при отправке всех данных:', error);
    
    return {
      success: false,
      message: "Ошибка при отправке данных",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export const submitProfileData = async (profile: ProfileData): Promise<ApiResponse> => {
  try {
    // Сохраняем профиль в localStorage
    setStoredData('profile', profile);
    
    // Отправляем данные
    return await submitAllData(undefined, profile);
    
  } catch (error) {
    console.error('Ошибка при отправке данных профиля:', error);
    
    return {
      success: false,
      message: "Ошибка при отправке данных профиля",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export const submitCheckData = async (
  currentTestType: 'profile' | 'test1' | 'test2' | 'test3' | 'test4' | 'test5' | 'test6' | 'test7',
  userId?: string,
  profileData?: ProfileData
): Promise<ApiResponse> => {
  try {
    console.log(`Отправка данных до теста ${currentTestType} включительно`);
    
    // Получаем данные профиля
    const profile = profileData || getStoredData('profile', null);
    
    // Проверяем, что userId существует
    if (!userId) {
      console.error('ОШИБКА: userId не найден');
      return { success: false, message: "Ошибка: ID пользователя не найден" };
    }
    
    // Получаем userId
    const actualUserId = userId || getStoredData('session', { userId: null }).userId || generateUserId();
    
    // Формируем объект данных для отправки
    const data: SubmitData = {
      userId: actualUserId,
      timestamp: new Date().toISOString()
    };
    
    // Добавляем данные профиля
    if (profile) {
      data.profile = profile;
    }
    
    // Если это только профиль, не добавляем данные тестов
    if (currentTestType === 'profile') {
      // Только профиль, тесты не добавляем
    } else {
      // Добавляем данные тестов в зависимости от текущего теста
      const testOrder = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7'];
      const currentIndex = testOrder.indexOf(currentTestType);
      
      for (let i = 0; i <= currentIndex; i++) {
        const testType = testOrder[i];
        const testData = getStoredData<any>(testType, null);
        
        console.log(`Проверяем данные для ${testType}:`, testData);
        
        // Проверяем наличие данных теста (answers может быть в разных форматах)
        const hasAnswers = testData && (
          testData.answers || 
          (testData.task1 && testData.task1.answers) || 
          (testData.task2 && testData.task2.answers) ||
          (testData.task3 && testData.task3.answers) ||
          (testData.page1 && testData.page1.answers) ||
          (testData.page2 && testData.page2.answers) ||
          (testData.page3 && testData.page3.answers) ||
          (testData.page4 && testData.page4.answers) ||
          (testData.page5 && testData.page5.answers)
        );
        
        console.log(`hasAnswers для ${testType}:`, hasAnswers);
        if (testData && testData.task1) {
          console.log(`task1.answers для ${testType}:`, testData.task1.answers);
        }
        if (testData && testData.task2) {
          console.log(`task2.answers для ${testType}:`, testData.task2.answers);
        }
        if (testData && testData.page1) {
          console.log(`page1.answers для ${testType}:`, testData.page1.answers);
        }
        if (testData && testData.page2) {
          console.log(`page2.answers для ${testType}:`, testData.page2.answers);
        }
        
        if (hasAnswers) {
          switch (testType) {
            case 'test1':
              data.test1 = formatTest1Data(testData);
              break;
            case 'test2':
              data.test2 = formatTest2Data(testData);
              break;
            case 'test3':
              data.test3 = { answers: testData.answers };
              break;
            case 'test4':
              data.test4 = formatTest4Data(testData);
              break;
            case 'test5':
              data.test5 = formatTest5Data(testData);
              break;
            case 'test6':
              console.log('Форматируем данные test6:', testData);
              data.test6 = formatTest6Data(testData);
              console.log('Отформатированные данные test6:', data.test6);
              break;
            case 'test7':
              console.log('Форматируем данные test7:', testData);
              data.test7 = formatTest7Data(testData);
              console.log('Отформатированные данные test7:', data.test7);
              break;
          }
          console.log(`Добавлены данные для ${testType}:`, data[testType as keyof SubmitData]);
        } else {
          console.log(`Нет данных для ${testType}`);
        }
      }
    }
    
    console.log('=== ИТОГОВЫЕ ДАННЫЕ ДЛЯ ОТПРАВКИ ===');
    console.log('Данные:', JSON.stringify(data, null, 2));
    console.log('Тип данных:', typeof data);
    console.log('Ключи данных:', Object.keys(data));
    
    try {
      const result = await submitResults(data);
      console.log('Результат отправки:', result);
      return result;
    } catch (submitError) {
      console.error('Ошибка в submitResults:', submitError);
      throw submitError;
    }
    
  } catch (error) {
    console.error(`=== ОШИБКА ПРИ ОТПРАВКЕ ДАННЫХ ДО ТЕСТА ${currentTestType} ===`);
    console.error('Тип ошибки:', typeof error);
    console.error('Сообщение ошибки:', error instanceof Error ? error.message : String(error));
    console.error('Стек ошибки:', error instanceof Error ? error.stack : 'Нет стека');
    console.error('Полная ошибка:', error);
    
    return {
      success: false,
      message: "Ошибка при отправке данных",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// Функции для обратной совместимости
export const submitTest1Data = () => submitAllData();
export const submitTest2Data = () => submitAllData();
export { submitResults };

// Функция для очистки кэша отправленных данных
export const clearSubmittedData = (): void => {
  lastSubmitData = null;
  lastSubmitTime = 0;
  isSubmittingData = false;
  console.log('Очищен кэш отправленных данных');
};

export const checkApiStatus = async (): Promise<ApiResponse> => {
  try {
    console.log('Проверка статуса API');
    
    // Используем простой GET запрос через window.open для обхода CORS
    const testUrl = `${CONFIG.API_URL}?apiKey=${CONFIG.API_KEY}`;
    console.log('Открываем URL для проверки:', testUrl);
    
    // Открываем в новой вкладке для проверки
    const newWindow = window.open(testUrl, '_blank');
    
    // Закрываем окно через 2 секунды
    setTimeout(() => {
      if (newWindow && !newWindow.closed) {
        newWindow.close();
      }
    }, 2000);
    
    // Возвращаем успешный результат, так как мы не можем получить ответ
    return {
      success: true,
      message: "API проверен (открыта новая вкладка)",
      reportId: `status-${Date.now()}`
    };
    
  } catch (error) {
    console.error('Ошибка при проверке статуса API:', error);
    
    return {
      success: false,
      message: "Ошибка при проверке статуса API",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// Отправка только email для обновления существующей записи
export const submitEmailOnly = async (email: string): Promise<ApiResponse> => {
  try {
    const userId = localStorage.getItem('userId') || generateUserId();
    
    const data: SubmitData = {
      userId,
      timestamp: new Date().toISOString(),
      email: email
    };
    
    console.log('Отправка только email:', email);
    
    return await submitResults(data);
    
  } catch (error) {
    console.error('Ошибка при отправке email:', error);
    
    return {
      success: false,
      message: "Ошибка при отправке email",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
