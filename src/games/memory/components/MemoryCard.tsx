import React from 'react';
import { motion } from 'motion/react';
import { MemoryCardItem } from '../types';
import { WordIcon } from './WordIcon';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface MemoryCardProps {
  card: MemoryCardItem;
  onClick: (card: MemoryCardItem) => void;
  disabled: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick, disabled }) => {
  const { wordData, isFlipped, isMatched } = card;

  const handleClick = () => {
    if (disabled || isFlipped || isMatched) return;
    onClick(card);
  };

  // Theme color maps for card borders & accents
  const colorStyles: Record<string, { bg: string; text: string; border: string; badge: string; iconBg: string }> = {
    emerald: {
      bg: 'bg-gradient-to-b from-emerald-50 to-emerald-100/80',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconBg: 'bg-emerald-500 text-white shadow-emerald-200',
    },
    amber: {
      bg: 'bg-gradient-to-b from-amber-50 to-amber-100/80',
      text: 'text-amber-950',
      border: 'border-amber-300',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      iconBg: 'bg-amber-500 text-white shadow-amber-200',
    },
    sky: {
      bg: 'bg-gradient-to-b from-sky-50 to-sky-100/80',
      text: 'text-sky-950',
      border: 'border-sky-300',
      badge: 'bg-sky-100 text-sky-900 border-sky-300',
      iconBg: 'bg-sky-500 text-white shadow-sky-200',
    },
    purple: {
      bg: 'bg-gradient-to-b from-purple-50 to-purple-100/80',
      text: 'text-purple-950',
      border: 'border-purple-300',
      badge: 'bg-purple-100 text-purple-900 border-purple-300',
      iconBg: 'bg-purple-500 text-white shadow-purple-200',
    },
    rose: {
      bg: 'bg-gradient-to-b from-rose-50 to-rose-100/80',
      text: 'text-rose-950',
      border: 'border-rose-300',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      iconBg: 'bg-rose-500 text-white shadow-rose-200',
    },
    indigo: {
      bg: 'bg-gradient-to-b from-indigo-50 to-indigo-100/80',
      text: 'text-indigo-950',
      border: 'border-indigo-300',
      badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      iconBg: 'bg-indigo-500 text-white shadow-indigo-200',
    },
    teal: {
      bg: 'bg-gradient-to-b from-teal-50 to-teal-100/80',
      text: 'text-teal-950',
      border: 'border-teal-300',
      badge: 'bg-teal-100 text-teal-900 border-teal-300',
      iconBg: 'bg-teal-500 text-white shadow-teal-200',
    },
    orange: {
      bg: 'bg-gradient-to-b from-orange-50 to-orange-100/80',
      text: 'text-orange-950',
      border: 'border-orange-300',
      badge: 'bg-orange-100 text-orange-900 border-orange-300',
      iconBg: 'bg-orange-500 text-white shadow-orange-200',
    },
  };

  const style = colorStyles[wordData.color] || colorStyles.emerald;

  return (
    <div
      id={`memory-card-${card.instanceId}`}
      className="relative w-full aspect-[3/4] min-h-[140px] sm:min-h-[160px] cursor-pointer perspective-1000 select-none group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={isFlipped || isMatched ? `كرت كلمة ${wordData.cleanWord}` : 'كرت ذاكرة مخفي'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-transform duration-500 shadow-md hover:shadow-lg rounded-2xl"
        animate={{
          rotateY: isFlipped || isMatched ? 180 : 0,
          scale: isMatched ? 0.98 : isFlipped ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* BACK OF CARD (Face Down - Hidden) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-between border-2 border-amber-300/80 bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-700 text-white overflow-hidden transition-all duration-300 group-hover:border-amber-200 group-hover:brightness-105`}
        >
          {/* Subtle Islamic Geometric Pattern Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
            <div className="w-28 h-28 border-4 border-dashed border-amber-100 rounded-full animate-spin [animation-duration:35s]" />
          </div>

          {/* Decorative Corner Ornaments */}
          <div className="w-full flex justify-between items-center text-amber-200/90 text-xs font-bold px-1">
            <span className="font-serif">۞</span>
            <span className="text-[10px] tracking-wider bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-300/30">
              جزء عم
            </span>
            <span className="font-serif">۞</span>
          </div>

          {/* Center Emblem */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100/20 backdrop-blur-sm border border-amber-200/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-100 animate-pulse" />
            </div>
            <span className="mt-2 text-xs font-bold text-amber-100 tracking-wide">
              اختر كرت
            </span>
          </div>

          {/* Bottom Footer on Back */}
          <div className="w-full flex justify-center text-amber-200/80 text-[11px] font-semibold">
            <span>✨ افتح واكتشف ✨</span>
          </div>
        </div>

        {/* FRONT OF CARD (Face Up - Word Revealed) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-between border-2 ${
            isMatched
              ? 'border-emerald-500 bg-emerald-50/95 ring-4 ring-emerald-300/60 shadow-emerald-200 shadow-lg'
              : `${style.border} ${style.bg}`
          } overflow-hidden`}
        >
          {/* Top Bar: Surah tag & Match indicator */}
          <div className="w-full flex items-center justify-between gap-1 z-10">
            <span
              className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${style.badge} truncate ${
                isMatched ? 'max-w-[80%]' : 'w-full text-center'
              }`}
            >
              {wordData.surah}
            </span>

            {isMatched && (
              <span className="flex items-center text-emerald-600 bg-emerald-100 p-0.5 rounded-full border border-emerald-300 animate-bounce flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Center: Thematic Icon & Big Arabic Quranic Word */}
          <div className="flex flex-col items-center justify-center my-auto w-full text-center px-1">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-md mb-1.5 sm:mb-2 ${style.iconBg} ${
                isMatched ? 'animate-bounce' : ''
              }`}
            >
              <WordIcon name={wordData.iconName} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            {/* Arabic Word in Quranic font with Tashkeel */}
            <h3
              className={`font-['Amiri',serif] text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ${style.text} leading-snug drop-shadow-sm`}
            >
              {wordData.word}
            </h3>
          </div>

          {/* Bottom Bar: Context meaning hint */}
          <div className="w-full text-center border-t border-slate-200/60 pt-1">
            <p className="text-[10px] sm:text-[11px] text-slate-600 truncate font-medium">
              {wordData.meaning}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
