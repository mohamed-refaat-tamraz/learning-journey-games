import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JuzAmmaWord } from '../types';
import { WordIcon } from './WordIcon';
import { X, BookOpen } from 'lucide-react';

interface WordMatchToastProps {
  word: JuzAmmaWord | null;
  onClose: () => void;
}

export const WordMatchToast: React.FC<WordMatchToastProps> = ({ word, onClose }) => {
  if (!word) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="pointer-events-auto max-w-md w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-emerald-400 ring-4 ring-emerald-100/70 text-slate-800"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <WordIcon name={word.iconName} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✨ أحسنت يا بطل! متطابقة!
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{word.surah}</span>
                </div>
                <h4 className="font-['Amiri',serif] text-2xl font-bold text-emerald-950 mt-0.5">
                  {word.word}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Ayah Snippet & Meaning */}
          <div className="mt-2.5 pt-2 border-t border-emerald-100 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-800 font-['Amiri',serif] text-sm bg-emerald-50/70 px-2.5 py-1 rounded-lg">
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
              <span className="truncate">﴿{word.ayahText}﴾</span>
            </div>
            <p className="text-slate-600 font-medium px-1">
              💡 <span className="font-bold text-slate-700">المعنى:</span> {word.meaning}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
