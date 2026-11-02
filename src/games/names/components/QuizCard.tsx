import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { NameOfAllah, Question } from '../types';
import { sounds, speakArabic } from '../utils/sound';
import { ENCOURAGING_PRAISES, GENTLE_ENCOURAGEMENTS } from '../data/namesData';
import { 
  Volume2, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Heart, 
  Lightbulb,
  Award,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizCardProps {
  question: Question;
  onAnswer: (selectedName: NameOfAllah) => void;
  onNext: () => void;
  showTashkeel: boolean;
  score: number;
  streak: number;
  levelTitle?: string;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onAnswer,
  onNext,
  showTashkeel,
  score,
  streak,
  levelTitle,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [shakingOptionId, setShakingOptionId] = useState<number | null>(null);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  // Reset local states on new question
  useEffect(() => {
    setShowHint(false);
    setFeedbackMessage('');
    setShakingOptionId(null);
    setHasTriggeredConfetti(false);
  }, [question.targetName.id]);

  // Read meaning automatically or on mount if requested
  const handleReadMeaning = () => {
    sounds.playClick();
    speakArabic(question.targetName.simplifiedMeaning);
  };

  const handleReadName = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    speakArabic(name);
  };

  const handleSelectOption = (option: NameOfAllah) => {
    if (question.isCorrect) return; // already solved

    if (option.id === question.targetName.id) {
      // Correct!
      sounds.playCorrect();
      const randomPraise = ENCOURAGING_PRAISES[Math.floor(Math.random() * ENCOURAGING_PRAISES.length)];
      setFeedbackMessage(randomPraise);
      
      if (!hasTriggeredConfetti) {
        setHasTriggeredConfetti(true);
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6']
        });
      }
      onAnswer(option);
    } else {
      // Incorrect attempt
      sounds.playIncorrect();
      setShakingOptionId(option.id);
      const randomEncouragement = GENTLE_ENCOURAGEMENTS[Math.floor(Math.random() * GENTLE_ENCOURAGEMENTS.length)];
      setFeedbackMessage(randomEncouragement);
      setTimeout(() => setShakingOptionId(null), 600);
      onAnswer(option);
    }
  };

  // Keyboard navigation (keys 1, 2, 3 for options and Space/Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1' && question.options[0]) {
        handleSelectOption(question.options[0]);
      } else if (e.key === '2' && question.options[1]) {
        handleSelectOption(question.options[1]);
      } else if (e.key === '3' && question.options[2]) {
        handleSelectOption(question.options[2]);
      } else if ((e.key === 'Enter' || e.key === ' ') && question.isCorrect) {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, onNext]);

  // Color styles for the 3 options according to the Vibrant Palette theme
  const optionCardColors = [
    {
      base: 'bg-orange-400 hover:bg-orange-500 border-orange-600 text-white',
      badge: 'bg-orange-600/40 text-white',
      border: 'border-b-8 border-orange-600',
    },
    {
      base: 'bg-purple-500 hover:bg-purple-600 border-purple-700 text-white',
      badge: 'bg-purple-700/40 text-white',
      border: 'border-b-8 border-purple-700',
    },
    {
      base: 'bg-emerald-400 hover:bg-emerald-500 border-emerald-600 text-white',
      badge: 'bg-emerald-600/40 text-white',
      border: 'border-b-8 border-emerald-600',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Banner with Game Objective instructions */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-sm border-b-4 border-sky-300 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-yellow-950 flex items-center justify-center text-xl font-black shadow-inner">
            🎯
          </div>
          <div>
            <span className="text-xs font-black text-sky-800 uppercase tracking-wider block">
              {levelTitle || 'رحلة مع أسماء الله الحسنى'}
            </span>
            <p className="text-xs md:text-sm font-black text-sky-950">
              اختر الاسم الصحيح من الأسماء الثلاثة المناسبة للمعنى المكتوب أدناه:
            </p>
          </div>
        </div>

        {streak >= 3 && (
          <div className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-md animate-bounce border-2 border-white">
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>حماس رائع! {streak} إجابات متتالية 🔥</span>
          </div>
        )}
      </div>

      {/* 
        SECTION 1: THE THREE CHOICES (فوق المعنى كما في طلب المستخدم)
        "وفوقه ثلاث أسماء من اسماء الله الحسنى يختار منها الطفل الإسم الذي يناسب المعنى المكتوب"
      */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs sm:text-sm font-black text-sky-950 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500 inline-block animate-ping"></span>
            الخيارات الثلاثة: اضغط على الاسم المناسب
          </span>
          <span className="text-xs text-sky-800 font-bold">
            (اضغط على البطاقة الملونة)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {question.options.map((option, index) => {
            const isSelected = question.selectedAnswerId === option.id;
            const isThisTarget = option.id === question.targetName.id;
            const isShaking = shakingOptionId === option.id;
            const themeSlot = optionCardColors[index % optionCardColors.length];

            // Determine visual styles
            let cardClasses = `${themeSlot.base} ${themeSlot.border}`;
            let badgeClasses = themeSlot.badge;

            if (question.isAnswered) {
              if (isThisTarget && question.isCorrect) {
                cardClasses = "bg-emerald-500 border-emerald-700 border-b-8 text-white shadow-2xl ring-4 ring-yellow-400 scale-105";
                badgeClasses = "bg-emerald-700 text-white";
              } else if (isSelected && !question.isCorrect) {
                cardClasses = "bg-rose-500 border-rose-700 border-b-8 text-white shadow-md opacity-90";
                badgeClasses = "bg-rose-700 text-white";
              }
            }

            return (
              <motion.div
                key={option.id}
                id={`option-btn-${option.id}`}
                role="button"
                tabIndex={0}
                aria-disabled={question.isCorrect === true}
                onClick={() => handleSelectOption(option)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectOption(option);
                  }
                }}
                animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { scale: isSelected && question.isCorrect ? [1, 1.06, 1] : 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: question.isCorrect ? 1 : 1.03 }}
                whileTap={{ scale: question.isCorrect ? 1 : 0.97 }}
                className={`group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-[32px] shadow-lg transition-all cursor-pointer text-center min-h-[120px] select-none focus:outline-none focus:ring-4 focus:ring-yellow-300 ${cardClasses}`}
              >
                {/* Number Key Indicator */}
                <span className={`absolute top-3 right-3.5 w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center backdrop-blur-xs ${badgeClasses}`}>
                  {index + 1}
                </span>

                {/* Speaker pronunciation mini button */}
                <button
                  type="button"
                  id={`speak-name-btn-${option.id}`}
                  onClick={(e) => handleReadName(option.name, e)}
                  title="استمع لنطق الاسم"
                  className="absolute top-3 left-3.5 w-8 h-8 rounded-xl bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors backdrop-blur-xs"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* The Name of Allah */}
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-amiri tracking-wide mt-2 mb-1 drop-shadow-sm">
                  {showTashkeel ? option.name : option.plainName}
                </span>

                {/* Sub category label */}
                <span className="text-xs font-bold text-white/90 bg-black/15 px-3 py-0.5 rounded-full mt-1">
                  {option.categoryLabel}
                </span>

                {/* Correct / Incorrect Indicator */}
                {question.isAnswered && isThisTarget && question.isCorrect && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-3 bg-yellow-400 text-yellow-950 font-black rounded-full p-1 shadow-lg flex items-center gap-1 px-3 text-xs border-2 border-white"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>إجابة صحيحة ⭐</span>
                  </motion.div>
                )}

                {question.isAnswered && isSelected && !question.isCorrect && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-3 bg-white text-rose-600 font-black rounded-full p-1 shadow-lg flex items-center gap-1 px-3 text-xs border-2 border-rose-400"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>حاول مرة أخرى 💪</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 
        SECTION 2: THE SIMPLIFIED MEANING CARD (المعنى المكتوب بشكل مبسط)
        Matches Vibrant Palette: bg-white rounded-[40px] p-12 text-center shadow-xl border-b-8 border-sky-200 relative
      */}
      <div 
        id="meaning-card-container"
        className="relative bg-white rounded-[36px] sm:rounded-[40px] p-6 sm:p-10 w-full text-center shadow-xl border-b-8 border-sky-200"
      >
        {/* Top Vibrant Pink Pill Badge */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 sm:px-8 py-2 rounded-full text-sm sm:text-base font-black shadow-md border-2 border-white flex items-center gap-2 whitespace-nowrap">
          <span>📖</span>
          <span>مَا هُوَ الاِسْمُ الصَّحِيحُ؟</span>
        </div>

        {/* Audio Reader & Hint Controls */}
        <div className="flex items-center justify-between gap-2 pt-2 mb-2">
          <button
            id="read-meaning-audio-btn"
            onClick={handleReadMeaning}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-900 border-2 border-sky-300 text-xs font-black transition-all shadow-xs"
            title="استمع لقراءة المعنى صوتياً"
          >
            <Volume2 className="w-4 h-4 text-sky-600 animate-pulse" />
            <span>استمع للمعنى</span>
          </button>

          {!question.isCorrect && (
            <button
              id="toggle-hint-btn"
              onClick={() => {
                sounds.playClick();
                setShowHint(!showHint);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all border-2 ${
                showHint 
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title="إظهار تلميح مساعد"
            >
              <Lightbulb className={`w-4 h-4 ${showHint ? 'text-amber-900 fill-amber-900' : 'text-slate-500'}`} />
              <span>{showHint ? 'إخفاء التلميح' : 'تلميح 💡'}</span>
            </button>
          )}
        </div>

        {/* The Simplified Meaning Text (Large, vibrant, readable) */}
        <div className="py-4 sm:py-6">
          <p 
            id="simplified-meaning-text"
            className="text-xl sm:text-2xl md:text-4xl font-black text-sky-950 font-tajawal leading-relaxed text-center select-text"
          >
            "{question.targetName.simplifiedMeaning}"
          </p>
        </div>

        {/* Hint Revelation if active */}
        <AnimatePresence>
          {showHint && !question.isCorrect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 bg-yellow-100 rounded-2xl border-2 border-yellow-300 text-yellow-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
            >
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg shrink-0">
                💡
              </div>
              <p>
                <strong>تلميح:</strong> هذا الاسم يرتبط بـ ({question.targetName.categoryLabel})، ويبدأ بحرف ({question.targetName.plainName.replace('ال', '')[0]}).
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Encouragement / Feedback Alert */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-4 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base font-black text-center shadow-md border-2 ${
                question.isCorrect
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-orange-100 text-orange-950 border-orange-300'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${question.isCorrect ? 'text-yellow-300 fill-yellow-300' : 'text-orange-600'}`} />
              <span>{feedbackMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Explanation / Educational Fruit (Revealed when correct) */}
        <AnimatePresence>
          {question.isCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="mt-6 pt-5 border-t-2 border-sky-100 space-y-4 text-right"
            >
              <div className="flex items-center gap-2 text-sky-950 font-black text-base">
                <div className="w-7 h-7 rounded-xl bg-pink-500 text-white flex items-center justify-center text-sm">
                  🌟
                </div>
                <span>ماذا نتعلم من اسم الله ({showTashkeel ? question.targetName.name : question.targetName.plainName})؟</span>
              </div>

              {/* Real Life Child Example */}
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 text-xs sm:text-sm text-sky-950 font-bold flex items-start gap-3">
                <div className="w-8 h-8 bg-sky-200 rounded-full flex items-center justify-center text-lg shrink-0">
                  💖
                </div>
                <div>
                  <strong className="text-sky-900 block mb-0.5">في حياتنا اليومية:</strong>
                  <span>{question.targetName.childExample}</span>
                </div>
              </div>

              {/* Child Supplication / Duaa */}
              <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 text-xs sm:text-sm text-purple-950 font-bold flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-lg shrink-0">
                    🤲
                  </div>
                  <p>
                    <strong className="text-purple-900 ml-1">دعاء طيب:</strong>
                    <span className="font-amiri font-bold text-base sm:text-lg text-purple-950">"{question.targetName.duaa}"</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    speakArabic(question.targetName.duaa);
                  }}
                  className="p-2 rounded-xl bg-purple-200 hover:bg-purple-300 text-purple-900 transition-colors shrink-0"
                  title="استمع للدعاء"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Next Question Action Button with Vibrant Palette 3D button styling */}
              <div className="pt-3 flex justify-center">
                <motion.button
                  id="next-question-btn"
                  onClick={() => {
                    sounds.playClick();
                    onNext();
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-black text-lg md:text-xl shadow-xl border-b-6 border-orange-700 flex items-center justify-center gap-3 transition-all cursor-pointer"
                >
                  <span>السؤال التالي يا بطل 🚀</span>
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick bottom stats and skip/change question */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-sky-900 font-bold px-3">
        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-sky-200 shadow-xs">
          <span>مجموع النقاط:</span>
          <strong className="text-orange-500 font-black text-base">{score}</strong>
        </div>
        
        {!question.isCorrect && (
          <button
            id="skip-question-btn"
            onClick={() => {
              sounds.playClick();
              onNext();
            }}
            className="flex items-center gap-1.5 bg-white/80 hover:bg-white text-sky-900 px-4 py-2 rounded-full border border-sky-200 font-black transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-sky-600" />
            <span>سؤال آخر</span>
          </button>
        )}
      </div>
    </div>
  );
};
