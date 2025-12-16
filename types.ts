export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export enum QuizState {
  START,
  LOADING_QUESTIONS,
  ACTIVE,
  SHOWING_RESULTS,
  FINISHED,
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}
