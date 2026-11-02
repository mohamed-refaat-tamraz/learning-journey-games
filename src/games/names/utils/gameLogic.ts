import { NameOfAllah, Question, GameState } from '../types';
import { NAMES_OF_ALLAH, LEVELS } from '../data/namesData';

export const generateQuestion = (
  targetPool?: NameOfAllah[],
  excludedId?: number
): Question => {
  const pool = targetPool && targetPool.length >= 3 ? targetPool : NAMES_OF_ALLAH;
  
  // Filter out the excludedId if possible to avoid immediate repeating
  const candidatePool = pool.filter(item => item.id !== excludedId);
  const selectedPool = candidatePool.length > 0 ? candidatePool : pool;
  
  // Pick target name
  const targetIndex = Math.floor(Math.random() * selectedPool.length);
  const targetName = selectedPool[targetIndex];

  // Pick 2 distinct distractors from NAMES_OF_ALLAH
  const remainingNames = NAMES_OF_ALLAH.filter(item => item.id !== targetName.id);
  
  // Prefer distractors from similar category if available for interesting challenge, or random
  const shuffledRemaining = [...remainingNames].sort(() => 0.5 - Math.random());
  const distractors = shuffledRemaining.slice(0, 2);

  // Exactly 3 options, shuffled
  const options = [targetName, ...distractors].sort(() => 0.5 - Math.random());

  return {
    targetName,
    options,
    selectedAnswerId: null,
    isAnswered: false,
    isCorrect: null
  };
};

export const getLevelNames = (levelId: number): NameOfAllah[] => {
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return NAMES_OF_ALLAH;
  return NAMES_OF_ALLAH.filter(n => level.nameIds.includes(n.id));
};

const STORAGE_KEY = 'asma_allah_kids_game_v1';

export const loadSavedState = (): Partial<GameState> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveGameState = (state: Partial<GameState>) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadSavedState();
    const merged = { ...existing, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Local storage disabled
  }
};
