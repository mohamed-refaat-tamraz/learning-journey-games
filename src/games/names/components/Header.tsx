import React from 'react';
import { GameMode } from '../types';
import { Sparkles, Flame, BookOpen, Trophy, Award, Gamepad2 } from 'lucide-react';
import { sounds } from '../utils/sound';

interface HeaderProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  stars: number;
  streak: number;
  showTashkeel: boolean;
  setShowTashkeel: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  stars,
  streak,
  showTashkeel,
  setShowTashkeel,
}) => {


  return (
    <header className="w-full max-w-5xl mx-auto px-4 pt-3 sticky top-0 z-30">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-sm border-b-4 border-sky-300 flex flex-wrap items-center justify-between gap-4">
        {/* App Title & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 text-2xl font-black border-2 border-white">
            🕌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-3xl font-black text-sky-950 font-tajawal tracking-tight">
                أسماء الله الحسنى
              </h1>
              <span className="bg-pink-500 text-white text-xs px-3 py-0.5 rounded-full font-bold shadow-xs">
                للأطفال
              </span>
            </div>
            <p className="text-xs md:text-sm text-sky-800 font-bold hidden sm:block">
              رحلة التعلم والمطابقة الممتعة
            </p>
          </div>
        </div>

        {/* Live Score, Streak & Rewards */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak indicator */}
          {streak > 0 && (
            <div 
              id="streak-badge"
              className="flex items-center gap-1.5 bg-orange-100 border-2 border-orange-300 text-orange-800 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-xs animate-bounce"
              title="إجابات صحيحة متتالية"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{streak}</span>
              <span className="hidden md:inline text-[11px] text-orange-700">متتالي</span>
            </div>
          )}

          {/* Stars Counter with Vibrant yellow badge */}
          <div 
            id="stars-badge"
            className="flex items-center gap-2 bg-yellow-400/90 border-2 border-yellow-500 text-yellow-950 px-3.5 py-1.5 rounded-2xl shadow-sm"
            title="مجموع النجوم"
          >
            <span className="text-lg">⭐</span>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-yellow-900">النجوم</span>
              <span className="text-base font-black text-orange-600">{stars}</span>
            </div>
          </div>

          {/* Tashkeel Toggle */}
          <button
            id="toggle-tashkeel-btn"
            onClick={() => {
              sounds.playClick();
              setShowTashkeel(!showTashkeel);
            }}
            className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all border-2 ${
              showTashkeel 
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' 
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
            title={showTashkeel ? 'التشكيل مفعل' : 'التشكيل غير مفعل'}
          >
            {showTashkeel ? 'التشكيل: نعم ✍️' : 'التشكيل: لا'}
          </button>


        </div>
      </div>

      {/* Navigation Mode Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 py-2.5">
        <button
          id="nav-quiz-btn"
          onClick={() => {
            sounds.playClick();
            setMode('quiz');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap border-b-4 ${
            mode === 'quiz'
              ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-700 shadow-md scale-105'
              : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50 shadow-xs'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>العب وتعلم (3 خيارات)</span>
        </button>

        <button
          id="nav-levels-btn"
          onClick={() => {
            sounds.playClick();
            setMode('levels');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap border-b-4 ${
            mode === 'levels'
              ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-800 shadow-md scale-105'
              : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50 shadow-xs'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>رحلة المستويات</span>
        </button>

        <button
          id="nav-library-btn"
          onClick={() => {
            sounds.playClick();
            setMode('library');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all whitespace-nowrap border-b-4 ${
            mode === 'library'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
              : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50 shadow-xs'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>المعجم المصور</span>
        </button>
      </div>
    </header>
  );
};
