import React from 'react';
import {
  RotateCcw,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { GameDifficulty, GameCategory, GameStats } from '../types';
import { DIFFICULTY_CONFIGS } from '../data/juzAmmaWords';

interface GameHeaderProps {
  difficulty: GameDifficulty;
  category: GameCategory;
  stats: GameStats;
  onSelectDifficulty: (diff: GameDifficulty) => void;
  onSelectCategory: (cat: GameCategory) => void;
  onResetGame: () => void;
  onOpenDictionary: () => void;
  onOpenBadges: () => void;
  onOpenHowToPlay: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  difficulty,
  category,
  stats,
  onSelectDifficulty,
  onSelectCategory,
  onResetGame,
  onOpenDictionary,
  onOpenBadges,
  onOpenHowToPlay,
}) => {
  const currentDiff = DIFFICULTY_CONFIGS[difficulty];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const categories: { id: GameCategory; label: string }[] = [
    { id: 'all', label: 'كل المفردات' },
    { id: 'short_surahs', label: 'قصار السور' },
    { id: 'nature_universe', label: 'الكون والطبيعة' },
    { id: 'blessings_stories', label: 'النعم والقصص' },
  ];

  return (
    <header className="w-full max-w-5xl mx-auto mb-4 sm:mb-6">
      {/* Top Main Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-3.5 sm:p-5 shadow-lg border-2 border-amber-200/80 mb-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-amber-200">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    القرآن الكريم للأطفال 📖
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 font-['Readex_Pro',sans-serif]">
                  ذاكرة مفردات جزء عم
                </h1>
              </div>
            </div>

            {/* Mobile quick actions */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                type="button"
                onClick={onOpenHowToPlay}
                className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                title="كيفية اللعب"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenDictionary}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                title="معجم المفردات"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-2 flex-wrap justify-center w-full md:w-auto">
            <button
              type="button"
              onClick={onOpenHowToPlay}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>كيف ألعب؟</span>
            </button>

            <button
              type="button"
              onClick={onOpenDictionary}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>معجم المفردات</span>
            </button>

            <button
              type="button"
              onClick={onOpenBadges}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-100/70 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>الأوسمة</span>
            </button>

            {/* Reset Game Button */}
            <button
              type="button"
              onClick={onResetGame}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl text-xs font-extrabold shadow-md hover:shadow-emerald-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>جولة جديدة</span>
            </button>
          </div>
        </div>

        {/* Level and Category Selectors Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Difficulty Levels Pills */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto pb-1 sm:pb-0 justify-start">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline ml-1">المستوى:</span>
            {(['easy', 'medium', 'hard', 'expert'] as GameDifficulty[]).map((diffKey) => {
              const cfg = DIFFICULTY_CONFIGS[diffKey];
              const isActive = difficulty === diffKey;
              return (
                <button
                  key={diffKey}
                  type="button"
                  onClick={() => onSelectDifficulty(diffKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-200 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {{ easy: 'سهل', medium: 'متوسط', hard: 'متقدم', expert: 'ذهبي' }[diffKey]} ({cfg.pairsCount * 2} كرت)
                </button>
              );
            })}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 flex-wrap w-full sm:w-auto pb-1 sm:pb-0 justify-start sm:justify-end">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  category === cat.id
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Game Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-gradient-to-r from-amber-50 via-white to-emerald-50 rounded-2xl p-2.5 sm:p-3 shadow-md border border-amber-200/90">
        {/* Matches Found */}
        <div className="flex items-center gap-2 bg-white/80 rounded-xl p-2 border border-emerald-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
            ✨
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs text-slate-500 font-bold truncate">المتطابقة</div>
            <div className="text-sm sm:text-base font-black text-emerald-800">
              {stats.matches} / {stats.totalPairs}
            </div>
          </div>
        </div>

        {/* Moves Counter */}
        <div className="flex items-center gap-2 bg-white/80 rounded-xl p-2 border border-amber-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold">
            🔄
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs text-slate-500 font-bold truncate">النقلات</div>
            <div className="text-sm sm:text-base font-black text-amber-900">
              {stats.moves}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 bg-white/80 rounded-xl p-2 border border-sky-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs text-slate-500 font-bold truncate">الوقت</div>
            <div className="text-sm sm:text-base font-black text-sky-900">
              {formatTime(stats.elapsedSeconds)}
            </div>
          </div>
        </div>

        {/* Dynamic Stars */}
        <div className="flex items-center gap-2 bg-white/80 rounded-xl p-2 border border-yellow-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center flex-shrink-0 font-bold">
            ⭐
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs text-slate-500 font-bold truncate">التقييم</div>
            <div className="text-sm sm:text-base font-black text-amber-500 flex items-center">
              {'⭐'.repeat(Math.max(1, stats.stars))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
