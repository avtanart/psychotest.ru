// Типы для профиля пользователя
export interface ProfileData {
  name: string;
  gender: string;
  age: number;
  education: string;
  maritalStatus: string;
  children: string;
  hasChronicDiseases: string;
  diseases: {
    hypertension: boolean;
    coronaryHeartDisease: boolean;
    heartFailure: boolean;
    asthma: boolean;
    chronicBronchitis: boolean;
    copd: boolean;
    diabetesType1: boolean;
    diabetesType2: boolean;
    cancer: boolean;
    hiv: boolean;
    hypothyroidism: boolean;
    recurrentDepression: boolean;
    generalizedAnxietyDisorder: boolean;
    bipolarAffectiveDisorder: boolean;
    other: string;
  };
  takesMedications: string;
  medications: {
    oralContraceptives: boolean;
    vitaminD: boolean;
    ironSupplements: boolean;
    thyroidHormones: boolean;
    iodineOrThyrostatics: boolean;
    statins: boolean;
    antidepressants: boolean;
    insulin: boolean;
    herbalTinctures: boolean;
    other: string;
  };
}

// Типы для вопросов тестов
export type QuestionType = 'single' | 'multiple' | 'scale' | 'text' | 'matrix';

export interface Option {
  id: string;
  text: string;
}

export interface MatrixRow {
  id: string;
  text: string;
}

export interface MatrixColumn {
  id: string;
  text: string;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single';
  options: Option[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple';
  options: Option[];
  minSelections?: number;
  maxSelections?: number;
}

export interface ScaleQuestion extends BaseQuestion {
  type: 'scale';
  min: number;
  max: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export interface MatrixQuestion extends BaseQuestion {
  type: 'matrix';
  rows: MatrixRow[];
  columns: MatrixColumn[];
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | ScaleQuestion
  | TextQuestion
  | MatrixQuestion;

// Типы для страниц теста
export interface TestPage {
  id: string;
  title: string;
  questions: Question[];
}

// Типы для тестов
export interface Test {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  pages: TestPage[];
}

// Типы для ответов
export type Answer = string | string[] | number | { [key: string]: string };

export interface TestAnswers {
  [questionId: string]: Answer;
}

export interface TestResult {
  startedAt: string;
  completedAt?: string;
  timeSpent?: number;
  answers: TestAnswers;
}

export interface UserAnswers {
  [testId: string]: TestResult;
}

// Типы для сессии
export interface SessionState {
  userId: string;
  startedAt: string;
  expiresAt: string;
  lastActivity: string;
  currentTest: string;
  currentPage: string;
  progress: {
    profile: boolean;
    [testId: string]: boolean | {
      completed: boolean;
      currentPage: string;
      answeredQuestions: string[];
    };
    email: boolean;
  };
  active: boolean;
}

// Типы для состояния приложения
export interface AppState {
  profile: ProfileData;
  answers: UserAnswers;
  session: SessionState;
  currentTest: string | null;
  currentPage: string | null;
  completed: boolean;
}

// Экспортируем типы для тестов
export * from './test1Types';
export * from './test2Types';
export * from './test3Types';
export * from './test4Types';
export * from './test5Types';
export * from './test6Types';
export * from './test7Types';