import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Star, Trophy, Layers } from 'lucide-react';
import { soundManager } from '../utils/soundHelper';

interface HeaderProps {
  score: number;
  stars: number;
  activeGame: string | null;
  onSelectGame: (game: string | null) => void;
  onOpenDictionary: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showTashkeel: boolean;
  onToggleTashkeel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  stars,
  activeGame,
  onSelectGame,
  onOpenDictionary,
  isMuted,
  onToggleMute,
  showTashkeel,
  onToggleTashkeel,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-emerald-900/95 backdrop-blur-md text-amber-50 shadow-lg border-b border-emerald-700/50">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
        
        {/* App Logo & Title */}
        <div 
          onClick={() => onSelectGame(null)} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-900/30 group-hover:scale-105 transition-transform">
            <span className="font-quran text-2xl sm:text-3xl text-emerald-950 font-bold">عَمّ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-amber-200 tracking-tight flex items-center gap-1.5">
                ألعاب كلمات جزء عمّ
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium hidden sm:block">
              رحلة مشوقة لتعليم مفردات القرآن الكريم للمبتدئين
            </p>
          </div>
        </div>

        {/* Action Controls & Counters */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          {/* Back to Games button if in game */}
          {activeGame && (
            <button
              onClick={() => onSelectGame(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-100 text-xs sm:text-sm font-semibold border border-emerald-600 transition-colors shadow-sm"
              title="العودة لقائمة الألعاب"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>الألعاب</span>
            </button>
          )}

          {/* Dictionary / Glossary button */}
          <button
            onClick={onOpenDictionary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white text-xs sm:text-sm font-semibold border border-emerald-600/60 transition-colors shadow-sm"
            title="معجم مفردات جزء عم"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">معجم الكلمات</span>
          </button>

          {/* Tashkeel toggle */}
          <button
            onClick={onToggleTashkeel}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors shadow-sm ${
              showTashkeel
                ? 'bg-amber-500 text-emerald-950 border-amber-300'
                : 'bg-emerald-800 text-emerald-200 border-emerald-600'
            }`}
            title="تبديل إظهار التشكيل والحركات"
          >
            {showTashkeel ? 'التشكيل: مُفَعَّل' : 'التشكيل: مُعَطَّل'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const muted = soundManager.toggleMute();
              onToggleMute();
              if (!muted) soundManager.playCardFlip();
            }}
            className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-200 border border-emerald-600 transition-colors shadow-sm"
            title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Points & Stars Badges */}
          <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-700/60 shadow-inner">
            <div className="flex items-center gap-1 text-amber-300 font-bold text-xs sm:text-sm" title="مجموع النجوم">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{stars}</span>
            </div>
            <div className="w-px h-3.5 bg-emerald-700" />
            <div className="flex items-center gap-1 text-emerald-200 font-bold text-xs sm:text-sm" title="النقاط">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{score}</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

