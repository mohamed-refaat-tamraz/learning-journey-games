import React, { useState, useEffect, useCallback } from 'react';
import { MISSING_LETTER_DATA } from '../data/quranJuzAmmaData';
import { MissingLetterQuestion } from '../types';
import { soundManager } from '../utils/soundHelper';
import { 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Sparkles,
  HelpCircle 
} from 'lucide-react';

interface MissingLetterGameProps {
  onGameComplete: (scoreEarned: number, starsEarned: number) => void;
  onBack: () => void;
  showTashkeel: boolean;
}

export const MissingLetterGame: React.FC<MissingLetterGameProps> = ({
  onGameComplete,
  onBack,
  showTashkeel,
}) => {
  const [questions, setQuestions] = useState<MissingLetterQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(3);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Initialize questions
  const initGame = useCallback(() => {
    soundManager.playCardFlip();
    const shuffled = [...MISSING_LETTER_DATA].sort(() => 0.5 - Math.random()).slice(0, 8);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedLetter(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setStars(3);
    setShowHint(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSelectLetter = (letter: string) => {
    if (isAnswered) return;
    setSelectedLetter(letter);
    setIsAnswered(true);

    const correct = letter === currentQ.correctLetter;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playSuccess();
      setScore((prev) => prev + 25);
    } else {
      soundManager.playWrong();
      setStars((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNext = () => {
    soundManager.playCardFlip();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedLetter(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Game completed
      soundManager.playVictory();
      onGameComplete(score, stars);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top Header Navigation */}
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
                <span>الحرف الناقص في الكلمة</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  السؤال {currentIndex + 1} من {questions.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-tajawal">
                اختر الحرف الصحيح لإكمال الكلمة القرآنية المباركة
              </p>
            </div>
          </div>

          <button
            onClick={initGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors"
            title="إعادة المحاولة"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-md">
        
        {/* Surah & Ayah badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs">
            سورة {currentQ.surahName} (الآية {currentQ.ayahNumber})
          </span>

          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>تلميح</span>
          </button>
        </div>

        {/* Big Word Display with Missing Slot */}
        <div className="my-6 py-6 px-4 bg-gradient-to-br from-indigo-50/60 via-slate-50 to-amber-50/60 rounded-3xl border border-indigo-100 text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-3">
            <span data-question-word className="font-quran text-4xl sm:text-5xl font-bold tracking-wide text-slate-900 leading-normal">
              {isAnswered ? (
                <span className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>
                  {showTashkeel ? currentQ.fullWord : currentQ.fullWordPlain}
                </span>
              ) : (
                currentQ.displayWord
              )}
            </span>

            {isAnswered && (
              <button
                onClick={() => soundManager.speakArabic(currentQ.fullWord)}
                className="p-2.5 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 shadow-xs"
                title="استمع للفظ الكلمة"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-tajawal mt-2">
            المعنى: <strong className="text-slate-800">{currentQ.meaning}</strong>
          </p>

          {showHint && (
            <div className="mt-3 px-4 py-1.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold border border-amber-300">
              💡 {currentQ.hint}
            </div>
          )}
        </div>

        {/* Letter Choices (4 options) */}
        <div className="text-center mb-3">
          <span className="text-xs font-bold text-slate-500">اختر الحرف الناقص:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
          {currentQ.options.map((letter) => {
            const isThisSelected = selectedLetter === letter;
            const isThisCorrect = letter === currentQ.correctLetter;

            let btnStyle = 'bg-slate-50 hover:bg-indigo-50 border-slate-300 text-slate-800';

            if (isAnswered) {
              if (isThisCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-105';
              } else if (isThisSelected && !isCorrect) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={letter}
                onClick={() => handleSelectLetter(letter)}
                disabled={isAnswered}
                className={`py-4 rounded-2xl border-2 font-quran text-2xl sm:text-3xl font-bold transition-all shadow-xs active:scale-95 ${btnStyle}`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Ayah Context & Next Button */}
        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
            <div className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-indigo-900 block mb-1">
                  موضعها في الآية الكريمة:
                </span>
                <p className="font-quran text-base sm:text-lg text-slate-800">
                  « {currentQ.ayahText} »
                </p>
              </div>
              <button
                onClick={() => soundManager.speakArabic(currentQ.ayahText)}
                className="p-2 rounded-xl bg-white hover:bg-slate-200 text-indigo-900 border border-slate-200 shrink-0"
                title="استمع للآية كاملة"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-base flex items-center gap-2"
            >
              <span>{currentIndex + 1 < questions.length ? 'السؤال التالي' : 'عرض النتيجة'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

