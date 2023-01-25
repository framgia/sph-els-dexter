export interface IWordOptions {
  id: number;
  choice: string;
  correctChoice: boolean;
}

export interface IWord {
  _id?: string;
  word: string;
  options: IWordOptions[];
}
