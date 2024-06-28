export interface EventPayload {
  roomId?: string;
  passedData: object | string;
}

export interface ProjectObject{
  projectId: string;
  projectName: string;
  description?: string;
}

export interface Comment{
  userName: string;
  questionId: number;
  text: string;
}

export interface Emoji{
  userName: string;
  questionId: number;
  type: string;
  isPositive: boolean;
}

export interface Option{
  // 一個選擇
  _id: string,
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Answer{
  id: number;
  title: string;
  userAnswer: Option;
}

export type ReactionTuple = [string, { count: number; sentiment: 'positive' | 'negative' }];

export interface Question{
  // 題目的問題
  id: number;
  title: string;
  content: string;
  options: Option[];
}


interface QuestionStats{
  title: string;
  totalAnswers: number;
  totalCorrectAnswers: number;
  answers: [string, string][];
  comments: string[];
  reactions: ReactionTuple[];
}

export interface ProjectStats{
  projectName: string;
  data: QuestionStats[];
}

export interface Task{
  // 一個題目（畫面）
  project: Question[];
  type?: String;
  isInteractive: Boolean;
}