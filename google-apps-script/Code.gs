// Константы
const API_KEY = "AKfycbwG5IO6tm-8hnnVD3HpNsVUdPx7Mu2fCEd23OupKgqYY04Q1JjfKHOLg0BX89vr52O8Bw"; // Используем тот же ключ, что и в API_URL
// Замените на ID вашей Google таблицы, если у вас уже есть созданная таблица
const SHEET_ID = "1zzDu3chzHTUE8nwG9BYoI_cUS_YDK0_QBgVfT5ags2Q";
const RESPONSES_SHEET_NAME = "Responses";
const RAW_DATA_SHEET_NAME = "Raw Data";

// Обработка OPTIONS запросов для CORS
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Обработка POST запросов
function doPost(e) {
  try {
    // Получение данных из запроса
    let data;
    if (e.parameter && e.parameter.data) {
      // Если данные пришли через параметр формы
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      // Если данные пришли через тело запроса
      data = JSON.parse(e.postData.contents);
    } else {
      // Возвращаем ошибку
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Нет данных в запросе"
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Проверка API ключа
    const apiKey = e.parameter && e.parameter.apiKey ? e.parameter.apiKey : 
                  (e.headers && e.headers["X-API-Key"] ? e.headers["X-API-Key"] : null);
                  
    if (apiKey !== API_KEY) {
      // Возвращаем ошибку
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Неверный API ключ"
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Валидация данных
    if (!validateData(data)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Некорректный формат данных"
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Сохранение в Google Sheets
    const result = saveToSheet(data);
    
    // Отправка email с результатами
    if (data.email) {
      sendEmail(data.email, data);
    }
    
    // Возвращаем успешный результат
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Данные успешно сохранены",
      reportId: result.reportId
    }))
    .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Возвращаем ошибку
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Ошибка: " + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Обработка GET запросов
function doGet(e) {
  // Проверка API ключа
  if (!validateApiKey(e)) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Неверный API ключ"
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Проверка действия
  if (e.parameter && e.parameter.action === "status") {
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "API работает",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: "Неизвестное действие"
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

// Валидация API ключа
function validateApiKey(e) {
  const apiKey = e.parameter && e.parameter.apiKey ? e.parameter.apiKey : 
                (e.headers && e.headers["X-API-Key"] ? e.headers["X-API-Key"] : null);
  return apiKey === API_KEY;
}

// Валидация данных
function validateData(data) {
  // Проверка обязательных полей
  if (!data.userId) {
    return false;
  }
  
  return true;
}

// Сохранение данных в таблицу
function saveToSheet(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // Сохранение в лист Responses
  const responsesSheet = getOrCreateSheet(ss, RESPONSES_SHEET_NAME);
  saveToResponsesSheet(responsesSheet, data);
  
  // Сохранение в лист Raw Data
  const rawDataSheet = getOrCreateSheet(ss, RAW_DATA_SHEET_NAME);
  saveToRawDataSheet(rawDataSheet, data);
  
  // Генерация ID отчета
  const reportId = Utilities.getUuid();
  
  return {
    reportId: reportId
  };
}

// Получение или создание листа
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    
    // Настройка заголовков в зависимости от типа листа
    if (sheetName === RESPONSES_SHEET_NAME) {
      setupResponsesHeaders(sheet);
    } else if (sheetName === RAW_DATA_SHEET_NAME) {
      setupRawDataHeaders(sheet);
    }
  }
  return sheet;
}

// Настройка заголовков для листа Responses
function setupResponsesHeaders(sheet) {
  const headers = [
    "Timestamp", "User ID", 
    "Name", "Gender", "Age", "Education", "Marital Status", "Children", 
    "Has Chronic Diseases", "Diseases",
    "Test 1 Score", "Test 2 Score", "Test 3 Score", 
    "Test 4 Score", "Test 5 Score", "Test 6 Score", "Test 7 Score",
    "Total Time", "Email", "Report Sent"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

// Настройка заголовков для листа Raw Data
function setupRawDataHeaders(sheet) {
  const headers = [
    "User ID", "Timestamp", "Profile Data", 
    "Test 1 Data", "Test 2 Data", "Test 3 Data", 
    "Test 4 Data", "Test 5 Data", "Test 6 Data", "Test 7 Data"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

// Сохранение в лист Responses
function saveToResponsesSheet(sheet, data) {
  // Форматирование списка заболеваний
  let diseasesString = "";
  if (data.profile && data.profile.hasChronicDiseases === "yes") {
    const diseases = [];
    if (data.profile.diseases.hypertension) diseases.push("Гипертония");
    if (data.profile.diseases.coronaryHeartDisease) diseases.push("Ишемическая болезнь сердца");
    if (data.profile.diseases.heartFailure) diseases.push("Сердечная недостаточность");
    if (data.profile.diseases.asthma) diseases.push("Бронхиальная астма");
    if (data.profile.diseases.chronicBronchitis) diseases.push("Хронический бронхит");
    if (data.profile.diseases.copd) diseases.push("ХОБЛ");
    if (data.profile.diseases.diabetesType1) diseases.push("Сахарный диабет 1 типа");
    if (data.profile.diseases.diabetesType2) diseases.push("Сахарный диабет 2 типа");
    if (data.profile.diseases.cancer) diseases.push("Онкологические заболевания");
    if (data.profile.diseases.hiv) diseases.push("ВИЧ/СПИД");
    
    if (data.profile.diseases.other) {
      diseases.push(data.profile.diseases.other);
    }
    
    diseasesString = diseases.join(", ");
  } else {
    diseasesString = "Нет";
  }
  
  // Подготовка данных для записи
  const rowData = [
    new Date(), // Timestamp
    data.userId
  ];
  
  // Если есть данные профиля, добавляем их
  if (data.profile) {
    rowData.push(
      data.profile.name || '',
      data.profile.gender || '',
      data.profile.age || '',
      data.profile.education || '',
      data.profile.maritalStatus || '',
      data.profile.children || '',
      data.profile.hasChronicDiseases || 'Нет',
      diseasesString
    );
  } else {
    // Если нет данных профиля, добавляем пустые значения
    rowData.push('', '', '', '', '', '', '', '');
  }
  
  // Результаты тестов
  if (data.testResults) {
    rowData.push(
      calculateTestScore(data.testResults.test1),
      calculateTestScore(data.testResults.test2),
      calculateTestScore(data.testResults.test3),
      calculateTestScore(data.testResults.test4),
      calculateTestScore(data.testResults.test5),
      calculateTestScore(data.testResults.test6),
      calculateTestScore(data.testResults.test7)
    );
  } else if (data.test1) {
    // Если есть данные только теста 1
    rowData.push(calculateTestScore(data.test1), '', '', '', '', '', '');
  } else {
    // Если нет данных тестов, добавляем пустые значения
    rowData.push('', '', '', '', '', '', '');
  }
  
  // Общее время и email
  rowData.push(
    data.totalTime || '',
    data.email || '',
    true // Report Sent
  );
  
  // Добавление строки в таблицу
  sheet.appendRow(rowData);
}

// Сохранение в лист Raw Data
function saveToRawDataSheet(sheet, data) {
  // Подготовка данных для записи
  const rowData = [
    data.userId,
    new Date() // Timestamp
  ];
  
  // Данные профиля
  rowData.push(JSON.stringify(data.profile || {}));
  
  // Данные тестов
  if (data.testResults) {
    rowData.push(
      JSON.stringify(data.testResults.test1 || {}),
      JSON.stringify(data.testResults.test2 || {}),
      JSON.stringify(data.testResults.test3 || {}),
      JSON.stringify(data.testResults.test4 || {}),
      JSON.stringify(data.testResults.test5 || {}),
      JSON.stringify(data.testResults.test6 || {}),
      JSON.stringify(data.testResults.test7 || {})
    );
  } else if (data.test1) {
    // Если есть данные только теста 1
    rowData.push(
      JSON.stringify(data.test1 || {}),
      '{}',
      '{}',
      '{}',
      '{}',
      '{}',
      '{}'
    );
  } else {
    // Если нет данных тестов, добавляем пустые объекты
    rowData.push('{}', '{}', '{}', '{}', '{}', '{}', '{}');
  }
  
  // Добавление строки в таблицу
  sheet.appendRow(rowData);
}

// Расчет результата теста (заглушка - нужно реализовать в зависимости от логики тестов)
function calculateTestScore(testData) {
  if (!testData) return "";
  
  // Здесь должна быть логика расчета результата теста
  // Для примера просто возвращаем случайное число от 0 до 100
  return Math.floor(Math.random() * 101);
}

// Отправка email с результатами
function sendEmail(email, data) {
  const subject = "Результаты психологического тестирования";
  
  // Формирование HTML тела письма
  let htmlBody = "<h1>Результаты вашего тестирования</h1>";
  htmlBody += "<p>Спасибо за прохождение психологических тестов!</p>";
  
  if (data.profile) {
    htmlBody += "<h2>Ваш профиль:</h2>";
    htmlBody += "<ul>";
    htmlBody += `<li><strong>Имя:</strong> ${data.profile.name || ''}</li>`;
    htmlBody += `<li><strong>Пол:</strong> ${getGenderLabel(data.profile.gender)}</li>`;
    htmlBody += `<li><strong>Возраст:</strong> ${data.profile.age || ''}</li>`;
    htmlBody += `<li><strong>Образование:</strong> ${getEducationLabel(data.profile.education)}</li>`;
    htmlBody += `<li><strong>Семейное положение:</strong> ${getMaritalStatusLabel(data.profile.maritalStatus)}</li>`;
    htmlBody += `<li><strong>Дети:</strong> ${getChildrenLabel(data.profile.children)}</li>`;
    
    if (data.profile.hasChronicDiseases === "yes") {
      const diseases = [];
      if (data.profile.diseases.hypertension) diseases.push("Гипертония");
      if (data.profile.diseases.coronaryHeartDisease) diseases.push("Ишемическая болезнь сердца");
      if (data.profile.diseases.heartFailure) diseases.push("Сердечная недостаточность");
      if (data.profile.diseases.asthma) diseases.push("Бронхиальная астма");
      if (data.profile.diseases.chronicBronchitis) diseases.push("Хронический бронхит");
      if (data.profile.diseases.copd) diseases.push("ХОБЛ");
      if (data.profile.diseases.diabetesType1) diseases.push("Сахарный диабет 1 типа");
      if (data.profile.diseases.diabetesType2) diseases.push("Сахарный диабет 2 типа");
      if (data.profile.diseases.cancer) diseases.push("Онкологические заболевания");
      if (data.profile.diseases.hiv) diseases.push("ВИЧ/СПИД");
      
      if (data.profile.diseases.other) {
        diseases.push(data.profile.diseases.other);
      }
      
      htmlBody += `<li><strong>Хронические заболевания:</strong> ${diseases.join(", ")}</li>`;
    } else {
      htmlBody += `<li><strong>Хронические заболевания:</strong> Нет</li>`;
    }
    
    htmlBody += "</ul>";
  }
  
  if (data.testResults || data.test1) {
    htmlBody += "<h2>Результаты тестов:</h2>";
    htmlBody += "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
    htmlBody += "<tr><th>Тест</th><th>Результат</th></tr>";
    
    const testNames = {
      test1: "Определение типа личности",
      test2: "Оценка стрессоустойчивости",
      test3: "Эмоциональный интеллект",
      test4: "Коммуникативные навыки",
      test5: "Креативность",
      test6: "Лидерские качества",
      test7: "Ценности и приоритеты"
    };
    
    if (data.testResults) {
      for (const testKey in data.testResults) {
        const testName = testNames[testKey] || testKey;
        const score = calculateTestScore(data.testResults[testKey]);
        htmlBody += `<tr>
          <td>${testName}</td>
          <td>${score}</td>
        </tr>`;
      }
    } else if (data.test1) {
      htmlBody += `<tr>
        <td>${testNames.test1}</td>
        <td>${calculateTestScore(data.test1)}</td>
      </tr>`;
    }
    
    htmlBody += "</table>";
  }
  
  if (data.totalTime) {
    const minutes = Math.floor(data.totalTime / 60);
    const seconds = data.totalTime % 60;
    htmlBody += `<p>Общее время прохождения: ${minutes} мин ${seconds} сек</p>`;
  }
  
  htmlBody += "<p>Спасибо за участие в тестировании!</p>";
  
  // Отправка письма
  GmailApp.sendEmail(email, subject, "", {
    htmlBody: htmlBody
  });
}

// Вспомогательные функции для получения человекочитаемых значений
function getGenderLabel(gender) {
  if (!gender) return '';
  switch(gender) {
    case 'male': return 'Мужчина';
    case 'female': return 'Женщина';
    default: return gender;
  }
}

function getEducationLabel(education) {
  if (!education) return '';
  switch(education) {
    case 'basic': return 'Основное общее';
    case 'secondary': return 'Среднее общее';
    case 'vocational': return 'Среднее специальное';
    case 'incomplete_higher': return 'Незаконченное высшее';
    case 'higher': return 'Высшее';
    default: return education;
  }
}

function getMaritalStatusLabel(status) {
  if (!status) return '';
  switch(status) {
    case 'married': return 'В браке';
    case 'relationship': return 'В отношениях или в «гражданском браке»';
    case 'single': return 'Свободен(-на)';
    case 'widowed': return 'Вдовец(-ва)';
    default: return status;
  }
}

function getChildrenLabel(children) {
  if (!children) return '';
  switch(children) {
    case 'none': return 'Нет';
    case 'one': return 'Один ребенок';
    case 'two': return 'Два ребенка';
    case 'three_or_more': return 'Три и более детей';
    default: return children;
  }
}