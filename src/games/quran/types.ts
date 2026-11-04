export type GameType = 
  | 'memory'
  | 'crossword'
  | 'match_meaning'
  | 'match_opposites'
  | 'missing_letter'
  | 'missing_word_ayah';

export interface QuranWord {
  id: string;
  word: string; // with tashkeel
  wordPlain: string; // without tashkeel for searching/matching
  meaning: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  partOfSpeech?: string;
  audioText?: string;
}

export interface WordOppositePair {
  id: string;
  word1: string;
  word1Plain: string;
  word2: string;
  word2Plain: string;
  relationship: 'مضاد (عكس)' | 'مرادف (نظير)' | 'زوج مقترن';
  surah1: string;
  surah2: string;
  explanation: string;
}

export interface MissingLetterQuestion {
  id: string;
  fullWord: string;
  fullWordPlain: string;
  displayWord: string; // word with placeholder e.g. "أَبَـ_ـبِيل"
  missingLetterIndex: number;
  correctLetter: string; // e.g. "ا"
  options: string[]; // 4 choices
  surahName: string;
  ayahNumber: number;
  ayahText: string;
  meaning: string;
  hint: string;
}

export interface MissingAyahQuestion {
  id: string;
  surahName: string;
  ayahNumber: number;
  ayahBefore: string;
  missingWord: string;
  ayahAfter: string;
  fullAyah: string;
  options: string[];
  meaning: string;
  surahContext: string;
}

export interface CrosswordCell {
  row: number;
  col: number;
  letter: string;
  isBlocked: boolean;
  number?: number;
  acrossClueIndex?: number;
  downClueIndex?: number;
}

export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  text: string;
  answer: string;
  surahName: string;
  row: number;
  col: number;
}

export interface CrosswordPuzzle {
  id: string;
  title: string;
  surahFilter?: string;
  gridSize: { rows: number; cols: number };
  grid: (string | null)[][]; // null = blocked, letter = correct
  clues: CrosswordClue[];
}

export interface UserStats {
  stars: number;
  score: number;
  gamesCompleted: Record<GameType, number>;
  surahBadges: Record<string, boolean>;
  highScores: Record<string, number>;
}

