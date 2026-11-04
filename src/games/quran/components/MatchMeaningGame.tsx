import { useRoundTimers } from '../utils/useRoundTimers';
import React, { useState, useEffect, useCallback } from 'react';
import { QURAN_WORDS, JUZ_AMMA_SURAHS } from '../data/quranJuzAmmaData';
import { QuranWord } from '../types';
import { soundManager } from '../utils/soundHelper';
import { 
  ArrowRight, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Trophy, 
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface MatchMeaningGameProps {
  onGameComplete: (scoreEarned: number, starsEarned: number) => void;
  onBack: () => void;
  showTashkeel: boolean;
}

const PAIR_COLORS = [
  'bg-emerald-100 border-emerald-400 text-emerald-950',
  'bg-amber-100 border-amber-400 text-amber-950',
  'bg-sky-100 border-sky-400 text-sky-950',
  'bg-indigo-100 border-indigo-400 text-indigo-950',
  'bg-rose-100 border-rose-400 text-rose-950',
];

export const MatchMeaningGame: React.FC<MatchMeaningGameProps> = ({
  onGameComplete,
  onBack,
  showTashkeel,
}) => {
  const { schedule, clearTimers } = useRoundTimers();
  const [selectedSurah, setSelectedSurah] = useState<string>('all');
  const [currentRoundWords, setCurrentRoundWords] = useState<QuranWord[]>([]);
  const [shuffledMeanings, setShuffledMeanings] = useState<{ id: string; meaning: string }[]>([]);
  
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null);
  
  const [matchedPairs, setMatchedPairs] = useState<Record<string, number>>({}); // wordId -> color index
  const [round, setRound] = useState<number>(1);
  const [totalRounds] = useState<number>(5);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);

  // Load round data
  const startNewRound = useCallback(() => {
    clearTimers();
    soundManager.playCardFlip();
    setSelectedWordId(null);
    setSelectedMeaningId(null);
    setMatchedPairs({});
    setIsRoundFinished(false);

    let filtered = QURAN_WORDS;
    if (selectedSurah !== 'all') {
      filtered = QURAN_WORDS.filter((w) => w.surahName === selectedSurah);
      if (filtered.length < 4) {
        filtered = QURAN_WORDS;
      }
    }

    // Pick 4 words
    const picked = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 4);
    setCurrentRoundWords(picked);

    // Shuffle meanings
    const meanings = picked.map((w) => ({ id: w.id, meaning: w.meaning })).sort(() => 0.5 - Math.random());
    setShuffledMeanings(meanings);
  }, [selectedSurah, clearTimers]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Handle word selection
  const handleSelectWord = (word: QuranWord) => {
    if (matchedPairs[word.id] !== undefined) return; // already matched
    soundManager.playCardFlip();
    soundManager.speakArabic(word.word);
    setSelectedWordId(word.id);

    if (selectedMeaningId) {
      checkMatch(word.id, selectedMeaningId);
    }
  };

  // Handle meaning selection
  const handleSelectMeaning = (item: { id: string; meaning: string }) => {
    if (Object.keys(matchedPairs).includes(item.id)) return; // already matched
    soundManager.playCardFlip();
    setSelectedMeaningId(item.id);

    if (selectedWordId) {
      checkMatch(selectedWordId, item.id);
    }
  };

  // Validate match
  const checkMatch = (wordId: string, meaningId: string) => {
    if (wordId === meaningId) {
      // Correct match!
      soundManager.playSuccess();
      const colorIdx = Object.keys(matchedPairs).length % PAIR_COLORS.length;
      const nextMatched = { ...matchedPairs, [wordId]: colorIdx };
      setMatchedPairs(nextMatched);
      setSelectedWordId(null);
      setSelectedMeaningId(null);

      // Check if all 4 are matched
      if (Object.keys(nextMatched).length === currentRoundWords.length) {
        setIsRoundFinished(true);
        soundManager.playVictory();
        if (round >= totalRounds) {
          const score = Math.max(80, 200 - errorsCount * 10);
          const stars = errorsCount === 0 ? 3 : errorsCount <= 3 ? 2 : 1;
          schedule(() => {
            onGameComplete(score, stars);
          }, 800);
        }
      }
    } else {
      // Wrong match
      soundManager.playWrong();
      setErrorsCount((prev) => prev + 1);
      schedule(() => {
        setSelectedWordId(null);
        setSelectedMeaningId(null);
      }, 600);
    }
  };

  // Next round handler
  const handleNextRound = () => {
    if (round < totalRounds) {
      setRound((prev) => prev + 1);
      startNewRound();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="العودة"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-cairo flex items-center gap-2">
                <span>توصيل المفردات بالمعنى</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  الجولة {round} من {totalRounds}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-tajawal">
                انقر على الكلمة القرآنية ثم انقر على معناها المناسب لتوصيلهما معاً
              </p>
            </div>
          </div>

          {/* Controls & Filter */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={selectedSurah}
              onChange={(e) => {
                setSelectedSurah(e.target.value);
                setRound(1);
              }}
              className="px-3 py-2 rounded-2xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">جميع سور جزء عم</option>
              {JUZ_AMMA_SURAHS.slice(0, 15).map((s) => (
                <option key={s.number} value={s.name}>
                  سورة {s.name}
                </option>
              ))}
            </select>

            <button
              onClick={startNewRound}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors"
              title="إعادة خلط الجولة"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            تم توصيل: <strong className="text-teal-700">{Object.keys(matchedPairs).length}</strong> من{' '}
            {currentRoundWords.length}
          </span>
          <span>
            الأخطاء: <strong className="text-rose-600">{errorsCount}</strong>
          </span>
        </div>
      </div>

      {/* Matching Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Right Column: Quranic Words */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-700 font-cairo flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>الكلمات القرآنية (جزء عم)</span>
            </span>
            <span className="text-xs text-slate-400">انقر للاستماع والتحديد</span>
          </div>

          {currentRoundWords.map((item) => {
            const isMatched = matchedPairs[item.id] !== undefined;
            const isSelected = selectedWordId === item.id;
            const colorClass = isMatched ? PAIR_COLORS[matchedPairs[item.id]] : '';

            return (
              <div
                key={`word-${item.id}`}
                onClick={() => handleSelectWord(item)}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-xs select-none ${
                  isMatched
                    ? `${colorClass} shadow-sm opacity-90`
                    : isSelected
                    ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    {isMatched ? '✓' : '📖'}
                  </div>
                  <div>
                    <h3 className="font-quran font-bold text-xl sm:text-2xl text-slate-900">
                      {showTashkeel ? item.word : item.wordPlain}
                    </h3>
                    <span className="text-xs text-slate-500 font-tajawal">
                      سورة {item.surahName} (الآية {item.ayahNumber})
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.speakArabic(item.word);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-amber-200 text-emerald-800 transition-colors"
                  title="استمع للفظ الكلمة"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Left Column: Meanings */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-700 font-cairo flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-500" />
              <span>المعاني والتفسير المبسط</span>
            </span>
            <span className="text-xs text-slate-400">انقر للتوصيل</span>
          </div>

          {shuffledMeanings.map((item) => {
            const isMatched = matchedPairs[item.id] !== undefined;
            const isSelected = selectedMeaningId === item.id;
            const colorClass = isMatched ? PAIR_COLORS[matchedPairs[item.id]] : '';

            return (
              <div
                key={`meaning-${item.id}`}
                onClick={() => handleSelectMeaning(item)}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-xs select-none ${
                  isMatched
                    ? `${colorClass} shadow-sm opacity-90`
                    : isSelected
                    ? 'bg-teal-100 border-teal-500 ring-4 ring-teal-300 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold text-xs shrink-0">
                    {isMatched ? '✓' : '💡'}
                  </div>
                  <p className="font-tajawal text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                    {item.meaning}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Round Completion & Ayah Tafsir Spotlight */}
      {isRoundFinished && (
        <div className="mt-8 bg-teal-900 text-white rounded-3xl p-6 border-2 border-teal-300 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-2xl shadow-md">
                ★
              </div>
              <div>
                <h3 className="text-xl font-bold font-cairo text-amber-200">
                  {round < totalRounds ? 'أحسنت! تم توصيل جميع الكلمات' : 'ما شاء الله! أتممت جميع الجولات'}
                </h3>
                <p className="text-xs text-teal-100 font-tajawal">
                  راجع الآيات الكريمة لهذه الكلمات لترسيخ الحفظ والمعنى:
                </p>
              </div>
            </div>

            {round < totalRounds ? (
              <button
                onClick={handleNextRound}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-teal-950 font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-sm shrink-0"
              >
                الجولة التالية ({round + 1}/{totalRounds})
              </button>
            ) : (
              <button
                onClick={onBack}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-teal-950 font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-sm shrink-0"
              >
                العودة لقائمة الألعاب
              </button>
            )}
          </div>

          {/* Ayah Context Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {currentRoundWords.map((w) => (
              <div key={w.id} className="bg-teal-950/60 p-3.5 rounded-2xl border border-teal-700/60">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                  <span>سورة {w.surahName} (الآية {w.ayahNumber})</span>
                  <button
                    onClick={() => soundManager.speakArabic(w.ayahText)}
                    className="p-1 rounded-md hover:bg-teal-800 text-amber-200"
                    title="استمع للآية"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-quran text-sm sm:text-base text-teal-50">
                  « {w.ayahText} »
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

