export interface NameOfAllah {
  id: number;
  name: string; // With tashkeel, e.g., "الرَّحْمَنُ"
  plainName: string; // Without tashkeel, e.g., "الرحمن"
  simplifiedMeaning: string; // Child-friendly meaning
  childExample: string; // Real-life simplified example
  duaa: string; // Simple duaa
  category: 'mercy' | 'creation' | 'generosity' | 'knowledge' | 'power' | 'peace';
  categoryLabel: string;
  themeColor: string; // Tailwind color class for cards
}

export type GameMode = 'quiz' | 'levels' | 'library' | 'flashcards';

export interface LevelInfo {
  id: number;
  title: string;
  subtitle: string;
  nameIds: number[];
  icon: string;
  starsRequired: number;
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  highestStreak: number;
  totalAnswered: number;
  correctAnswersCount: number;
  stars: number;
  activeLevel: number;
  completedLevels: number[];
  soundEnabled: boolean;
  speechEnabled: boolean;
  showTashkeel: boolean;
}

export interface Question {
  targetName: NameOfAllah;
  options: NameOfAllah[]; // Exactly 3 options as requested
  selectedAnswerId: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
}
