export interface Comment{
  userName: string;
  questionId: number;
  text: string;
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

export interface Question{
  // 題目的問題
  id: number;
  title: string;
  content: string;
  options: Option[];
}


interface QuestionStats{
  title: string;
  answers: [string, string][];
  comments: string[];
  reactions: string[];
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