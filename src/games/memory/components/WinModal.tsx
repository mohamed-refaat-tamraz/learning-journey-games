import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, Award, ArrowRight, BookOpen } from 'lucide-react';
import { JuzAmmaWord, GameDifficulty } from '../types';
import { WordIcon } from './WordIcon';
import { sounds } from '../utils/audio';
import { DIFFICULTY_CONFIGS } from '../data/juzAmmaWords';

interface WinModalProps {
  isOpen: boolean;
  stars: number;
  moves: number;
  elapsedSeconds: number;
  difficulty: GameDifficulty;
  wordsMatched: JuzAmmaWord[];
  onPlayAgain: () => void;
  onSelectDifficulty: (diff: GameDifficulty) => void;
  onOpenDictionary: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  stars,
  moves,
  elapsedSeconds,
  difficulty,
  wordsMatched,
  onPlayAgain,
  onSelectDifficulty,
  onOpenDictionary,
}) => {
  useEffect(() => {
    let frameId: number | null = null;
    let active = true;
    if (isOpen) {
      sounds.playVictory();

      // Launch kid-friendly colorful confetti
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

      const frame = () => {
        if (!active) return;
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          frameId = requestAnimationFrame(frame);
        }
      };
      frame();
    }
    return () => {
      active = false;
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (isOpen) confetti.reset();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentConfig = DIFFICULTY_CONFIGS[difficulty];
  const nextDiffMap: Record<GameDifficulty, GameDifficulty | null> = {
    easy: 'medium',
    medium: 'hard',
    hard: 'expert',
    expert: null,
  };
  const nextDiff = nextDiffMap[difficulty];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      id="win-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden my-6"
      >
        {/* Top Decorative Banner */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400" />

        {/* Victory Trophy Badge */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 border-4 border-white shadow-lg flex items-center justify-center text-amber-900 -mt-2 mb-3">
          <Award className="w-10 h-10 animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Readex_Pro',sans-serif]">
          ما شاء الله! أحسنت يا بطل! 🎉
        </h2>
        <p className="text-sm font-semibold text-emerald-700 mt-1">
          لقد طابقت جميع كروت مفردات جزء عم بنجاح باهر
        </p>

        {/* Stars animation */}
        <div className="flex justify-center items-center gap-2 my-4">
          {[1, 2, 3].map((starNum) => {
            const isFilled = starNum <= stars;
            return (
              <motion.div
                key={starNum}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + starNum * 0.2, type: 'spring' }}
                onAnimationComplete={() => {
                  if (isFilled) sounds.playStar(starNum);
                }}
              >
                <Star
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${
                    isFilled
                      ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Game Stats Badge Pill */}
        <div className="grid grid-cols-3 gap-2 bg-amber-50/80 rounded-2xl p-3 border border-amber-200 my-4 text-center">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold">المستوى</span>
            <span className="text-sm font-extrabold text-amber-900 truncate">
              {currentConfig.badge}
            </span>
          </div>
          <div className="flex flex-col border-x border-amber-200">
            <span className="text-xs text-slate-500 font-bold">المحاولات</span>
            <span className="text-sm font-extrabold text-slate-800">{moves} نقلة</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold">الوقت</span>
            <span className="text-sm font-extrabold text-slate-800">{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Mastered Words Carousel / Badges in this round */}
        <div className="my-4 text-right">
          <h3 className="text-xs font-extrabold text-slate-700 mb-2 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>المفردات التي أتقنتها في هذه الجولة:</span>
          </h3>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
            {wordsMatched.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm"
              >
                <WordIcon name={w.iconName} className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-['Amiri',serif] font-bold text-sm text-slate-900">
                  {w.word}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-5 rounded-2xl shadow-lg hover:shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4" />
            <span>العب مرة أخرى</span>
          </button>

          {nextDiff && (
            <button
              type="button"
              onClick={() => onSelectDifficulty(nextDiff)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg hover:shadow-amber-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base"
            >
              <span>المستوى التالي 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDictionary}
            className="sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer text-sm flex items-center justify-center gap-1.5"
            title="تصفح معجم المفردات"
          >
            <BookOpen className="w-4 h-4" />
            <span>المعجم</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
