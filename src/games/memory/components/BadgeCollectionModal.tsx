import React from 'react';
import { motion } from 'motion/react';
import { Award, Star, X, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { AchievementBadge } from '../types';

interface BadgeCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: AchievementBadge[];
}

export const BadgeCollectionModal: React.FC<BadgeCollectionModalProps> = ({
  isOpen,
  onClose,
  badges,
}) => {
  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div
      id="badges-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 relative text-slate-800"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Readex_Pro',sans-serif] text-slate-900">
                أوسمة وشارات الأبطال 🏅
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                جمعت {unlockedCount} من {badges.length} وسام
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 mb-5 overflow-hidden border border-slate-200">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
          />
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                  badge.unlocked
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-md'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {badge.unlocked ? (
                    <Award className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {badge.title}
                    </h4>
                    {badge.unlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-md hover:brightness-105 cursor-pointer text-sm"
          >
            متابعة اللعب
          </button>
        </div>
      </motion.div>
    </div>
  );
};
