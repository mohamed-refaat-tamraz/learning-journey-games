import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, BookOpen, Sparkles } from 'lucide-react';
import { JUZ_AMMA_VOCABULARY } from '../data/juzAmmaWords';
import { WordIcon } from './WordIcon';
import { JuzAmmaWord, GameCategory } from '../types';

interface VocabularyDictionaryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWordToPlay?: (word: JuzAmmaWord) => void;
}

export const VocabularyDictionary: React.FC<VocabularyDictionaryProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'الكل (جميع المفردات)' },
    { id: 'short_surahs', label: '📖 قصار السور' },
    { id: 'nature_universe', label: '🌍 الكون والطبيعة' },
    { id: 'blessings_stories', label: '🍇 النعم والقصص' },
  ];

  const filteredWords = JUZ_AMMA_VOCABULARY.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.cleanWord.includes(searchQuery.trim()) ||
      item.word.includes(searchQuery.trim()) ||
      item.surah.includes(searchQuery.trim()) ||
      item.meaning.includes(searchQuery.trim());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      id="vocabulary-dictionary-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="bg-white rounded-3xl max-w-3xl w-full h-[90vh] flex flex-col shadow-2xl border-4 border-emerald-300 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
              <BookOpen className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Readex_Pro',sans-serif]">
                معجم مفردات جزء عم المصور 📚
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                اكتشف معاني مفردات القرآن الكريم وسياقها في الآيات الكريمة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كلمة أو سورة أو معنى..."
              className="w-full pr-10 pl-4 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as GameCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Words Grid View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-amber-50/30">
          {filteredWords.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <Sparkles className="w-12 h-12 text-slate-300 mb-2" />
              <p className="font-bold text-slate-600">لم يتم العثور على نتائج للبحث</p>
              <p className="text-xs text-slate-400 mt-1">جرب البحث بكلمة أخرى أو مسح البحث</p>
            </div>
          ) : (
            filteredWords.map((item) => {
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-4 border-2 border-slate-200/90 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                        <WordIcon name={item.iconName} className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {item.surah}
                        </span>
                        <h3 className="font-['Amiri',serif] text-2xl font-bold text-slate-900 mt-0.5">
                          {item.word}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Quranic Ayah Quote */}
                  <div className="mt-3 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 text-amber-950 font-['Amiri',serif] text-sm">
                    <span className="font-bold text-amber-800 text-xs block mb-0.5">الآية الكريمة:</span>
                    <span className="leading-relaxed">﴿{item.ayahText}﴾</span>
                  </div>

                  {/* Meaning for Kids */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-slate-800">المعنى للأطفال: </span>
                    <span>{item.meaning}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-slate-200 text-center text-xs font-semibold text-slate-500 flex justify-between items-center px-6">
          <span>إجمالي المفردات في المعجم: {filteredWords.length} كلمة</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            العودة للعبة
          </button>
        </div>
      </motion.div>
    </div>
  );
};
