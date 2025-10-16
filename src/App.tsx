import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import ProfileForm from './components/pages/ProfileForm';
import Test1Task1 from './components/pages/Test1Task1';
import Test1Task2 from './components/pages/Test1Task2';
import Test1Task3 from './components/pages/Test1Task3';
import Test2Task1 from './components/pages/Test2Task1';
import Test2Task2 from './components/pages/Test2Task2';
import Test3Task from './components/pages/Test3Task';
import Test4Task from './components/pages/Test4Task';
import Test5Page from './components/pages/Test5Page';
import Test6Task1 from './components/pages/Test6Task1';
import Test6Task2 from './components/pages/Test6Task2';
import Test7Page1 from './components/pages/Test7Page1';
import Test7Page2 from './components/pages/Test7Page2';
import Test7Page3 from './components/pages/Test7Page3';
import Test7Page4 from './components/pages/Test7Page4';
import Test7Page5 from './components/pages/Test7Page5';
import TestContainer from './components/tests/TestContainer';
import ThankYouPage from './components/pages/ThankYouPage';
import SessionManager from './components/SessionManager';
import ScrollToTop from './components/ScrollToTop';
import { clearTestData } from './utils/clearTestData';
import './App.css';

function App() {
  // Очищаем данные тестов только при закрытии браузера
  useEffect(() => {
    // Добавляем обработчик события beforeunload для очистки данных тестов
    const handleBeforeUnload = () => {
      clearTestData();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Provider store={store}>
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <SessionManager>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfileForm />} />
              <Route path="/test1/task1" element={<Test1Task1 />} />
              <Route path="/test1/task2" element={<Test1Task2 />} />
              <Route path="/test1/task3" element={<Test1Task3 />} />
              <Route path="/test-intro/test1" element={<Test1Task1 />} />
              <Route path="/test-intro/test2" element={<Test2Task1 />} />
              <Route path="/test2/task1" element={<Test2Task1 />} />
              <Route path="/test2/task2" element={<Test2Task2 />} />
              <Route path="/test-intro/test3" element={<Test3Task />} />
              <Route path="/test3" element={<Test3Task />} />
              <Route path="/test-intro/test4" element={<Test4Task />} />
              <Route path="/test4" element={<Test4Task />} />
              <Route path="/test-intro/test5" element={<Test5Page />} />
              <Route path="/test5" element={<Test5Page />} />
              <Route path="/test5/page/:pageNumber" element={<Test5Page />} />
              <Route path="/test-intro/test6" element={<Test6Task1 />} />
              <Route path="/test6/task1" element={<Test6Task1 />} />
              <Route path="/test6/task2" element={<Test6Task2 />} />
              <Route path="/test-intro/test7" element={<Test7Page1 />} />
              <Route path="/test7/page1" element={<Test7Page1 />} />
              <Route path="/test7/page2" element={<Test7Page2 />} />
              <Route path="/test7/page3" element={<Test7Page3 />} />
              <Route path="/test7/page4" element={<Test7Page4 />} />
              <Route path="/test7/page5" element={<Test7Page5 />} />
              <Route path="/test/:testId" element={<TestContainer />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
          </Layout>
        </SessionManager>
      </Router>
    </Provider>
  );
}

export default App;