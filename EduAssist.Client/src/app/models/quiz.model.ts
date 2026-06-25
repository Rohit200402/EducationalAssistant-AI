export interface QuizList {
  quizId: number;
  title: string;
  categoryName: string;
  totalQuestions: number;
  difficulty: string;
  createdAt: string;
}

export interface QuizDetail {
  quizId: number;
  title: string;
  categoryName: string;
  totalQuestions: number;
  difficulty: string;
  createdAt: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  questionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export interface QuizGenerate {
  categoryId: number;
  topic: string;
  numberOfQuestions: number;
  difficulty: string;
}

export interface QuizSubmit {
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: string;
}

export interface QuizResult {
  quizId: number;
  title: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  questions: QuizResultQuestion[];
}

export interface QuizResultQuestion {
  questionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  selectedOption: string;
  explanation: string;
  isCorrect: boolean;
}

export interface AdminQuizList {
  quizId: number;
  title: string;
  categoryName: string;
  userName: string;
  totalQuestions: number;
  difficulty: string;
  createdAt: string;
}

export interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  quizzesByCategory: QuizCategoryStat[];
  topPerformers: QuizTopPerformer[];
}

export interface QuizCategoryStat {
  categoryName: string;
  count: number;
}

export interface QuizTopPerformer {
  userName: string;
  quizzesTaken: number;
  averageScore: number;
}
