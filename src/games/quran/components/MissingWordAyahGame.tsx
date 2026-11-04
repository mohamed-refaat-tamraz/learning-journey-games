import React, { useState, useEffect, useCallback } from 'react';
import { MISSING_AYAH_DATA } from '../data/quranJuzAmmaData';
import { MissingAyahQuestion } from '../types';
import { soundManager } from '../utils/soundHelper';
import { 
  ArrowRight, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  BookOpen,
  HelpCircle 
} from 'lucide-react';

interface MissingWordAyahGameProps {
  onGameComplete: (scoreEarned: number, starsEarned: number) => void;
  onBack: () => void;
  showTashkeel: boolean;
}

export const MissingWordAyahGame: React.FC<MissingWordAyahGameProps> = ({
  onGameComplete,
  onBack,
  showTashkeel,
}) => {
  const [questions, setQuestions] = useState<MissingAyahQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(3);

  const initGame = useCallback(() => {
    soundManager.playCardFlip();
    const shuffled = [...MISSING_AYAH_DATA].sort(() => 0.5 - Math.random()).slice(0, 8);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedWord(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setStars(3);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (word: string) => {
    if (isAnswered) return;
    setSelectedWord(word);
    setIsAnswered(true);

    const correct = word === currentQ.missingWord;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playSuccess();
      setScore((prev) => prev + 25);
      soundManager.speakArabic(currentQ.fullAyah);
    } else {
      soundManager.playWrong();
      setStars((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNext = () => {
    soundManager.playCardFlip();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedWord(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      soundManager.playVictory();
      onGameComplete(score, stars);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between gap-4">
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
                <span>الكلمة الناقصة في الآية</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  الآية {currentIndex + 1} من {questions.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-tajawal">
                اختر الكلمة القرآنية الصحيحة لملء الفراغ وإكمال الآية الكريمة
              </p>
            </div>
          </div>

          <button
            onClick={initGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors"
            title="إعادة البدء"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-rose-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Ayah Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-md">
        
        {/* Surah Reference Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-bold text-xs">
            سورة {currentQ.surahName} (الآية {currentQ.ayahNumber})
          </span>

          <span className="text-xs text-slate-400 font-semibold">
            جزء عمّ المبارك
          </span>
        </div>

        {/* Verse Display with Slot */}
        <div className="my-6 py-8 px-5 bg-gradient-to-br from-rose-50/50 via-amber-50/30 to-emerald-50/40 rounded-3xl border border-rose-100 text-center flex flex-col items-center justify-center">
          <p className="font-quran text-2xl sm:text-3xl text-slate-900 leading-relaxed max-w-xl">
            {currentQ.ayahBefore}{' '}
            <span
              className={`inline-block px-4 py-1 mx-1.5 rounded-2xl border-2 font-bold transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900 scale-105'
                    : 'bg-rose-100 border-rose-500 text-rose-900'
                  : 'bg-amber-100/80 border-dashed border-amber-400 text-amber-900 min-w-[100px]'
              }`}
            >
              {isAnswered ? currentQ.missingWord : '........'}
            </span>{' '}
            {currentQ.ayahAfter}
          </p>

          {/* Meaning / Tafsir clue */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 w-full max-w-md">
            <span className="text-xs text-slate-500 font-tajawal">
              دلالة الكلمة ومعناها: <strong className="text-slate-800">{currentQ.meaning}</strong>
            </span>
          </div>
        </div>

        {/* Word Options Grid */}
        <div className="text-center mb-3">
          <span className="text-xs font-bold text-slate-500">اختر الكلمة المناسبة:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
          {currentQ.options.map((word) => {
            const isThisSelected = selectedWord === word;
            const isThisCorrect = word === currentQ.missingWord;

            let btnStyle = 'bg-slate-50 hover:bg-rose-50 border-slate-300 text-slate-800';

            if (isAnswered) {
              if (isThisCorrect) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-200 scale-102';
              } else if (isThisSelected && !isCorrect) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return (
              <div key={word} className={`rounded-2xl border-2 font-quran text-xl sm:text-2xl font-bold transition-all shadow-xs flex items-center justify-between ${btnStyle}`}>
                <button onClick={() => handleSelectOption(word)} disabled={isAnswered} className="flex-1 py-3.5 px-4 text-start rounded-2xl">
                  {word}
                </button>
                <button onClick={() => soundManager.speakArabic(word)} className="p-2 me-2 rounded-lg hover:bg-black/10 transition-colors" title="استمع للكلمة">
                  <Volume2 className="w-4 h-4 opacity-80" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions & Next Question */}
        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              {isCorrect ? (
                <span className="text-emerald-700 flex items-center gap-1.5 font-cairo">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  أحسنت! إجابة صحيحة ومباركة
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1.5 font-cairo">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  الكلمة الصحيحة هي: « {currentQ.missingWord} »
                </span>
              )}
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-base flex items-center gap-2"
            >
              <span>{currentIndex + 1 < questions.length ? 'الآية التالية' : 'عرض النتيجة'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

