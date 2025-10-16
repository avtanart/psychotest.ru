import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileData } from '../../types';

// ========================================
// КОНСТАНТЫ
// ========================================

const INITIAL_PROFILE: ProfileData = {
  name: '',
  gender: '',
  age: 0,
  education: '',
  maritalStatus: '',
  children: '',
  hasChronicDiseases: '',
  diseases: {
    hypertension: false,
    coronaryHeartDisease: false,
    heartFailure: false,
    asthma: false,
    chronicBronchitis: false,
    copd: false,
    diabetesType1: false,
    diabetesType2: false,
    cancer: false,
    hiv: false,
    hypothyroidism: false,
    recurrentDepression: false,
    generalizedAnxietyDisorder: false,
    bipolarAffectiveDisorder: false,
    other: ''
  },
  takesMedications: '',
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
};

// ========================================
// ТИПЫ ДЛЯ ACTIONS
// ========================================

interface UpdateDiseaseAction {
  key: keyof ProfileData['diseases'];
  value: boolean | string;
}

interface UpdateMedicationAction {
  key: keyof ProfileData['medications'];
  value: boolean | string;
}

interface UpdateFieldAction {
  field: keyof ProfileData;
  value: any;
}

// ========================================
// REDUX SLICE
// ========================================

const profileSlice = createSlice({
  name: 'profile',
  initialState: INITIAL_PROFILE,
  reducers: {
    // Полная замена профиля
    setProfile: (state, action: PayloadAction<ProfileData>) => {
      const newProfile = action.payload;
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(newProfile));
      return newProfile;
    },
    
    // Частичное обновление профиля
    updateProfile: (state, action: PayloadAction<Partial<ProfileData>>) => {
      const newProfile = { ...state, ...action.payload };
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(newProfile));
      return newProfile;
    },
    
    // Обновление конкретного поля
    updateField: (state, action: PayloadAction<UpdateFieldAction>) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(state));
    },
    
    // Обновление заболевания
    updateDisease: (state, action: PayloadAction<UpdateDiseaseAction>) => {
      const { key, value } = action.payload;
      
      if (key === 'other') {
        if (typeof value === 'string') {
          state.diseases.other = value;
        }
      } else {
        if (typeof value === 'boolean') {
          (state.diseases as any)[key] = value;
        }
      }
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(state));
    },
    
    // Обновление лекарства
    updateMedication: (state, action: PayloadAction<UpdateMedicationAction>) => {
      const { key, value } = action.payload;
      
      if (key === 'other') {
        if (typeof value === 'string') {
          state.medications.other = value;
        }
      } else {
        if (typeof value === 'boolean') {
          (state.medications as any)[key] = value;
        }
      }
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(state));
    },
    
    // Обновление всех заболеваний
    updateDiseases: (state, action: PayloadAction<Partial<ProfileData['diseases']>>) => {
      state.diseases = { ...state.diseases, ...action.payload };
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(state));
    },
    
    // Обновление всех лекарств
    updateMedications: (state, action: PayloadAction<Partial<ProfileData['medications']>>) => {
      state.medications = { ...state.medications, ...action.payload };
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(state));
    },
    
    // Сброс профиля к начальному состоянию
    clearProfile: () => {
      const newProfile = INITIAL_PROFILE;
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(newProfile));
      return newProfile;
    },
    
    // Сброс только заболеваний
    clearDiseases: (state) => {
      state.diseases = { ...INITIAL_PROFILE.diseases };
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(state));
    },
    
    // Сброс только лекарств
    clearMedications: (state) => {
      state.medications = { ...INITIAL_PROFILE.medications };
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(state));
    },
    
    // Валидация и очистка профиля
    validateAndCleanProfile: (state) => {
      // Очистка пустых строк
      if (state.name.trim() === '') state.name = '';
      if (state.diseases.other.trim() === '') state.diseases.other = '';
      if (state.medications.other.trim() === '') state.medications.other = '';
      
      // Сброс заболеваний, если не выбрано "Да"
      if (state.hasChronicDiseases !== 'Да') {
        state.diseases = { ...INITIAL_PROFILE.diseases };
      }
      
      // Сброс лекарств, если не выбрано "Да"
      if (state.takesMedications !== 'Да') {
        state.medications = { ...INITIAL_PROFILE.medications };
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('profile', JSON.stringify(state));
    }
  },
});

// ========================================
// ЭКСПОРТ ACTIONS
// ========================================

export const {
  setProfile,
  updateProfile,
  updateField,
  updateDisease,
  updateMedication,
  updateDiseases,
  updateMedications,
  clearProfile,
  clearDiseases,
  clearMedications,
  validateAndCleanProfile
} = profileSlice.actions;

// ========================================
// ЭКСПОРТ REDUCER
// ========================================

export default profileSlice.reducer;

// ========================================
// СЕЛЕКТОРЫ
// ========================================

export const selectProfile = (state: { profile: ProfileData }) => state.profile;
export const selectProfileField = (field: keyof ProfileData) => (state: { profile: ProfileData }) => state.profile[field];
export const selectDiseases = (state: { profile: ProfileData }) => state.profile.diseases;
export const selectMedications = (state: { profile: ProfileData }) => state.profile.medications;
export const selectHasChronicDiseases = (state: { profile: ProfileData }) => state.profile.hasChronicDiseases === 'Да';
export const selectTakesMedications = (state: { profile: ProfileData }) => state.profile.takesMedications === 'Да';

// ========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ========================================

export const isProfileComplete = (profile: ProfileData): boolean => {
  const requiredFields: (keyof ProfileData)[] = [
    'name', 'gender', 'age', 'education', 
    'maritalStatus', 'children', 'hasChronicDiseases', 'takesMedications'
  ];
  
  return requiredFields.every(field => {
    const value = profile[field];
    return value !== '' && value !== 0;
  });
};

export const getProfileValidationErrors = (profile: ProfileData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!profile.name || profile.name.trim() === '') {
    errors.name = 'Имя обязательно для заполнения';
  }
  
  if (!profile.gender) {
    errors.gender = 'Пол обязателен для заполнения';
  }
  
  if (!profile.age || profile.age <= 0) {
    errors.age = 'Возраст обязателен для заполнения';
  }
  
  if (!profile.education) {
    errors.education = 'Образование обязательно для заполнения';
  }
  
  if (!profile.maritalStatus) {
    errors.maritalStatus = 'Семейное положение обязательно для заполнения';
  }
  
  if (!profile.children) {
    errors.children = 'Информация о детях обязательна для заполнения';
  }
  
  if (!profile.hasChronicDiseases) {
    errors.hasChronicDiseases = 'Информация о заболеваниях обязательна для заполнения';
  }
  
  if (!profile.takesMedications) {
    errors.takesMedications = 'Информация о лекарствах обязательна для заполнения';
  }
  
  // Проверка заболеваний
  if (profile.hasChronicDiseases === 'Да') {
    const hasAnyDisease = Object.values(profile.diseases).some(value => 
      typeof value === 'boolean' ? value : value.trim() !== ''
    );
    
    if (!hasAnyDisease) {
      errors.diseases = 'Выберите или введите заболевание';
    }
  }
  
  // Проверка лекарств
  if (profile.takesMedications === 'Да') {
    const hasAnyMedication = Object.values(profile.medications).some(value => 
      typeof value === 'boolean' ? value : value.trim() !== ''
    );
    
    if (!hasAnyMedication) {
      errors.medications = 'Выберите или введите лекарство';
    }
  }
  
  return errors;
};
