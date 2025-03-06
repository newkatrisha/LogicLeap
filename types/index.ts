export interface User {
  uid: string;
  email: string;
  level: number;
  questionsSolved: number;
  coins: number;
  age: number;
  nickname: string;
  purchasedItems: string[];
  purchasedStories: {
    id: number;
    name: string;
  }[];
  avatar: string;
}
