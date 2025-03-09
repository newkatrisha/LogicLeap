export interface User {
  uid: string;
  email: string;
  level: number;
  questionsSolved: number;
  coins: number;
  age?: number;
  nickname?: string;
  purchasedItems: string[];
  purchasedStories: { id: number; name: string }[];
  avatar: string;
  scores?: any;
}

export interface UserContextType {
  user: User | null;
  signOut?: () => Promise<void>;
  logout: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  updateAvatar: (avatarId: string) => Promise<void>;
  updateCoins: (additionalCoins: number) => Promise<void>;
  updateQuestionsSolved: (additionalQuestions: number) => Promise<void>;
  markTestCompleted: () => Promise<void>;
  testCompleted: boolean;
}
