# Руководство по развертыванию проекта "Психологические тесты"

## 1. Подготовка к развертыванию

### 1.1 Требования к системе
- Node.js 16.x или выше
- npm 7.x или выше
- Доступ к Google аккаунту для настройки Google Sheets и Apps Script

### 1.2 Подготовка проекта
1. Клонируйте репозиторий:
   ```
   git clone <url-репозитория>
   cd opros-v-3-0
   ```

2. Установите зависимости:
   ```
   npm install
   ```

3. Проверьте работоспособность проекта локально:
   ```
   npm start
   ```

4. Откройте браузер и перейдите по адресу http://localhost:3000 для проверки работы приложения.

## 2. Настройка Google Sheets и Apps Script

### 2.1 Создание Google таблицы
1. Откройте [Google Sheets](https://sheets.google.com/) и создайте новую таблицу.
2. Переименуйте таблицу, например, "Психологические тесты - Результаты".
3. Скопируйте ID таблицы из URL. URL имеет формат: `https://docs.google.com/spreadsheets/d/[ID_ТАБЛИЦЫ]/edit`.

### 2.2 Настройка Google Apps Script
1. В открытой таблице выберите меню "Расширения" > "Apps Script".
2. Переименуйте проект, например, "Психологические тесты - API".
3. Удалите весь код из файла `Code.gs`.
4. Скопируйте код из файла `google-apps-script/Code.gs` в редактор.
5. Замените значения констант в начале файла:
   ```javascript
   const API_KEY = "your_api_key"; // Замените на свой API ключ (придумайте сложный ключ)
   const SHEET_ID = "your_sheet_id"; // Замените на ID вашей Google таблицы
   ```

6. Сохраните проект (Ctrl+S или Cmd+S).

### 2.3 Публикация веб-приложения
1. Нажмите кнопку "Развертывание" > "Новое развертывание".
2. В поле "Выберите тип" выберите "Веб-приложение".
3. Заполните следующие поля:
   - Описание: "Психологические тесты API"
   - Выполнять от имени: "Я" (ваш аккаунт)
   - Кто имеет доступ: "Все, даже анонимные пользователи"
4. Нажмите "Развернуть".
5. Разрешите доступ к вашему аккаунту Google, если будет запрошено.
6. Скопируйте URL веб-приложения, который будет отображен после развертывания.

### 2.4 Настройка API в проекте
1. Откройте файл `src/utils/api.ts` в проекте.
2. Замените значения констант:
   ```typescript
   const API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Замените на URL вашего веб-приложения
   const API_KEY = 'your_api_key'; // Замените на тот же API ключ, что и в Apps Script
   ```

## 3. Сборка проекта для продакшена

### 3.1 Создание оптимизированной сборки
1. Выполните команду:
   ```
   npm run build
   ```

2. После успешной сборки в директории `build` будут находиться оптимизированные файлы для продакшена.

### 3.2 Тестирование продакшен-сборки
1. Для локального тестирования продакшен-сборки можно использовать:
   ```
   npx serve -s build
   ```

2. Откройте браузер и перейдите по адресу http://localhost:5000 для проверки работы приложения.

## 4. Варианты развертывания

### 4.1 Развертывание на Netlify
1. Зарегистрируйтесь на [Netlify](https://www.netlify.com/).
2. Создайте новый сайт, выбрав "Deploy manually".
3. Перетащите папку `build` в область загрузки на сайте Netlify.
4. После завершения загрузки ваш сайт будет доступен по URL, предоставленному Netlify.

### 4.2 Развертывание на Vercel
1. Установите Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Войдите в свой аккаунт:
   ```
   vercel login
   ```

3. Разверните проект:
   ```
   vercel --prod
   ```

4. Следуйте инструкциям в командной строке.

### 4.3 Развертывание на GitHub Pages
1. Установите gh-pages:
   ```
   npm install --save-dev gh-pages
   ```

2. Добавьте в `package.json` следующие строки:
   ```json
   "homepage": "https://yourusername.github.io/opros-v-3-0",
   "scripts": {
     // другие скрипты
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Разверните проект:
   ```
   npm run deploy
   ```

## 5. Настройка CORS для Google Apps Script

Если вы столкнулись с проблемами CORS при отправке данных, выполните следующие действия:

1. Откройте проект Google Apps Script.
2. Добавьте следующий код в начало функции `doPost`:
   ```javascript
   function doPost(e) {
     // Настройка CORS
     var headers = {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
       'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
     };
     
     // Обработка preflight запросов
     if (e.method === 'OPTIONS') {
       return ContentService.createTextOutput('')
         .setMimeType(ContentService.MimeType.TEXT)
         .setHeaders(headers);
     }
     
     // Остальной код функции...
   ```

3. Также добавьте заголовки в ответ функции `createResponse`:
   ```javascript
   function createResponse(success, message, errorCode, statusCode, additionalData = {}) {
     // ... существующий код ...
     
     return ContentService.createTextOutput(JSON.stringify(response))
       .setMimeType(ContentService.MimeType.JSON)
       .setStatusCode(statusCode)
       .setHeaders({
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
         'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
       });
   }
   ```

4. Сохраните и опубликуйте новую версию веб-приложения.

## 6. Проверка и мониторинг

### 6.1 Проверка работоспособности
1. Откройте развернутое приложение в браузере.
2. Пройдите полный цикл тестирования от начала до конца.
3. Проверьте, что данные корректно сохраняются в Google Sheets.
4. Проверьте, что email с результатами отправляется на указанный адрес.

### 6.2 Настройка мониторинга
1. Добавьте Google Analytics для отслеживания посещений:
   - Зарегистрируйтесь в [Google Analytics](https://analytics.google.com/).
   - Создайте новый аккаунт и получите код отслеживания.
   - Добавьте код в файл `public/index.html` перед закрывающим тегом `</head>`.

2. Настройте логирование ошибок с помощью Sentry:
   - Зарегистрируйтесь в [Sentry](https://sentry.io/).
   - Создайте новый проект и получите DSN.
   - Установите Sentry: `npm install @sentry/react @sentry/tracing`.
   - Настройте Sentry в файле `src/index.tsx`.

## 7. Обслуживание и обновление

### 7.1 Резервное копирование данных
1. Регулярно экспортируйте данные из Google Sheets в формате CSV или Excel.
2. Храните резервные копии в безопасном месте.

### 7.2 Обновление приложения
1. Внесите необходимые изменения в код.
2. Протестируйте изменения локально.
3. Соберите новую версию: `npm run build`.
4. Разверните новую версию, используя выбранный метод развертывания.

### 7.3 Обновление Google Apps Script
1. Внесите необходимые изменения в код Google Apps Script.
2. Сохраните изменения.
3. Опубликуйте новую версию веб-приложения.
4. Обновите URL в файле `src/utils/api.ts`, если он изменился.
