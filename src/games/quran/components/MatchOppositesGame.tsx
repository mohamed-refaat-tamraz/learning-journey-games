import { useRoundTimers } from '../utils/useRoundTimers';
import React, { useState, useEffect, useCallback } from 'react';
import { WORD_OPPOSITES } from '../data/quranJuzAmmaData';
import { WordOppositePair } from '../types';
import { soundManager } from '../utils/soundHelper';
import { 
  ArrowRight, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  Trophy, 
  Info 
} from 'lucide-react';

interface MatchOppositesGameProps {
  onGameComplete: (scoreEarned: number, starsEarned: number) => void;
  onBack: () => void;
  showTashkeel: boolean;
}

const OPPOSITE_COLORS = [
  'bg-amber-100 border-amber-400 text-amber-950',
  'bg-emerald-100 border-emerald-400 text-emerald-950',
  'bg-sky-100 border-sky-400 text-sky-950',
  'bg-purple-100 border-purple-400 text-purple-950',
];

export const MatchOppositesGame: React.FC<MatchOppositesGameProps> = ({
  onGameComplete,
  onBack,
  showTashkeel,
}) => {
  const { schedule, clearTimers } = useRoundTimers();
  const [filterRelation, setFilterRelation] = useState<string>('all');
  const [round, setRound] = useState<number>(1);
  const [totalRounds] = useState<number>(4);
  const [currentPairs, setCurrentPairs] = useState<WordOppositePair[]>([]);
  const [shuffledWord2, setShuffledWord2] = useState<{ id: string; word: string; wordPlain: string; surah: string }[]>([]);

  const [selectedWord1Id, setSelectedWord1Id] = useState<string | null>(null);
  const [selectedWord2Id, setSelectedWord2Id] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, number>>({});
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);

  // Setup round
  const startNewRound = useCallback(() => {
    clearTimers();
    soundManager.playCardFlip();
    setSelectedWord1Id(null);
    setSelectedWord2Id(null);
    setMatchedPairs({});
    setIsRoundFinished(false);

    let list = WORD_OPPOSITES;
    if (filterRelation !== 'all') {
      list = WORD_OPPOSITES.filter((p) => p.relationship.includes(filterRelation));
    }

    const picked = [...list].sort(() => 0.5 - Math.random()).slice(0, 4);
    setCurrentPairs(picked);

    const randomized2 = picked
      .map((p) => ({ id: p.id, word: p.word2, wordPlain: p.word2Plain, surah: p.surah2 }))
      .sort(() => 0.5 - Math.random());
    setShuffledWord2(randomized2);
  }, [filterRelation, clearTimers]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleSelectWord1 = (pair: WordOppositePair) => {
    if (matchedPairs[pair.id] !== undefined) return;
    soundManager.playCardFlip();
    soundManager.speakArabic(pair.word1);
    setSelectedWord1Id(pair.id);

    if (selectedWord2Id) {
      checkMatch(pair.id, selectedWord2Id);
    }
  };

  const handleSelectWord2 = (item: { id: string; word: string; wordPlain: string }) => {
    if (matchedPairs[item.id] !== undefined) return;
    soundManager.playCardFlip();
    soundManager.speakArabic(item.word);
    setSelectedWord2Id(item.id);

    if (selectedWord1Id) {
      checkMatch(selectedWord1Id, item.id);
    }
  };

  const checkMatch = (id1: string, id2: string) => {
    if (id1 === id2) {
      // Correct pair!
      soundManager.playSuccess();
      const colorIdx = Object.keys(matchedPairs).length % OPPOSITE_COLORS.length;
      const nextMatched = { ...matchedPairs, [id1]: colorIdx };
      setMatchedPairs(nextMatched);
      setSelectedWord1Id(null);
      setSelectedWord2Id(null);

      if (Object.keys(nextMatched).length === currentPairs.length) {
        setIsRoundFinished(true);
        soundManager.playVictory();
        if (round >= totalRounds) {
          const score = Math.max(80, 200 - errorsCount * 10);
          const stars = errorsCount === 0 ? 3 : errorsCount <= 2 ? 2 : 1;
          schedule(() => {
            onGameComplete(score, stars);
          }, 800);
        }
      }
    } else {
      soundManager.playWrong();
      setErrorsCount((prev) => prev + 1);
      schedule(() => {
        setSelectedWord1Id(null);
        setSelectedWord2Id(null);
      }, 600);
    }
  };

  const handleNextRound = () => {
    if (round < totalRounds) {
      setRound((prev) => prev + 1);
      startNewRound();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Container */}
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
                <span>توصيل الكلمة والنظير والمضاد</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  الجولة {round} من {totalRounds}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-tajawal">
                طابق بين الكلمة القرآنية وعكسها (مضادها) أو نظيرها المقترن بها في جزء عم
              </p>
            </div>
          </div>

          {/* Relation Filter */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={filterRelation}
              onChange={(e) => {
                setFilterRelation(e.target.value);
                setRound(1);
              }}
              className="px-3 py-2 rounded-2xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">جميع الأنواع (أضداد، نظائر، مقترنات)</option>
              <option value="مضاد">الأضداد والعكس فقط</option>
              <option value="مرادف">النظائر والمرادفات فقط</option>
              <option value="زوج">الأزواج المقترنة فقط</option>
            </select>

            <button
              onClick={startNewRound}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors"
              title="إعادة المحاولة"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة</span>
            </button>
          </div>
        </div>

        {/* Progress counters */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            التوصيلات المنجزة: <strong className="text-amber-800">{Object.keys(matchedPairs).length}</strong> من {currentPairs.length}
          </span>
          <span>
            الأخطاء: <strong className="text-rose-600">{errorsCount}</strong>
          </span>
        </div>
      </div>

      {/* Opposites 2-Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Column 1: Word 1 */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-700 font-cairo flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>الكلمة القرآنية</span>
            </span>
            <span className="text-xs text-slate-400">انقر للاختيار</span>
          </div>

          {currentPairs.map((pair) => {
            const isMatched = matchedPairs[pair.id] !== undefined;
            const isSelected = selectedWord1Id === pair.id;
            const colorClass = isMatched ? OPPOSITE_COLORS[matchedPairs[pair.id]] : '';

            return (
              <div
                key={`p1-${pair.id}`}
                onClick={() => handleSelectWord1(pair)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-xs select-none ${
                  isMatched
                    ? `${colorClass} shadow-sm opacity-90`
                    : isSelected
                    ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    {isMatched ? '✓' : '⚖️'}
                  </div>
                  <div>
                    <h3 className="font-quran font-bold text-xl sm:text-2xl text-slate-900">
                      {showTashkeel ? pair.word1 : pair.word1Plain}
                    </h3>
                    <span className="text-xs text-slate-500 font-tajawal">
                      سورة {pair.surah1} ({pair.relationship})
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.speakArabic(pair.word1);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-amber-200 text-amber-900"
                  title="استمع"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Column 2: Word 2 (Opposite / Counterpart) */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-700 font-cairo flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>المقابل / النظير / المضاد</span>
            </span>
            <span className="text-xs text-slate-400">انقر للتوصيل</span>
          </div>

          {shuffledWord2.map((item) => {
            const isMatched = matchedPairs[item.id] !== undefined;
            const isSelected = selectedWord2Id === item.id;
            const colorClass = isMatched ? OPPOSITE_COLORS[matchedPairs[item.id]] : '';

            return (
              <div
                key={`p2-${item.id}`}
                onClick={() => handleSelectWord2(item)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-xs select-none ${
                  isMatched
                    ? `${colorClass} shadow-sm opacity-90`
                    : isSelected
                    ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                    {isMatched ? '✓' : '🔄'}
                  </div>
                  <div>
                    <h3 className="font-quran font-bold text-xl sm:text-2xl text-slate-900">
                      {showTashkeel ? item.word : item.wordPlain}
                    </h3>
                    <span className="text-xs text-slate-500 font-tajawal">
                      {item.surah.includes('تفسير') ? 'تفسير وبيان' : `سورة ${item.surah}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.speakArabic(item.word);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-200 text-emerald-900"
                  title="استمع"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* Explanation Banner when round is solved */}
      {isRoundFinished && (
        <div className="mt-8 bg-amber-950 text-amber-50 rounded-3xl p-6 border-2 border-amber-400 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-2xl shadow-md">
                ⚖️
              </div>
              <div>
                <h3 className="text-xl font-bold font-cairo text-amber-200">
                  {round < totalRounds ? 'بارك الله فيك! أحسنت التوصيل' : 'ما شاء الله! أتممت جميع جولات الأضداد'}
                </h3>
                <p className="text-xs text-amber-200/80 font-tajawal">
                  تأمل البلاغة القرآنية في اقتران هذه المفردات وأضدادها:
                </p>
              </div>
            </div>

            {round < totalRounds ? (
              <button
                onClick={handleNextRound}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-sm shrink-0"
              >
                الجولة التالية ({round + 1}/{totalRounds})
              </button>
            ) : (
              <button
                onClick={onBack}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-sm shrink-0"
              >
                العودة للألعاب
              </button>
            )}
          </div>

          {/* Explanation cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {currentPairs.map((p) => (
              <div key={p.id} className="bg-amber-900/60 p-3.5 rounded-2xl border border-amber-700/60">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>{p.word1} ↔ {p.word2}</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 font-tajawal leading-relaxed">
                  {p.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

