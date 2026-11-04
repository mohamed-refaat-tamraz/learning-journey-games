import React, { useState, useMemo } from 'react';
import { QURAN_WORDS, JUZ_AMMA_SURAHS, removeTashkeel } from '../data/quranJuzAmmaData';
import { QuranWord } from '../types';
import { soundManager } from '../utils/soundHelper';
import { 
  X, 
  Search, 
  Volume2, 
  BookOpen, 
  Sparkles, 
  Filter, 
  ChevronDown 
} from 'lucide-react';

interface SurahDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  showTashkeel: boolean;
}

export const SurahDictionaryModal: React.FC<SurahDictionaryModalProps> = ({
  isOpen,
  onClose,
  showTashkeel,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSurahFilter, setSelectedSurahFilter] = useState<string>('all');

  // Filtered list of words
  const filteredWords = useMemo(() => {
    return QURAN_WORDS.filter((w) => {
      // Surah filter
      if (selectedSurahFilter !== 'all' && w.surahName !== selectedSurahFilter) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const cleanTerm = removeTashkeel(searchTerm.trim().toLowerCase());
        const matchWord = removeTashkeel(w.word).toLowerCase().includes(cleanTerm);
        const matchMeaning = w.meaning.toLowerCase().includes(cleanTerm);
        const matchAyah = removeTashkeel(w.ayahText).toLowerCase().includes(cleanTerm);
        const matchSurah = w.surahName.toLowerCase().includes(cleanTerm);
        return matchWord || matchMeaning || matchAyah || matchSurah;
      }
      return true;
    });
  }, [searchTerm, selectedSurahFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col border-2 border-emerald-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-amber-50 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-cairo text-amber-200">
                معجم مفردات جزء عمّ القرآني
              </h2>
              <p className="text-xs text-emerald-200 font-tajawal">
                استكشف الكلمات القرآنية ومعانيها وسياقها في الآيات الكريمة ({filteredWords.length} كلمة متاحة)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/80 text-amber-200 transition-colors"
            title="إغلاق المعجم"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-amber-50/50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن كلمة، معنى، أو سورة..."
              className="w-full pr-10 pl-4 py-2.5 bg-white rounded-2xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500 font-tajawal"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                مسح
              </button>
            )}
          </div>

          {/* Surah Filter dropdown */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedSurahFilter}
              onChange={(e) => setSelectedSurahFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-white rounded-2xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">كل السور المتاحة</option>
              {JUZ_AMMA_SURAHS.map((s) => (
                <option key={s.number} value={s.name}>
                  سورة {s.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Word Cards Grid / Scrollable List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-islamic-pattern">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-tajawal">
              <p className="text-base font-bold">لم نجد مفردات مطابقة للبحث</p>
              <p className="text-xs text-slate-400 mt-1">جرب البحث بكلمة أخرى أو اختر "كل السور"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header with Surah Badge and Audio Speaker */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                        سورة {word.surahName} (الآية {word.ayahNumber})
                      </span>
                      <button
                        onClick={() => soundManager.speakArabic(word.word)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-emerald-800 transition-colors"
                        title="استمع للفظ الكلمة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Word Title */}
                    <h3 className="font-quran font-bold text-2xl sm:text-3xl text-emerald-950 mb-2">
                      {showTashkeel ? word.word : word.wordPlain}
                    </h3>

                    {/* Meaning */}
                    <p className="font-tajawal text-sm text-slate-700 font-semibold mb-3 leading-relaxed">
                      {word.meaning}
                    </p>
                  </div>

                  {/* Ayah Context */}
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 mt-2 flex items-center justify-between gap-2">
                    <p className="font-quran text-sm text-amber-950">
                      « {word.ayahText} »
                    </p>
                    <button
                      onClick={() => soundManager.speakArabic(word.ayahText)}
                      className="p-1 text-amber-800 hover:text-amber-950 shrink-0"
                      title="استمع للآية"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
          >
            إغلاق المعجم
          </button>
        </div>

      </div>
    </div>
  );
};

