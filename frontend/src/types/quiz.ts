export interface IQuizProgress {
  latestProgress: boolean;
  unansweredWords: string[];
  currentScore: number;
  correctAnsweredWords: string[];
  incorrectAnsweredWords: string[];
  answeredAt: Date;
}

export interface IUserQuiz {
  _id?: string;
  userId: string;
  categoryId: string;
  progress?: IQuizProgress[];
}
