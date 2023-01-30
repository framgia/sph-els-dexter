import {IWordOptions} from "."

export interface IUserAnswer {
  wordId: string;
  answer: IWordOptions;
}

export interface IQuizProgress {
  latestProgress: boolean;
  unansweredWords: string[];
  currentScore: number;
  correctAnsweredWords: string[];
  incorrectAnsweredWords: string[];
  answers: IUserAnswer[];
  answeredAt: Date;
}

export interface IUserQuiz {
  _id?: string;
  userId: string;
  categoryId: string;
  progress?: IQuizProgress[];
}
