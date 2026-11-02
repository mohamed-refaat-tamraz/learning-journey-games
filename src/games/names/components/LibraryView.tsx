import React, { useState } from 'react';
import { NameOfAllah } from '../types';
import { NAMES_OF_ALLAH } from '../data/namesData';
import { sounds, speakArabic } from '../utils/sound';
import { Search, Volume2, Heart, Sparkles, BookOpen, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryViewProps {
  showTashkeel: boolean;
  onPlayWithName?: (nameId: number) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ showTashkeel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'جميع الأسماء' },
    { id: 'mercy', label: 'الرحمة والمغفرة' },
    { id: 'creation', label: 'الخلق والإبداع' },
    { id: 'generosity', label: 'الرزق والعطاء' },
    { id: 'knowledge', label: 'العلم والإحاطة' },
    { id: 'power', label: 'العظمة والملك' },
    { id: 'peace', label: 'السلام والأمان' },
  ];

  const filteredNames = NAMES_OF_ALLAH.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.includes(searchTerm) ||
      item.plainName.includes(searchTerm) ||
      item.simplifiedMeaning.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-yellow-400 rounded-[32px] p-6 sm:p-8 text-white shadow-xl border-b-8 border-teal-700 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black border border-white/30">
            <BookOpen className="w-4 h-4 text-yellow-200" />
            <span>المعجم المصور الميسر</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black font-tajawal drop-shadow-sm">
            مكتبة معاني أسماء الله الحسنى
          </h2>
          <p className="text-xs md:text-sm text-teal-950 font-bold max-w-xl">
            استكشف جميع الأسماء المباركة، واستمع لنطقها ومعانيها المبسطة لنتعلم كيف نعيش بها في يومنا الجميل!
          </p>
        </div>

        <div className="bg-white/25 backdrop-blur-md rounded-3xl p-4 border-2 border-white/40 flex items-center gap-3 shadow-md">
          <span className="text-3xl">🌸</span>
          <div>
            <span className="text-xs text-teal-950 font-bold block">مجموع الأسماء</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{NAMES_OF_ALLAH.length} اسماً</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white rounded-3xl border-b-4 border-sky-300 p-5 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-sky-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            id="library-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن اسم أو كلمة من المعنى (مثال: الرحمن، يرزق، يحب)..."
            className="w-full pr-12 pl-4 py-3 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sm font-tajawal font-bold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all text-sky-950"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-sky-700 hover:text-sky-900 bg-sky-200 px-3 py-1 rounded-xl font-bold"
            >
              مسح
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-sky-600 shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-category-${cat.id}`}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-b-2 ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white border-purple-800 shadow-sm scale-105'
                  : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Names Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredNames.map((item) => {
            const isExpanded = activeCardId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[32px] border-b-8 border-sky-200 p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between gap-4 relative group"
              >
                {/* Top Name Card & Audio */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-pink-100 text-pink-900 border border-pink-200 text-xs font-black px-3 py-1 rounded-full">
                      {item.categoryLabel}
                    </span>

                    <button
                      id={`library-speak-btn-${item.id}`}
                      onClick={() => {
                        sounds.playClick();
                        speakArabic(`${item.name}، ${item.simplifiedMeaning}`);
                      }}
                      className="w-9 h-9 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-700 flex items-center justify-center transition-colors shadow-xs"
                      title="استمع للاسم والمعنى"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* The Name in Caligraphy */}
                  <div className="text-center my-3 py-3 bg-gradient-to-b from-sky-50 to-yellow-50/40 rounded-2xl border-2 border-sky-100">
                    <h3 className="text-3xl font-black font-amiri text-sky-950">
                      {showTashkeel ? item.name : item.plainName}
                    </h3>
                  </div>

                  {/* Simplified Meaning */}
                  <div className="space-y-1 mt-3">
                    <span className="text-xs font-black text-sky-900 block">
                      المعنى المبسط:
                    </span>
                    <p className="text-xs md:text-sm font-bold text-sky-950 font-tajawal leading-relaxed">
                      {item.simplifiedMeaning}
                    </p>
                  </div>
                </div>

                {/* Example and Duaa Toggle */}
                <div className="pt-3 border-t-2 border-sky-100">
                  {isExpanded ? (
                    <div className="space-y-2.5 text-xs font-bold">
                      <div className="bg-sky-50 p-3 rounded-2xl text-sky-950 border border-sky-200">
                        <strong className="block font-black text-sky-900 mb-0.5">🌟 مثال للأطفال:</strong>
                        <span>{item.childExample}</span>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-2xl text-purple-950 font-amiri font-bold text-sm flex items-center justify-between border border-purple-200">
                        <span>🤲 "{item.duaa}"</span>
                        <button
                          onClick={() => {
                            sounds.playClick();
                            speakArabic(item.duaa);
                          }}
                          className="p-1.5 rounded-lg bg-purple-200 text-purple-900 hover:bg-purple-300 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => setActiveCardId(null)}
                        className="w-full text-center text-xs text-sky-700 hover:text-sky-950 font-black py-1"
                      >
                        إخفاء التفاصيل ▲
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setActiveCardId(item.id);
                      }}
                      className="w-full py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-950 text-xs font-black transition-colors flex items-center justify-center gap-1.5 border border-orange-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                      <span>عرض المثال والدعاء ▼</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center py-12 bg-white rounded-[32px] border-b-8 border-sky-200 p-8 space-y-2">
          <span className="text-5xl">🔍</span>
          <h3 className="text-xl font-black text-sky-950">لم نجد اسماً يطابق بحثك</h3>
          <p className="text-xs md:text-sm font-bold text-sky-800">جرب كتابة كلمة أخرى مثل "الرحمن" أو "الرزق"</p>
        </div>
      )}
    </div>
  );
};
