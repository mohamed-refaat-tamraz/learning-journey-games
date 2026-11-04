import React, { useState, useEffect, useRef } from 'react';
import { GameType, UserStats } from './types';
import { Header } from './components/Header';
import { GameSelector } from './components/GameSelector';
import { MemoryGame } from './components/MemoryGame';
import { CrosswordGame } from './components/CrosswordGame';
import { MatchMeaningGame } from './components/MatchMeaningGame';
import { MatchOppositesGame } from './components/MatchOppositesGame';
import { MissingLetterGame } from './components/MissingLetterGame';
import { MissingWordAyahGame } from './components/MissingWordAyahGame';
import { SurahDictionaryModal } from './components/SurahDictionaryModal';
import { CelebrationModal } from './components/CelebrationModal';
import { soundManager } from './utils/soundHelper';
import { Sparkles, BookOpen, Heart, Award } from 'lucide-react';

import { readStoredValue, writeStoredValue } from '../../shared/storage';
import { useSoundEnabled } from '../../shared/soundPreference';
import './quran.css';

const STORAGE_KEY = 'quran_juz_amma_stats_v1';

const INITIAL_STATS: UserStats = {
  stars: 0,
  score: 0,
  gamesCompleted: {
    memory: 0,
    crossword: 0,
    match_meaning: 0,
    match_opposites: 0,
    missing_letter: 0,
    missing_word_ayah: 0,
  },
  surahBadges: {},
  highScores: {},
};

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = readStoredValue<Partial<UserStats> | null>(STORAGE_KEY, null);
    return { ...INITIAL_STATS, ...saved, gamesCompleted: { ...INITIAL_STATS.gamesCompleted, ...saved?.gamesCompleted } };
  });

  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState<boolean>(false);
  const soundEnabled = useSoundEnabled();
  const [session, setSession] = useState(0);
  const completed = useRef(false);
  useEffect(() => () => soundManager.dispose(), []);
  const selectGame = (game: GameType | null) => {
    soundManager.stop();
    completed.current = false;
    setSession(value => value + 1);
    setActiveGame(game);
  };
  const [showTashkeel, setShowTashkeel] = useState<boolean>(true);

  // Celebration modal state
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    score: number;
    stars: number;
    gameTitle: string;
  }>({
    isOpen: false,
    score: 0,
    stars: 0,
    gameTitle: '',
  });

  // Persist stats to localStorage
  useEffect(() => {
    writeStoredValue(STORAGE_KEY, stats);
  }, [stats]);

  const handleGameComplete = (scoreEarned: number, starsEarned: number) => {
    if (!activeGame || completed.current) return;
    completed.current = true;

    setStats((prev) => ({
      ...prev,
      score: prev.score + scoreEarned,
      stars: prev.stars + starsEarned,
      gamesCompleted: {
        ...prev.gamesCompleted,
        [activeGame]: (prev.gamesCompleted[activeGame] || 0) + 1,
      },
    }));

    const titles: Record<GameType, string> = {
      memory: 'كروت الذاكرة القرآنية',
      crossword: 'الكلمات المتقاطعة',
      match_meaning: 'توصيل المفردات بالمعنى',
      match_opposites: 'الكلمة والنظير والمضاد',
      missing_letter: 'الحرف الناقص في الكلمة',
      missing_word_ayah: 'الكلمة الناقصة في الآية',
    };

    setCelebrationData({
      isOpen: true,
      score: scoreEarned,
      stars: starsEarned,
      gameTitle: titles[activeGame] || '',
    });
  };

  return (
    <div id="quran-games-app" className="quran-games min-h-screen bg-islamic-pattern flex flex-col justify-between text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      
      {/* App Header */}
      <Header
        score={stats.score}
        stars={stats.stars}
        activeGame={activeGame}
        onSelectGame={(g) => selectGame(g as GameType | null)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        isMuted={!soundEnabled}
        onToggleMute={() => {}}
        showTashkeel={showTashkeel}
        onToggleTashkeel={() => setShowTashkeel((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!activeGame && (
          <GameSelector
            onSelectGame={selectGame}
            gameStats={stats.gamesCompleted}
          />
        )}

        {activeGame === 'memory' && (
          <MemoryGame key={session}
            onGameComplete={handleGameComplete}
            onBack={() => selectGame(null)}
            showTashkeel={showTashkeel}
          />
        )}

        {activeGame === 'crossword' && (
          <CrosswordGame key={session}
            onGameComplete={handleGameComplete}
            onBack={() => selectGame(null)}
          />
        )}

        {activeGame === 'match_meaning' && (
          <MatchMeaningGame key={session}
            onGameComplete={handleGameComplete}
            onBack={() => selectGame(null)}
            showTashkeel={showTashkeel}
          />
        )}

        {activeGame === 'match_opposites' && (
          <MatchOppositesGame key={session}
            onGameComplete={handleGameComplete}
            onBack={() => selectGame(null)}
            showTashkeel={showTashkeel}
          />
        )}

        {activeGame === 'missing_letter' && (
          <MissingLetterGame key={session}
            onGameComplete={handleGameComplete}
            onBack={() => selectGame(null)}
            showTashkeel={showTashkeel}
          />
        )}

        {activeGame === 'missing_word_ayah' && (
          <MissingWordAyahGame key={session}
            onGameComplete={handleGameComplete}
            onBack={() => selectGame(null)}
            showTashkeel={showTashkeel}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-slate-900 text-slate-400 border-t border-slate-800 text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-quran text-amber-300 font-bold text-base">جزء عمّ المبارك</span>
            <span>•</span>
            <span>تطبيق تعليمي تفاعلي لقصار السور والمفردات القرآنية</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsDictionaryOpen(true)}
              className="text-amber-300 hover:text-amber-200 underline underline-offset-4"
            >
              فتح معجم الكلمات
            </button>
            <span>•</span>
            <span>مناسب للمبتدئين والأطفال والناشئة</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SurahDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        showTashkeel={showTashkeel}
      />

      <CelebrationModal
        isOpen={celebrationData.isOpen}
        scoreEarned={celebrationData.score}
        starsEarned={celebrationData.stars}
        gameTitle={celebrationData.gameTitle}
        onPlayAgain={() => {
          setCelebrationData((prev) => ({ ...prev, isOpen: false }));
          selectGame(activeGame);
        }}
        onBackToMenu={() => {
          setCelebrationData((prev) => ({ ...prev, isOpen: false }));
          selectGame(null);
        }}
      />

    </div>
  );
}

