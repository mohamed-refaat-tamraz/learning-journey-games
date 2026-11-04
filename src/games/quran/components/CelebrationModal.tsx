import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/soundHelper';

interface CelebrationModalProps {
  isOpen: boolean;
  scoreEarned: number;
  starsEarned: number;
  gameTitle: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  scoreEarned,
  starsEarned,
  gameTitle,
  onPlayAgain,
  onBackToMenu,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playVictory();
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#d97706', '#0284c7', '#f59e0b', '#10b981'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
    return () => { confetti.reset(); };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl text-center flex flex-col items-center">
        
        {/* Big Trophy and Islamic Ornament */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10 text-emerald-950" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-spin" />
        </div>

        {/* Praises & Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-cairo mb-1">
          ما شاء الله! مبارك الإنجاز!
        </h2>
        <p className="text-sm text-emerald-800 font-bold mb-4 font-tajawal">
          أتممت تحدي « {gameTitle} » بنجاح باهر!
        </p>

        {/* Stars Display */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-10 h-10 transition-all ${
                starIdx <= starsEarned
                  ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-md'
                  : 'fill-slate-200 text-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Score Earned Banner */}
        <div className="w-full bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6 flex items-center justify-around">
          <div>
            <span className="text-xs text-slate-500 font-bold block">النقاط المكتسبة</span>
            <span className="text-2xl font-extrabold text-emerald-700">+{scoreEarned}</span>
          </div>
          <div className="w-px h-8 bg-amber-200" />
          <div>
            <span className="text-xs text-slate-500 font-bold block">النجوم</span>
            <span className="text-2xl font-extrabold text-amber-600">+{starsEarned} ★</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>العب مجدداً</span>
          </button>
          
          <button
            onClick={onBackToMenu}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl border border-slate-300 transition-transform active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>قائمة الألعاب</span>
          </button>
        </div>

      </div>
    </div>
  );
};

