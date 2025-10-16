import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateProfile } from '../../store/slices/profileSlice';
import { updateProgress } from '../../store/slices/sessionSlice';
import { RootState } from '../../store';
import { ProfileData } from '../../types';
import CustomButton from '../common/CustomButton';
import CustomFormInput from '../common/CustomFormInput';
import CustomRadioGroup from '../common/CustomRadioGroup';
import CustomTooltip from '../common/CustomTooltip';
import { submitAllData } from '../../utils/api';
import { saveProfile, generateUniqueUserId } from '../../utils/storage';
import CustomCheckboxGroup from '../common/CustomCheckboxGroup';
import Snackbar from '../common/Snackbar';
import { theme } from '../../theme/theme';
import { TextNormalSemibold } from '../common/Typography';

// ========================================
// УТИЛИТЫ
// ========================================

// Хук для определения размера экрана
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Синхронная инициализация для правильного определения мобильной версии
    if (typeof window !== 'undefined') {
      return window.innerWidth <= parseInt(theme.breakpoints.desktop);
    }
    return false;
  });

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= parseInt(theme.breakpoints.desktop));
    };

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// ========================================
// СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ
// ========================================

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  width: 100% !important;
  max-width: none !important;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: ${theme.typography.header.fontSize};
  font-weight: ${theme.typography.header.fontWeight};
  line-height: ${theme.typography.header.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0 0 12px 0;
`;

const IntroText = styled.p`
  font-size: ${theme.typography.textNormalBold.fontSize};
  font-weight: ${theme.typography.textNormalBold.fontWeight};
  line-height: ${theme.typography.textNormalBold.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0 0 4px 0;
`;

const DescriptionText = styled.p`
  font-size: ${theme.typography.textNormal.fontSize};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0 0 12px 0;
`;

const InfoBox = styled.div`
  background-color: ${theme.colors.background.warningLight};
  border: 1px solid ${theme.colors.background.warning};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 8px;
  }
`;

const WarningIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  path {
    fill: ${theme.colors.background.warning};
  }
`;

const InfoContent = styled.div`
  flex: 1;
  text-align: left;
`;

const InfoText = styled.p`
  font-size: ${theme.typography.textNormal.fontSize};
  font-weight: ${theme.typography.textNormal.fontWeight};
  line-height: ${theme.typography.textNormal.lineHeight};
  color: ${theme.colors.typography.primary};
  margin: 0;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled(TextNormalSemibold)`
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: auto;
`;

// Стили для секций с инпутами (пункты 1, 3)
const InputSection = styled.div`
  margin-bottom: 24px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const InputSectionTitle = styled(TextNormalSemibold)`
  margin-bottom: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const InputWrapper = styled.div`
  width: 50%;
  min-width: 50%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    width: 100%;
    min-width: 100%;
  }
`;

// Стили для секций с радиокнопками (пункты 2, 4-7, 9)
const RadioSection = styled.div`
  margin-bottom: 24px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const RadioSectionTitle = styled(TextNormalSemibold)`
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: auto;
`;

const RadioGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    justify-content: flex-start;
    gap: 8px;
    
    button {
      width: 100%;
    }
  }
`;

const FormErrorContainer = styled.div`
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  color: #c33;
`;

const DiseasesContainer = styled.div`
  margin-top: 4px;
`;

const InputFieldTitle = styled(TextNormalSemibold)`
  color: ${theme.colors.typography.secondary};
  margin: 0 0 8px 0;
`;

const OtherDiseaseContainer = styled.div`
  margin-top: 8px;
`;



const TitleWithTooltip = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 100%;
  margin-bottom: 8px; /* Переносим margin с заголовка сюда */
  flex-shrink: 0;
  
  /* Обеспечиваем точное выравнивание по центру */
  & > * {
    display: flex;
    align-items: center;
  }
`;

const TooltipContainer = styled.div`
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  z-index: 10;
  pointer-events: none;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    top: 0;
    left: 0;
    right: 0;
    transform: none;
    display: flex;
    justify-content: center;
  }
`;

const TitleText = styled.span`
  position: relative;
  display: inline-block;
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    display: block;
    width: 100%;
  }
`;

// ========================================
// КОНСТАНТЫ И ТИПЫ
// ========================================

const FORM_FIELDS = {
  name: { required: true, type: 'text' },
  gender: { required: true, type: 'radio' },
  age: { required: true, type: 'number' },
  education: { required: true, type: 'radio' },
  maritalStatus: { required: true, type: 'radio' },
  children: { required: true, type: 'radio' },
  hasChronicDiseases: { required: true, type: 'radio' },
  diseases: { required: false, type: 'checkbox' },
  takesMedications: { required: true, type: 'radio' },
  medications: { required: false, type: 'checkbox' }
} as const;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Мужчина' },
  { value: 'female', label: 'Женщина' }
];

const EDUCATION_OPTIONS = [
  { value: 'basic', label: 'Основное общее' },
  { value: 'secondary', label: 'Среднее общее' },
  { value: 'specialized_secondary', label: 'Среднее специальное' },
  { value: 'incomplete_higher', label: 'Незаконченное высшее' },
  { value: 'higher', label: 'Высшее' }
];

const MARITAL_STATUS_OPTIONS = [
  { value: 'married', label: 'В браке' },
  { value: 'relationship', label: 'В отношениях или в «гражданском браке»' },
  { value: 'single', label: 'Свободен(-на)' },
  { value: 'widowed', label: 'Вдовец(-ва)' }
];

const CHILDREN_OPTIONS = [
  { value: 'no', label: 'Нет' },
  { value: 'one', label: 'Один ребенок' },
  { value: 'two', label: 'Два ребенка' },
  { value: 'three_or_more', label: 'Три и более детей' }
];

const YES_NO_OPTIONS = [
  { value: 'Да', label: 'Да' },
  { value: 'Нет', label: 'Нет' }
];

const DISEASE_OPTIONS = [
  { value: 'hypertension', label: 'Гипертония' },
  { value: 'coronaryHeartDisease', label: 'Ишемическая болезнь сердца' },
  { value: 'heartFailure', label: 'Сердечная недостаточность' },
  { value: 'asthma', label: 'Бронхиальная астма' },
  { value: 'chronicBronchitis', label: 'Хронический бронхит' },
  { value: 'copd', label: 'Хроническая обструктивная болезнь легких (ХОБЛ)' },
  { value: 'diabetesType1', label: 'Сахарный диабет 1 типа' },
  { value: 'diabetesType2', label: 'Сахарный диабет 2 типа' },
  { value: 'cancer', label: 'Онкологические заболевания' },
  { value: 'hiv', label: 'ВИЧ/СПИД' },
  { value: 'hypothyroidism', label: 'Гипотиреоз' },
  { value: 'recurrentDepression', label: 'Реккурентная депрессия' },
  { value: 'generalizedAnxietyDisorder', label: 'Генерализованное тревожное расстройство (ГТР)' },
  { value: 'bipolarAffectiveDisorder', label: 'Биполярное аффективное расстройство (БАР)' }
];

const MEDICATION_OPTIONS = [
  { value: 'oralContraceptives', label: 'Оральные контрацептивы' },
  { value: 'vitaminD', label: 'Витамин D' },
  { value: 'ironSupplements', label: 'Препараты железа' },
  { value: 'thyroidHormones', label: 'Гормоны щитовидной железы (левокситироксин натрия)' },
  { value: 'iodineOrThyrostatics', label: 'Йодосодержащие препараты или тиреостатики (таимазол, пропилтиоурацил)' },
  { value: 'statins', label: 'Статины' },
  { value: 'antidepressants', label: 'Антидепрессанты' },
  { value: 'insulin', label: 'Инсулин' },
  { value: 'herbalTinctures', label: 'Настойки или отвары' }
];


// ========================================
// ОСНОВНОЙ КОМПОНЕНТ
// ========================================

const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storedProfile = useAppSelector((state: RootState) => state.profile);
  const isMobile = useIsMobile();
  
  // ========================================
  // СОСТОЯНИЕ КОМПОНЕНТА
  // ========================================
  
  const [formData, setFormData] = useState<ProfileData>(() => ({
    name: storedProfile.name || '',
    gender: storedProfile.gender || '',
    age: storedProfile.age || 0,
    education: storedProfile.education || '',
    maritalStatus: storedProfile.maritalStatus || '',
    children: storedProfile.children || '',
    hasChronicDiseases: storedProfile.hasChronicDiseases || '',
    diseases: {
      hypertension: storedProfile.diseases?.hypertension || false,
      coronaryHeartDisease: storedProfile.diseases?.coronaryHeartDisease || false,
      heartFailure: storedProfile.diseases?.heartFailure || false,
      asthma: storedProfile.diseases?.asthma || false,
      chronicBronchitis: storedProfile.diseases?.chronicBronchitis || false,
      copd: storedProfile.diseases?.copd || false,
      diabetesType1: storedProfile.diseases?.diabetesType1 || false,
      diabetesType2: storedProfile.diseases?.diabetesType2 || false,
      cancer: storedProfile.diseases?.cancer || false,
      hiv: storedProfile.diseases?.hiv || false,
      hypothyroidism: storedProfile.diseases?.hypothyroidism || false,
      recurrentDepression: storedProfile.diseases?.recurrentDepression || false,
      generalizedAnxietyDisorder: storedProfile.diseases?.generalizedAnxietyDisorder || false,
      bipolarAffectiveDisorder: storedProfile.diseases?.bipolarAffectiveDisorder || false,
      other: storedProfile.diseases?.other || ''
    },
    takesMedications: storedProfile.takesMedications || '',
    medications: {
      oralContraceptives: false,
      vitaminD: false,
      ironSupplements: false,
      thyroidHormones: false,
      iodineOrThyrostatics: false,
      statins: false,
      antidepressants: false,
      insulin: false,
      herbalTinctures: false,
      other: ''
    }
  }));
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>('');
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });

  // ========================================
  // ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ
  // ========================================
  
  const showDiseasesSection = useMemo(() => 
    formData.hasChronicDiseases === 'Да', 
    [formData.hasChronicDiseases]
  );
  
  const showMedicationsSection = useMemo(() => 
    formData.takesMedications === 'Да', 
    [formData.takesMedications]
  );
  
  // Динамические номера вопросов
  const questionNumbers = useMemo(() => {
    const baseQuestions = 7; // Вопросы 1-7 всегда отображаются
    const diseasesQuestion = showDiseasesSection ? 1 : 0; // Вопрос 8 (заболевания)
    
    return {
      diseases: baseQuestions + 1, // 8 или не отображается
      medications: baseQuestions + diseasesQuestion + 1, // 8 или 9
      medicationsList: baseQuestions + diseasesQuestion + 2 // 9 или 10
    };
  }, [showDiseasesSection]);
  

  // ========================================
  // ОБРАБОТЧИКИ СОБЫТИЙ
  // ========================================
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    console.log(`Поле ${name} изменено на: ${value}`);
    
    if (name === 'age') {
      const numValue = value ? parseInt(value, 10) : 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Новый обработчик для CustomFormInput
  const handleCustomInputChange = useCallback((name: string, value: string) => {
    console.log(`Поле ${name} изменено на: ${value}`);
    
    let filteredValue = value;
    
    // Фильтрация для поля имени - только буквы, пробелы и дефис
    if (name === 'name') {
      filteredValue = value.replace(/[^а-яёА-ЯЁa-zA-Z\s-]/g, '');
    }
    
    if (name === 'age') {
      const numValue = filteredValue ? parseInt(filteredValue, 10) : 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  const handleRadioChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  
  const handleOtherDiseaseChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      diseases: {
        ...prev.diseases,
        other: e.target.value
      }
    }));
  }, []);

  // Новый обработчик для CustomFormInput - другие заболевания
  const handleCustomOtherDiseaseChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      diseases: {
        ...prev.diseases,
        other: value
      }
    }));
    
    // Очистка ошибки при изменении поля
    if (errors.diseases) {
      setErrors(prev => ({ ...prev, diseases: '' }));
    }
  }, [errors]);
  
  
  const handleOtherMedicationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      medications: {
        ...prev.medications,
        other: e.target.value
      }
    }));
  }, []);

  // Новый обработчик для CustomFormInput - другие лекарства
  const handleCustomOtherMedicationChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      medications: {
        ...prev.medications,
        other: value
      }
    }));
    
    // Очистка ошибки при изменении поля
    if (errors.medications) {
      setErrors(prev => ({ ...prev, medications: '' }));
    }
  }, [errors]);
  

  // ========================================
  // ВАЛИДАЦИЯ
  // ========================================
  
  const validateForm = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const newErrors: Record<string, string> = {};
    
    // Проверка обязательных полей
    Object.entries(FORM_FIELDS).forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig.required) {
        const value = formData[fieldName as keyof ProfileData];
        
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[fieldName] = 'Это обязательное поле для заполнения';
        }
      }
    });
    
    // Специальная валидация для заболеваний
    if (formData.hasChronicDiseases === 'Да') {
      const hasAnyDisease = Object.values(formData.diseases).some(value => 
        typeof value === 'boolean' ? value : value.trim() !== ''
      );
      
      if (!hasAnyDisease) {
        newErrors.diseases = 'Выберите или введите заболевание';
      }
    }
    
    // Специальная валидация для лекарств
    if (formData.takesMedications === 'Да') {
      const hasAnyMedication = Object.values(formData.medications).some(value => 
        typeof value === 'boolean' ? value : value.trim() !== ''
      );
      
      if (!hasAnyMedication) {
        newErrors.medications = 'Выберите или введите лекарство';
      }
    }
    
    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  }, [formData]);

  // Функция для прокрутки к первой ошибке
  const scrollToFirstError = useCallback((errorFields: Record<string, string>) => {
    const errorFieldNames = Object.keys(errorFields).filter(field => errorFields[field]);
    if (errorFieldNames.length === 0) return;

    console.log('ProfileForm scrollToFirstError called, errorFields:', errorFieldNames);
    console.log('ProfileForm isMobile:', isMobile, 'window width:', window.innerWidth);

    // Порядок полей для прокрутки
    const fieldOrder = ['name', 'gender', 'age', 'education', 'maritalStatus', 'children', 'hasChronicDiseases', 'diseases', 'takesMedications', 'medications'];
    const firstErrorField = fieldOrder.find(field => errorFieldNames.includes(field));
    
    console.log('ProfileForm firstErrorField:', firstErrorField);
    
    if (firstErrorField) {
      // Якорный скролл до ошибки
      const windowWidth = window.innerWidth;
      const isMobileScreen = windowWidth <= 900;
      
      // Для полей ввода ищем input
      if (firstErrorField === 'name' || firstErrorField === 'age') {
        const input = document.querySelector(`input[name="${firstErrorField}"]`);
        if (input) {
          if (isMobileScreen) {
            // Для мобильной версии - якорный скролл
            const elementTop = (input as HTMLElement).offsetTop;
            const scrollPosition = elementTop - 20;
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          } else {
            // Для десктопной версии - центрирование
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
      }
      
      // Для остальных полей ищем заголовок секции по номеру вопроса
      const questionNumbers: Record<string, string> = {
        'gender': '2. Пол',
        'education': '4. Ваш уровень образования',
        'maritalStatus': '5. Семейное положение',
        'children': '6. Есть ли у вас дети?',
        'hasChronicDiseases': '7. Есть ли у вас хронические заболевания?',
        'diseases': 'заболевание', // Ищем по части текста
        'takesMedications': 'лекарства', // Ищем по части текста
        'medications': 'препараты' // Ищем по части текста
      };
      
      const questionText = questionNumbers[firstErrorField];
      if (questionText) {
        // Сначала ищем по h3 заголовкам
        const allH3 = document.querySelectorAll('h3');
        let sectionTitle = null;
        for (let i = 0; i < allH3.length; i++) {
          const h3 = allH3[i];
          if (h3.textContent?.includes(questionText)) {
            sectionTitle = h3;
            break;
          }
        }
        
        if (sectionTitle) {
          if (isMobileScreen) {
            // Для мобильной версии - якорный скролл
            const elementTop = sectionTitle.offsetTop;
            const scrollPosition = elementTop - 20;
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
          } else {
            // Для десктопной версии - центрирование
            sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
        
        // Если не нашли по h3, ищем по всем элементам с текстом
        const allElements = document.querySelectorAll('*');
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i];
          if (element.textContent?.includes(questionText) && 
              (element.tagName === 'H3' || element.tagName === 'H4' || element.tagName === 'DIV')) {
            if (isMobileScreen) {
              // Для мобильной версии - якорный скролл
              const elementTop = (element as HTMLElement).offsetTop;
              const scrollPosition = elementTop - 20;
              window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            } else {
              // Для десктопной версии - центрирование
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
          }
        }
      }
      // Fallback - прокрутка к началу формы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isMobile]);

  // ========================================
  // ОБРАБОТЧИКИ ДЕЙСТВИЙ
  // ========================================
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ProfileForm handleSubmit called');
    const validation = validateForm();
    console.log('ProfileForm validation result:', validation);
    
    if (!validation.isValid) {
      console.log('ProfileForm form is invalid, showing errors and scrolling');
      setShowErrors(true);
      // Прокрутка к первой ошибке с небольшой задержкой
      setTimeout(() => {
        console.log('ProfileForm calling scrollToFirstError after timeout');
        scrollToFirstError(validation.errors);
      }, 100);
      return;
    }
    
    try {
      // Сохранение в Redux
      dispatch(updateProfile(formData));
      
      // Сохранение в localStorage
      saveProfile(formData);
      
      // Генерируем userId если его нет
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = generateUniqueUserId();
        localStorage.setItem('userId', userId);
      }
      
      // Обновление прогресса
      dispatch(updateProgress({ key: 'profile', value: true }));
      
      // Переход к следующему этапу
      navigate('/test1/task1');
      
    } catch (error) {
      console.error('Ошибка при сохранении данных профиля:', error);
      setFormError('Произошла ошибка при сохранении данных. Попробуйте еще раз.');
    }
  }, [formData, validateForm, dispatch, navigate, scrollToFirstError]);
  

  // ========================================
  // РЕНДЕР
  // ========================================
  
  return (
    <FormContainer style={{ width: '100%', maxWidth: 'none' }}>
      <Title>Анкета</Title>
      
      <IntroText>Заполните информацию о себе</IntroText>
      <DescriptionText>
        Все полученные результаты будут использованы исключительно в обобщённом виде, а вся собранная в ходе исследования информация и ваши ответы на вопросы анкеты не будут доступны никому, кроме психологов исследовательской группы.
      </DescriptionText>
      
      <InfoBox>
        <WarningIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9902 1.98608C12.5209 1.98608 13.0425 2.12711 13.501 2.39429C13.9583 2.66084 14.3371 3.04349 14.5986 3.50366L22.5967 17.4998L22.6895 17.6736C22.8922 18.085 22.9979 18.5384 22.9981 18.9988C22.9982 19.5251 22.8606 20.0428 22.5977 20.4988C22.3347 20.9547 21.9556 21.3329 21.5 21.5964C21.0444 21.8599 20.5273 21.9992 20.001 21.9998H4.00001C3.47436 22.0028 2.9571 21.868 2.50001 21.6082C2.04019 21.3468 1.65714 20.9683 1.39063 20.5115C1.12426 20.0547 0.9836 19.5354 0.982429 19.0066C0.981281 18.4791 1.11967 17.9608 1.38282 17.5037L9.38184 3.50366C9.64344 3.04334 10.023 2.66087 10.4805 2.39429C10.9389 2.12722 11.4597 1.98612 11.9902 1.98608ZM11.9902 3.98608C11.8136 3.98612 11.64 4.03294 11.4873 4.12183C11.3345 4.21089 11.2073 4.33902 11.1201 4.49292L11.1191 4.49585L3.11915 18.4958L3.11622 18.4998C3.02806 18.6524 2.98204 18.8264 2.98243 19.0027C2.98289 19.1787 3.02956 19.3516 3.11817 19.5037C3.207 19.6559 3.33501 19.7827 3.48829 19.8699C3.64145 19.9569 3.81507 20.0013 3.99122 19.9998H19.999C20.1744 19.9996 20.3472 19.9537 20.499 19.866C20.6508 19.7782 20.7766 19.6516 20.8643 19.4998C20.9519 19.3478 20.9981 19.1752 20.9981 18.9998C20.998 18.8243 20.952 18.6517 20.8643 18.4998L20.8623 18.4958L12.8623 4.49585L12.8604 4.49292C12.7732 4.3391 12.6469 4.21086 12.4941 4.12183C12.3413 4.03277 12.1671 3.98608 11.9902 3.98608Z" fill="black"/>
            <path d="M11.0004 13V8.99998C11.0004 8.4477 11.4481 7.99998 12.0004 7.99998C12.5527 7.99998 13.0004 8.4477 13.0004 8.99998V13C13.0004 13.5523 12.5527 14 12.0004 14C11.4481 14 11.0004 13.5523 11.0004 13Z" fill="black"/>
            <path d="M12.0102 16C12.5625 16 13.0102 16.4477 13.0102 17C13.0102 17.5523 12.5625 18 12.0102 18H12.0004C11.4481 18 11.0004 17.5523 11.0004 17C11.0004 16.4477 11.4481 16 12.0004 16H12.0102Z" fill="black"/>
          </svg>
        </WarningIcon>
        <InfoContent>
          <InfoText>
            Ваши персональные данные необходимы исключительно для идентификации результатов, если вам потребуется обратная связь.
          </InfoText>
        </InfoContent>
      </InfoBox>
      
      {formError && (
        <FormErrorContainer>
          {formError}
        </FormErrorContainer>
      )}
      
      <form onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%', maxWidth: 'none' }}>
        {/* 1. Имя */}
        <InputSection>
          <InputSectionTitle>1. Имя</InputSectionTitle>
          <InputWrapper>
            <CustomFormInput
              name="name"
              value={formData.name}
              onChange={(value) => handleCustomInputChange('name', value)}
              placeholder="Введите ваше имя"
              showRightText={false}
              fullWidth={true}
              error={showErrors ? errors.name : undefined}
              showError={showErrors && !!errors.name}
            />
            {showErrors && errors.name && (
              <TooltipContainer>
                <CustomTooltip content={errors.name} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                  <div style={{ width: '1px', height: '1px' }} />
                </CustomTooltip>
              </TooltipContainer>
            )}
          </InputWrapper>
        </InputSection>
        
        {/* 2. Пол */}
        <RadioSection>
          <TitleWithTooltip>
            <TitleText>
              <RadioSectionTitle>2. Пол</RadioSectionTitle>
              {showErrors && errors.gender && (
                <TooltipContainer>
                  <CustomTooltip content={errors.gender} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                    <div style={{ width: '1px', height: '1px' }} />
                  </CustomTooltip>
                </TooltipContainer>
              )}
            </TitleText>
          </TitleWithTooltip>
          <RadioGroupWrapper>
            <CustomRadioGroup
              name="gender"
              value={formData.gender}
              options={GENDER_OPTIONS}
              onChange={(value) => handleRadioChange('gender', value)}
            />
          </RadioGroupWrapper>
        </RadioSection>
        
        {/* 3. Возраст */}
        <InputSection>
          <InputSectionTitle>3. Возраст</InputSectionTitle>
          <InputWrapper>
            <CustomFormInput
              name="age"
              value={formData.age || ''}
              onChange={(value) => handleCustomInputChange('age', value)}
              placeholder="Введите ваш возраст"
              showRightText={true}
              rightText="лет"
              fullWidth={true}
              error={showErrors ? errors.age : undefined}
              showError={showErrors && !!errors.age}
            />
            {showErrors && errors.age && (
              <TooltipContainer>
                <CustomTooltip content={errors.age} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                  <div style={{ width: '1px', height: '1px' }} />
                </CustomTooltip>
              </TooltipContainer>
            )}
          </InputWrapper>
        </InputSection>
        
        {/* 4. Ваш уровень образования */}
        <RadioSection>
          <TitleWithTooltip>
            <TitleText>
              <RadioSectionTitle>4. Ваш уровень образования</RadioSectionTitle>
              {showErrors && errors.education && (
                <TooltipContainer>
                  <CustomTooltip content={errors.education} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                    <div style={{ width: '1px', height: '1px' }} />
                  </CustomTooltip>
                </TooltipContainer>
              )}
            </TitleText>
          </TitleWithTooltip>
          <RadioGroupWrapper>
            <CustomRadioGroup
              name="education"
              value={formData.education}
              options={EDUCATION_OPTIONS}
              onChange={(value) => handleRadioChange('education', value)}
            />
          </RadioGroupWrapper>
        </RadioSection>
        
        {/* 5. Семейное положение */}
        <RadioSection>
          <TitleWithTooltip>
            <TitleText>
              <RadioSectionTitle>5. Семейное положение</RadioSectionTitle>
              {showErrors && errors.maritalStatus && (
                <TooltipContainer>
                  <CustomTooltip content={errors.maritalStatus} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                    <div style={{ width: '1px', height: '1px' }} />
                  </CustomTooltip>
                </TooltipContainer>
              )}
            </TitleText>
          </TitleWithTooltip>
          <RadioGroupWrapper>
            <CustomRadioGroup
              name="maritalStatus"
              value={formData.maritalStatus}
              options={MARITAL_STATUS_OPTIONS}
              onChange={(value) => handleRadioChange('maritalStatus', value)}
            />
          </RadioGroupWrapper>
        </RadioSection>
        
        {/* 6. Есть ли у вас дети? */}
        <RadioSection>
          <TitleWithTooltip>
            <TitleText>
              <RadioSectionTitle>6. Есть ли у вас дети?</RadioSectionTitle>
              {showErrors && errors.children && (
                <TooltipContainer>
                  <CustomTooltip content={errors.children} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                    <div style={{ width: '1px', height: '1px' }} />
                  </CustomTooltip>
                </TooltipContainer>
              )}
            </TitleText>
          </TitleWithTooltip>
          <RadioGroupWrapper>
            <CustomRadioGroup
              name="children"
              value={formData.children}
              options={CHILDREN_OPTIONS}
              onChange={(value) => handleRadioChange('children', value)}
            />
          </RadioGroupWrapper>
        </RadioSection>
        
        {/* 7. Есть ли у вас хронические заболевания? */}
        <RadioSection>
          <TitleWithTooltip>
            <TitleText>
              <RadioSectionTitle>7. Есть ли у вас хронические заболевания?</RadioSectionTitle>
              {showErrors && errors.hasChronicDiseases && (
                <TooltipContainer>
                  <CustomTooltip content={errors.hasChronicDiseases} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                    <div style={{ width: '1px', height: '1px' }} />
                  </CustomTooltip>
                </TooltipContainer>
              )}
            </TitleText>
          </TitleWithTooltip>
          <RadioGroupWrapper>
            <CustomRadioGroup
              name="hasChronicDiseases"
              value={formData.hasChronicDiseases}
              options={YES_NO_OPTIONS}
              onChange={(value) => handleRadioChange('hasChronicDiseases', value)}
            />
          </RadioGroupWrapper>
        </RadioSection>
        
        {/* 8. Укажите ваше заболевание */}
        {showDiseasesSection && (
          <FormSection>
            <TitleWithTooltip>
              <TitleText>
                <SectionTitle>{questionNumbers.diseases}. Укажите ваше заболевание</SectionTitle>
                {showErrors && errors.diseases && (
                  <TooltipContainer>
                    <CustomTooltip content={errors.diseases} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                      <div style={{ width: '1px', height: '1px' }} />
                    </CustomTooltip>
                  </TooltipContainer>
                )}
              </TitleText>
            </TitleWithTooltip>
            <DiseasesContainer>
              <CustomCheckboxGroup
                name="diseases"
                options={DISEASE_OPTIONS}
                values={Object.entries(formData.diseases)
                  .filter(([_, value]) => value === true)
                  .map(([key, _]) => key)
                }
                onChange={(values) => {
                  const newDiseases = { ...formData.diseases };
                  Object.keys(newDiseases).forEach(key => {
                    if (key === 'other') {
                      // Сохраняем текущее значение поля other
                      (newDiseases as any)[key] = formData.diseases.other;
                    } else {
                      (newDiseases as any)[key] = values.includes(key);
                    }
                  });
                  setFormData(prev => ({ ...prev, diseases: newDiseases }));
                  
                  // Очистка ошибки при изменении чекбоксов
                  if (errors.diseases) {
                    setErrors(prev => ({ ...prev, diseases: '' }));
                  }
                }}
              />
              
              <OtherDiseaseContainer>
                <InputFieldTitle>Другое заболевание</InputFieldTitle>
                <CustomFormInput
                  name="otherDisease"
                  value={formData.diseases.other}
                  onChange={handleCustomOtherDiseaseChange}
                  placeholder="Введите ваше заболевание"
                  showRightText={false}
                  fullWidth={true}
                />
              </OtherDiseaseContainer>
            </DiseasesContainer>
          </FormSection>
        )}
        
        {/* 9. Принимаете ли вы лекарства? */}
        <RadioSection>
          <TitleWithTooltip>
            <TitleText>
              <RadioSectionTitle>{questionNumbers.medications}. Принимаете ли вы какие-либо лекарства, БАДы и/или витамины на постоянной основе?</RadioSectionTitle>
              {showErrors && errors.takesMedications && (
                <TooltipContainer>
                  <CustomTooltip content={errors.takesMedications} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                    <div style={{ width: '1px', height: '1px' }} />
                  </CustomTooltip>
                </TooltipContainer>
              )}
            </TitleText>
          </TitleWithTooltip>
          <RadioGroupWrapper>
            <CustomRadioGroup
              name="takesMedications"
              value={formData.takesMedications}
              options={YES_NO_OPTIONS}
              onChange={(value) => handleRadioChange('takesMedications', value)}
            />
          </RadioGroupWrapper>
        </RadioSection>
        
        {/* 10. Укажите принимаемые лекарства */}
        {showMedicationsSection && (
          <FormSection>
            <TitleWithTooltip>
              <TitleText>
                <SectionTitle>{questionNumbers.medicationsList}. Укажите препараты, которые вы принимаете</SectionTitle>
                {showErrors && errors.medications && (
                  <TooltipContainer>
                    <CustomTooltip content={errors.medications} type="error" position={isMobile ? "bottom" : "left"} forceVisible={true}>
                      <div style={{ width: '1px', height: '1px' }} />
                    </CustomTooltip>
                  </TooltipContainer>
                )}
              </TitleText>
            </TitleWithTooltip>
            <DiseasesContainer>
              <CustomCheckboxGroup
                name="medications"
                options={MEDICATION_OPTIONS}
                values={Object.entries(formData.medications)
                  .filter(([_, value]) => value === true)
                  .map(([key, _]) => key)
                }
                onChange={(values) => {
                  const newMedications = { ...formData.medications };
                  Object.keys(newMedications).forEach(key => {
                    if (key === 'other') {
                      // Сохраняем текущее значение поля other
                      (newMedications as any)[key] = formData.medications.other;
                    } else {
                      (newMedications as any)[key] = values.includes(key);
                    }
                  });
                  setFormData(prev => ({ ...prev, medications: newMedications }));
                  
                  // Очистка ошибки при изменении чекбоксов
                  if (errors.medications) {
                    setErrors(prev => ({ ...prev, medications: '' }));
                  }
                }}
              />
              
              <OtherDiseaseContainer>
                <InputFieldTitle>Другие лекарства</InputFieldTitle>
                <CustomFormInput
                  name="otherMedication"
                  value={formData.medications.other}
                  onChange={handleCustomOtherMedicationChange}
                  placeholder="Введите ваше лекарство"
                  showRightText={false}
                  fullWidth={true}
                />
              </OtherDiseaseContainer>
            </DiseasesContainer>
          </FormSection>
        )}
        
        {/* Кнопки */}
        <ButtonContainer>
          <CustomButton
            type="submit"
            variant="primary"
            iconRight="arrow-right.svg"
          >
            Продолжить
          </CustomButton>
        </ButtonContainer>
      </form>
      
      {/* Снекбар */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
      />
    </FormContainer>
  );
};

export default ProfileForm;
