import { useRoundTimers } from '../utils/useRoundTimers';
import React, { useState, useEffect, useCallback } from 'react';
import { QURAN_WORDS, WORD_OPPOSITES } from '../data/quranJuzAmmaData';
import { soundManager } from '../utils/soundHelper';
import { 
  RotateCcw, 
  Lightbulb, 
  Volume2, 
  Sparkles, 
  Trophy, 
  ArrowRight,
  HelpCircle 
} from 'lucide-react';

interface MemoryCardItem {
  id: string; // unique card id
  pairId: string; // id to match against
  type: 'word' | 'meaning' | 'opposite';
  text: string;
  subtext?: string;
  isFlipped: boolean;
  isMatched: boolean;
  surah?: string;
}

interface MemoryGameProps {
  onGameComplete: (scoreEarned: number, starsEarned: number) => void;
  onBack: () => void;
  showTashkeel: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  onGameComplete,
  onBack,
  showTashkeel,
}) => {
  const { schedule, clearTimers } = useRoundTimers();
  const [mode, setMode] = useState<'word_meaning' | 'word_opposite'>('word_meaning');
  const [cards, setCards] = useState<MemoryCardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(6);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintsRemaining, setHintsRemaining] = useState<number>(2);

  // Initialize deck
  const initializeGame = useCallback(() => {
    clearTimers();
    soundManager.playCardFlip();
    setSelectedCards([]);
    setMoves(0);
    setHintsRemaining(2);
    setMatches(0);
    setIsLocked(false);
    setShowHint(false);

    let newCards: MemoryCardItem[] = [];

    if (mode === 'word_meaning') {
      // Pick random words
      const shuffledWords = [...QURAN_WORDS].sort(() => 0.5 - Math.random()).slice(0, totalPairs);
      shuffledWords.forEach((w) => {
        // Card 1: Word
        newCards.push({
          id: `w-${w.id}`,
          pairId: w.id,
          type: 'word',
          text: showTashkeel ? w.word : w.wordPlain,
          subtext: `سورة ${w.surahName}`,
          surah: w.surahName,
          isFlipped: false,
          isMatched: false,
        });
        // Card 2: Meaning
        newCards.push({
          id: `m-${w.id}`,
          pairId: w.id,
          type: 'meaning',
          text: w.meaning,
          subtext: 'المعنى العربي',
          surah: w.surahName,
          isFlipped: false,
          isMatched: false,
        });
      });
    } else {
      // Pick opposite/synonym pairs
      const shuffledPairs = [...WORD_OPPOSITES].sort(() => 0.5 - Math.random()).slice(0, totalPairs);
      shuffledPairs.forEach((p) => {
        newCards.push({
          id: `p1-${p.id}`,
          pairId: p.id,
          type: 'opposite',
          text: showTashkeel ? p.word1 : p.word1Plain,
          subtext: `${p.relationship} (سورة ${p.surah1})`,
          surah: p.surah1,
          isFlipped: false,
          isMatched: false,
        });
        newCards.push({
          id: `p2-${p.id}`,
          pairId: p.id,
          type: 'opposite',
          text: showTashkeel ? p.word2 : p.word2Plain,
          subtext: `${p.relationship} (سورة ${p.surah2})`,
          surah: p.surah2,
          isFlipped: false,
          isMatched: false,
        });
      });
    }

    // Shuffle the cards
    newCards = newCards.sort(() => 0.5 - Math.random());
    setCards(newCards);
  }, [mode, totalPairs, showTashkeel, clearTimers]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle card click
  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedCards.length === 2) return;

    soundManager.playCardFlip();
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    // If it's a word card, speak it
    if (cards[index].type === 'word' || cards[index].type === 'opposite') {
      soundManager.speakArabic(cards[index].text);
    }

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      setIsLocked(true);

      const [firstIdx, secondIdx] = newSelected;
      const card1 = updatedCards[firstIdx];
      const card2 = updatedCards[secondIdx];

      if (card1.pairId === card2.pairId && card1.id !== card2.id) {
        // Matched!
        schedule(() => {
          soundManager.playSuccess();
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          setIsLocked(false);
          const nextMatches = matches + 1;
          setMatches(nextMatches);
          if (nextMatches === totalPairs) {
            const finalMoves = moves + 1;
            const earnedScore = Math.max(50, 150 - finalMoves * 5);
            const earnedStars = finalMoves <= totalPairs * 2 ? 3 : finalMoves <= totalPairs * 3 ? 2 : 1;
            schedule(() => onGameComplete(earnedScore, earnedStars), 600);
          }
        }, 500);
      } else {
        // Not matched
        schedule(() => {
          soundManager.playWrong();
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setSelectedCards([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  // Peek Hint helper
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isLocked) return;
    setHintsRemaining((prev) => prev - 1);
    setShowHint(true);
    soundManager.playCardFlip();
    schedule(() => {
      setShowHint(false);
    }, 1500);
  };

  const isGameComplete = matches === totalPairs && totalPairs > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Bar with Mode and Stats */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="العودة للقائمة الرئيسية"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-cairo flex items-center gap-2">
                <span>كروت الذاكرة القرآنية</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {matches}/{totalPairs} متطابقة
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-tajawal">طابق الكلمات القرآنية مع معانيها أو نظائرها</p>
            </div>
          </div>

          {/* Action Buttons & Counters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setMode('word_meaning')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  mode === 'word_meaning'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الكلمة والمعنى
              </button>
              <button
                onClick={() => setMode('word_opposite')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  mode === 'word_opposite'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الكلمة والنظير
              </button>
            </div>

            {/* Hint Button */}
            <button
              onClick={handleUseHint}
              disabled={hintsRemaining <= 0 || isLocked}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-colors ${
                hintsRemaining > 0
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
              title="كشف مؤقت للكروت"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>تلميح ({hintsRemaining})</span>
            </button>

            {/* Restart Button */}
            <button
              onClick={initializeGame}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors"
              title="إعادة توزيع الكروت"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة</span>
            </button>
          </div>
        </div>

        {/* Level Stats Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span>عدد المحاولات:</span>
              <strong className="text-slate-800">{moves}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span>التطابقات المتبقية:</span>
              <strong className="text-emerald-700">{totalPairs - matches}</strong>
            </span>
          </div>

          {/* Difficulty selector (6 or 8 pairs) */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">الحجم:</span>
            <button
              onClick={() => setTotalPairs(6)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                totalPairs === 6 ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              ١٢ كرت
            </button>
            <button
              onClick={() => setTotalPairs(8)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                totalPairs === 8 ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              ١٦ كرت
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-3 sm:gap-4 ${
          totalPairs === 6
            ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4'
            : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4'
        }`}
      >
        {cards.map((card, idx) => {
          const isCardRevealed = card.isFlipped || card.isMatched || showHint;

          return (
            <div
              key={card.id}
              data-pair-id={card.pairId}
              onClick={() => handleCardClick(idx)}
              className="h-32 sm:h-36 perspective-1000 cursor-pointer select-none"
            >
              <div
                className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-sm hover:shadow-md ${
                  isCardRevealed ? 'rotate-y-180' : ''
                }`}
              >
                {/* Back of Card (Hidden side - decorative Islamic ornament) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 border-2 border-amber-300/60 p-3 flex flex-col items-center justify-center text-amber-200 backface-hidden shadow-inner">
                  <div className="w-10 h-10 rounded-full border border-amber-400/40 flex items-center justify-center mb-1">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="font-quran text-xs sm:text-sm text-amber-300 font-bold">جزء عَمّ</span>
                </div>

                {/* Front of Card (Revealed side) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-2xl p-3 flex flex-col items-center justify-between rotate-y-180 backface-hidden border-2 transition-all ${
                    card.isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-md ring-2 ring-emerald-300'
                      : card.type === 'word'
                      ? 'bg-amber-50/95 border-amber-300 text-amber-950'
                      : 'bg-teal-50/95 border-teal-300 text-teal-950'
                  }`}
                >
                  {/* Top subtext & audio speaker */}
                  <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-500">
                    <span className="truncate max-w-[80px]">{card.subtext}</span>
                    {card.type !== 'meaning' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.speakArabic(card.text);
                        }}
                        className="p-1 rounded-md hover:bg-slate-200/60 text-emerald-700"
                        title="استمع للنطق"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Main Card Content */}
                  <div className="text-center my-auto px-1">
                    <p
                      className={`leading-snug font-bold ${
                        card.type === 'word' || card.type === 'opposite'
                          ? 'font-quran text-base sm:text-lg text-emerald-950'
                          : 'font-tajawal text-xs sm:text-sm text-slate-800'
                      }`}
                    >
                      {card.text}
                    </p>
                  </div>

                  {/* Bottom indicator */}
                  <div className="text-[10px] font-semibold text-slate-400">
                    {card.isMatched ? '✓ متطابقة' : card.type === 'word' ? 'كلمة قرآنية' : 'المعنى / النظير'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Win Banner if completed */}
      {isGameComplete && (
        <div className="mt-8 bg-emerald-900 text-amber-100 rounded-3xl p-6 text-center border-2 border-amber-400 shadow-xl animate-bounce">
          <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-2" />
          <h3 className="text-2xl font-bold font-cairo text-amber-200">ما شاء الله! أحسنت يا بطل!</h3>
          <p className="text-sm text-emerald-100 mt-1 font-tajawal">
            لقد أنهيت لعبة كروت الذاكرة في {moves} محاولة بنجاح باهر!
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={initializeGame}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-sm"
            >
              العب جولة جديدة
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-2xl border border-emerald-600 shadow-md transition-transform active:scale-95 text-sm"
            >
              العودة للقائمة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

