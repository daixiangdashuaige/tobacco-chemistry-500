export interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  category?: string; // Derived from keywords if needed
}

export type QuizMode = 'practice' | 'exam' | 'review' | 'blitz';

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  history: Record<number, 'correct' | 'incorrect'>; // Question ID -> Result
  examAnswers: Record<number, string>; // Question ID -> User Answer (for exam mode)
  isActive: boolean;
  isFinished: boolean;
  mode: QuizMode;
  filteredQuestions: Question[]; // The subset of questions currently being played
}

export interface UserProgress {
  answered: number[]; // IDs of answered questions
  mastered: number[]; // IDs answered correctly
  needsReview: number[]; // IDs answered incorrectly
}