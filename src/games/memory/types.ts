export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type GameCategory = 'all' | 'short_surahs' | 'nature_universe' | 'blessings_stories';

export interface JuzAmmaWord {
  id: string;
  word: string; // The word with Tashkeel (e.g. ﴿الشَّمْسُ﴾)
  cleanWord: string; // Word without diacritics for search
  surah: string; // e.g. سورة الشمس
  surahNumber: number;
  ayahNumber: number;
  ayahText: string; // Full ayah with Tashkeel
  meaning: string; // Simple meaning for kids
  iconName: string; // Lucide icon identifier
  color: string; // Tailwind color theme identifier
  category: 'short_surahs' | 'nature_universe' | 'blessings_stories';
}

export interface MemoryCardItem {
  instanceId: string; // Unique ID for each card on the board
  wordId: string;
  wordData: JuzAmmaWord;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface DifficultyConfig {
  id: GameDifficulty;
  name: string;
  subtitle: string;
  pairsCount: number;
  gridColsClass: string;
  starThresholdMoves: [number, number]; // [maxMovesFor3Stars, maxMovesFor2Stars]
  icon: string;
  badge: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameStats {
  moves: number;
  matches: number;
  totalPairs: number;
  stars: number;
  elapsedSeconds: number;
  isCompleted: boolean;
  streak: number;
  bestScore?: number;
}
