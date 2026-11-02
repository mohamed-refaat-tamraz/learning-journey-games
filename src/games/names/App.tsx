import React, { useState, useEffect, useCallback } from 'react';
import './game.css';
import { useSoundEnabled } from '../../shared/soundPreference';
import { GameMode, GameState, Question, NameOfAllah } from './types';
import { NAMES_OF_ALLAH, LEVELS } from './data/namesData';
import { generateQuestion, getLevelNames, loadSavedState, saveGameState } from './utils/gameLogic';
import { Header } from './components/Header';
import { QuizCard } from './components/QuizCard';
import { LevelsView } from './components/LevelsView';
import { LibraryView } from './components/LibraryView';
import { sounds } from './utils/sound';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Initialize state from storage or defaults
  const [saved] = useState(() => loadSavedState());
  const [mode, setMode] = useState<GameMode>('quiz');
  const [stars, setStars] = useState<number>(() => saved.stars ?? 0);
  const [score, setScore] = useState<number>(() => saved.score ?? 0);
  const [streak, setStreak] = useState<number>(() => saved.streak ?? 0);
  const [activeLevel, setActiveLevel] = useState<number>(() => saved.activeLevel ?? 1);
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => saved.completedLevels ?? []);
  const soundEnabled = useSoundEnabled();
  const [showTashkeel, setShowTashkeel] = useState<boolean>(() => saved.showTashkeel ?? true);

  // Current Question State
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() => {
    return generateQuestion(getLevelNames(saved.activeLevel ?? 1));
  });

  // Release audio when navigating to another game.
  useEffect(() => () => sounds.stop(), []);

  // Persist game progress
  useEffect(() => {
    saveGameState({
      stars,
      score,
      streak,
      activeLevel,
      completedLevels,
      soundEnabled,
      showTashkeel,
    });
  }, [stars, score, streak, activeLevel, completedLevels, soundEnabled, showTashkeel]);

  // Generate next question within current level or general pool
  const handleNextQuestion = useCallback(() => {
    const pool = mode === 'levels' || activeLevel > 0
      ? getLevelNames(activeLevel)
      : NAMES_OF_ALLAH;

    const nextQ = generateQuestion(pool, currentQuestion.targetName.id);
    setCurrentQuestion(nextQ);
  }, [activeLevel, mode, currentQuestion.targetName.id]);

  // Handle user's option selection
  const handleAnswer = (selectedName: NameOfAllah) => {
    const isCorrect = selectedName.id === currentQuestion.targetName.id;

    if (isCorrect) {
      const nextStreak = streak + 1;
      const nextScore = score + 10 + Math.min(nextStreak * 2, 20);
      const nextStars = stars + 1;

      setStreak(nextStreak);
      setScore(nextScore);
      setStars(nextStars);

      // Check if current level is mastered
      const currentLevelData = LEVELS.find(l => l.id === activeLevel);
      if (currentLevelData && !completedLevels.includes(activeLevel)) {
        // If child answered sufficiently in this level
        if (nextStars >= currentLevelData.starsRequired + 5) {
          setCompletedLevels(prev => [...prev, activeLevel]);
          sounds.playLevelCelebration();
        }
      }

      setCurrentQuestion(prev => ({
        ...prev,
        selectedAnswerId: selectedName.id,
        isAnswered: true,
        isCorrect: true,
      }));
    } else {
      setStreak(0);
      setCurrentQuestion(prev => ({
        ...prev,
        selectedAnswerId: selectedName.id,
        isAnswered: true,
        isCorrect: false,
      }));
    }
  };

  // Switch to a specific level
  const handleSelectLevel = (levelId: number) => {
    setActiveLevel(levelId);
    setMode('quiz');
    const levelPool = getLevelNames(levelId);
    setCurrentQuestion(generateQuestion(levelPool));
  };

  // Reset progress option
  const handleResetProgress = () => {
    if (window.confirm('هل تريد إعادة تعيين النقاط والنجوم والبدء من جديد؟')) {
      sounds.playClick();
      setStars(0);
      setScore(0);
      setStreak(0);
      setActiveLevel(1);
      setCompletedLevels([]);
      setCurrentQuestion(generateQuestion(getLevelNames(1)));
    }
  };

  const currentLevelInfo = LEVELS.find(l => l.id === activeLevel);

  return (
    <div className="min-h-screen flex flex-col bg-vibrant-play text-sky-950 selection:bg-yellow-300">
      {/* Top Application Header */}
      <Header
        mode={mode}
        setMode={setMode}
        stars={stars}
        streak={streak}
        showTashkeel={showTashkeel}
        setShowTashkeel={setShowTashkeel}
      />

      {/* Main Game Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col">
        <AnimatePresence mode="wait">
          {mode === 'quiz' && (
            <motion.div
              key="quiz-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-center"
            >
              <QuizCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                onNext={handleNextQuestion}
                showTashkeel={showTashkeel}
                score={score}
                streak={streak}
                levelTitle={currentLevelInfo?.title}
              />
            </motion.div>
          )}

          {mode === 'levels' && (
            <motion.div
              key="levels-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1"
            >
              <LevelsView
                currentStars={stars}
                completedLevels={completedLevels}
                activeLevel={activeLevel}
                onSelectLevel={handleSelectLevel}
                showTashkeel={showTashkeel}
              />
            </motion.div>
          )}

          {mode === 'library' && (
            <motion.div
              key="library-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1"
            >
              <LibraryView showTashkeel={showTashkeel} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Footer with Vibrant Palette Theme Card */}
      <footer className="w-full max-w-5xl mx-auto px-4 pb-6 mt-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border-b-4 border-sky-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-950 font-bold">
          <div className="flex items-center gap-2">
            <span className="text-base">⭐</span>
            <p>
              قال رسول الله ﷺ: «<strong>إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلا وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ</strong>»
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetProgress}
              className="text-sky-700 hover:text-rose-600 flex items-center gap-1 transition-colors text-xs font-black"
              title="إعادة تعيين التقدم"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة البدء</span>
            </button>
            <span className="text-sky-300">|</span>
            <span className="text-pink-600 font-black font-tajawal">
              أسماء الله الحسنى للأطفال 💖
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
