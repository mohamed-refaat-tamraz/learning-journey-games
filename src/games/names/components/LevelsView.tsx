import React from 'react';
import { LevelInfo } from '../types';
import { LEVELS, NAMES_OF_ALLAH } from '../data/namesData';
import { sounds } from '../utils/sound';
import { Trophy, Star, Lock, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LevelsViewProps {
  currentStars: number;
  completedLevels: number[];
  activeLevel: number;
  onSelectLevel: (levelId: number) => void;
  showTashkeel: boolean;
}

export const LevelsView: React.FC<LevelsViewProps> = ({
  currentStars,
  completedLevels,
  activeLevel,
  onSelectLevel,
  showTashkeel,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-[32px] p-6 sm:p-8 text-white shadow-xl border-b-8 border-purple-800 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>رحلة الأبطال التعليمية</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black font-tajawal drop-shadow-sm">
            رحلة مع أسماء الله الحسنى
          </h2>
          <p className="text-xs md:text-sm text-pink-100 max-w-lg font-bold">
            اجمع النجوم من خلال الإجابات الصحيحة لفتح المراحل الجديدة والوصول إلى وسام بطل الأسماء الحسنى!
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-3xl p-4 sm:p-5 flex items-center gap-3 shrink-0 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-black text-3xl shadow-md border-2 border-white">
            ⭐
          </div>
          <div>
            <span className="text-xs text-white/90 font-bold block">رصيدك الحالي</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{currentStars} نجمة</span>
          </div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {LEVELS.map((level) => {
          const isUnlocked = currentStars >= level.starsRequired;
          const isCompleted = completedLevels.includes(level.id);
          const isCurrent = activeLevel === level.id;
          const levelNames = NAMES_OF_ALLAH.filter(n => level.nameIds.includes(n.id));

          return (
            <motion.div
              key={level.id}
              whileHover={{ y: isUnlocked ? -4 : 0 }}
              className={`relative rounded-[32px] p-6 border-b-8 transition-all flex flex-col justify-between gap-4 shadow-lg ${
                isCurrent 
                  ? 'bg-white border-emerald-500 ring-4 ring-emerald-300'
                  : isUnlocked
                  ? 'bg-white border-sky-300 hover:border-sky-400'
                  : 'bg-slate-100 border-slate-300 opacity-80'
              }`}
            >
              <div>
                {/* Level Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-3 rounded-2xl bg-sky-100 border-2 border-sky-200 shadow-inner">
                      {level.icon}
                    </span>
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-sky-950 font-tajawal">
                        {level.title}
                      </h3>
                      <p className="text-xs text-sky-800 font-bold">
                        {level.subtitle}
                      </p>
                    </div>
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-black shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتمل</span>
                    </span>
                  ) : !isUnlocked ? (
                    <span className="flex items-center gap-1 bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full font-black">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{level.starsRequired} ⭐</span>
                    </span>
                  ) : null}
                </div>

                {/* Level Sample Names Pills */}
                <div className="mt-3">
                  <span className="text-xs font-black text-sky-900 block mb-2">
                    الأسماء في هذا المستوى:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {levelNames.map(n => (
                      <span
                        key={n.id}
                        className="bg-sky-50 border border-sky-200 text-sky-950 text-xs px-2.5 py-1 rounded-xl font-amiri font-black"
                      >
                        {showTashkeel ? n.name : n.plainName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t-2 border-sky-100 flex items-center justify-between">
                <div className="text-xs text-sky-800 font-black">
                  {level.nameIds.length} أسماء مباركة
                </div>

                {isUnlocked ? (
                  <button
                    id={`play-level-btn-${level.id}`}
                    onClick={() => {
                      sounds.playClick();
                      onSelectLevel(level.id);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all shadow-md border-b-4 ${
                      isCurrent
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700'
                        : 'bg-orange-500 hover:bg-orange-600 text-white border-orange-700'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isCurrent ? 'تابع اللعب الآن' : 'ابدأ هذا المستوى'}</span>
                  </button>
                ) : (
                  <div className="text-xs font-black text-slate-500 flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>تحتاج {level.starsRequired - currentStars} نجوم إضافية</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
