export interface QuizList {
  quizId: number;
  title: string;
  categoryName: string;
  totalQuestions: number;
  createdAt: string;
}

export interface QuizDetail {
  quizId: number;
  title: string;
  categoryName: string;
  totalQuestions: number;
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
