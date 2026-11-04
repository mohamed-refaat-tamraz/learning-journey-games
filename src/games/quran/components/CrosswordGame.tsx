import { useRoundTimers } from '../utils/useRoundTimers';
import React, { useState, useEffect, useCallback } from 'react';
import { CROSSWORD_PUZZLES } from '../data/quranJuzAmmaData';
import { CrosswordPuzzle, CrosswordClue } from '../types';
import { soundManager } from '../utils/soundHelper';
import { 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle2, 
  Volume2, 
  Trophy,
  Delete,
  Sparkles 
} from 'lucide-react';

interface CrosswordGameProps {
  onGameComplete: (scoreEarned: number, starsEarned: number) => void;
  onBack: () => void;
}

const ARABIC_KEYBOARD_ROWS = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'ذ']
];

export const CrosswordGame: React.FC<CrosswordGameProps> = ({ onGameComplete, onBack }) => {
  const { schedule, clearTimers } = useRoundTimers();
  const [selectedPuzzleIdx, setSelectedPuzzleIdx] = useState<number>(0);
  const puzzle: CrosswordPuzzle = CROSSWORD_PUZZLES[selectedPuzzleIdx];

  // User entered grid of letters
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [activeDirection, setActiveDirection] = useState<'across' | 'down'>('across');
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  // Initialize empty grid according to puzzle
  const initGrid = useCallback(() => {
    clearTimers();
    soundManager.playCardFlip();
    const rows = puzzle.gridSize.rows;
    const cols = puzzle.gridSize.cols;
    const newGrid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));
    setUserGrid(newGrid);
    setSelectedCell(null);
    setSelectedClue(puzzle.clues[0] || null);
    setIsSolved(false);
    setHintsUsed(0);

    // Auto-select first non-null cell
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (puzzle.grid[r][c] !== null) {
          setSelectedCell({ row: r, col: c });
          return;
        }
      }
    }
  }, [puzzle, clearTimers]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // Find clue matching cell
  const updateActiveClueForCell = (r: number, c: number, dir: 'across' | 'down') => {
    // Check if clue exists in this direction
    const clueInDir = puzzle.clues.find((clue) => {
      if (clue.direction !== dir) return false;
      if (dir === 'across') {
        return clue.row === r && c >= clue.col && c < clue.col + clue.answer.length;
      } else {
        return clue.col === c && r >= clue.row && r < clue.row + clue.answer.length;
      }
    });

    if (clueInDir) {
      setSelectedClue(clueInDir);
      setActiveDirection(dir);
    } else {
      // Toggle to other direction if available
      const otherDir = dir === 'across' ? 'down' : 'across';
      const clueOther = puzzle.clues.find((clue) => {
        if (clue.direction !== otherDir) return false;
        if (otherDir === 'across') {
          return clue.row === r && c >= clue.col && c < clue.col + clue.answer.length;
        } else {
          return clue.col === c && r >= clue.row && r < clue.row + clue.answer.length;
        }
      });
      if (clueOther) {
        setSelectedClue(clueOther);
        setActiveDirection(otherDir);
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (puzzle.grid[r][c] === null) return;
    soundManager.playCardFlip();
    
    // If clicking the already selected cell, toggle direction
    if (selectedCell && selectedCell.row === r && selectedCell.col === c) {
      const nextDir = activeDirection === 'across' ? 'down' : 'across';
      updateActiveClueForCell(r, c, nextDir);
    } else {
      setSelectedCell({ row: r, col: c });
      updateActiveClueForCell(r, c, activeDirection);
    }
  };

  // Type a letter into current cell
  const handleInputLetter = (letter: string) => {
    if (!selectedCell || isSolved) return;
    const { row, col } = selectedCell;
    if (puzzle.grid[row][col] === null) return;

    soundManager.playCardFlip();
    const newGrid = userGrid.map((r) => [...r]);
    newGrid[row][col] = letter;
    setUserGrid(newGrid);

    // Auto move to next cell in current clue direction
    if (activeDirection === 'across') {
      if (col + 1 < puzzle.gridSize.cols && puzzle.grid[row][col + 1] !== null) {
        setSelectedCell({ row, col: col + 1 });
      }
    } else {
      if (row + 1 < puzzle.gridSize.rows && puzzle.grid[row + 1][col] !== null) {
        setSelectedCell({ row: row + 1, col });
      }
    }

    // Check if entire puzzle is solved correctly
    checkCompletion(newGrid);
  };

  // Backspace / clear cell
  const handleBackspace = () => {
    if (!selectedCell || isSolved) return;
    const { row, col } = selectedCell;
    const newGrid = userGrid.map((r) => [...r]);
    newGrid[row][col] = '';
    setUserGrid(newGrid);

    // Move back
    if (activeDirection === 'across') {
      if (col - 1 >= 0 && puzzle.grid[row][col - 1] !== null) {
        setSelectedCell({ row, col: col - 1 });
      }
    } else {
      if (row - 1 >= 0 && puzzle.grid[row - 1][col] !== null) {
        setSelectedCell({ row: row - 1, col });
      }
    }
  };

  // Keyboard typing event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSolved) return;
      if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^[\u0621-\u064A]$/.test(e.key)) {
        handleInputLetter(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, userGrid, activeDirection, isSolved]);

  // Check if whole puzzle is correct
  const checkCompletion = (currentGrid: string[][]) => {
    let allFilled = true;
    let allCorrect = true;

    for (let r = 0; r < puzzle.gridSize.rows; r++) {
      for (let c = 0; c < puzzle.gridSize.cols; c++) {
        const correctLetter = puzzle.grid[r][c];
        if (correctLetter !== null) {
          const userLetter = currentGrid[r][c];
          if (!userLetter) {
            allFilled = false;
          } else if (userLetter !== correctLetter) {
            allCorrect = false;
          }
        }
      }
    }

    if (allFilled && allCorrect) {
      setIsSolved(true);
      soundManager.playVictory();
      const score = Math.max(50, 150 - hintsUsed * 15);
      const stars = hintsUsed === 0 ? 3 : hintsUsed <= 2 ? 2 : 1;
      schedule(() => {
        onGameComplete(score, stars);
      }, 700);
    }
  };

  // Hint helper: Reveal current cell letter
  const handleUseHint = () => {
    if (!selectedCell || isSolved) return;
    const { row, col } = selectedCell;
    const correctLetter = puzzle.grid[row][col];
    if (correctLetter) {
      soundManager.playSuccess();
      const newGrid = userGrid.map((r) => [...r]);
      newGrid[row][col] = correctLetter;
      setUserGrid(newGrid);
      setHintsUsed((prev) => prev + 1);
      checkCompletion(newGrid);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header Card */}
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
                <span>الكلمات المتقاطعة القرآنية</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {puzzle.title}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-tajawal">املأ الحروف في المربعات حسب معاني الآيات في جزء عم</p>
            </div>
          </div>

          {/* Level Switcher & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedPuzzleIdx}
              onChange={(e) => setSelectedPuzzleIdx(Number(e.target.value))}
              className="px-3 py-2 rounded-2xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-sky-500"
            >
              {CROSSWORD_PUZZLES.map((p, idx) => (
                <option key={p.id} value={idx}>
                  لغز {idx + 1}: {p.title.slice(0, 24)}...
                </option>
              ))}
            </select>

            <button
              onClick={handleUseHint}
              disabled={isSolved || !selectedCell}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors"
              title="كشف الحرف المحدد"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>كشف حرف</span>
            </button>

            <button
              onClick={initGrid}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors"
              title="إعادة البدء"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة</span>
            </button>
          </div>
        </div>

        {/* Selected Clue Display Banner */}
        {selectedClue && (
          <div className="mt-4 p-3.5 bg-sky-50 rounded-2xl border border-sky-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-sky-600 text-white text-xs font-bold">
                {selectedClue.direction === 'across' ? 'أفقي' : 'رأسي'} {selectedClue.number}
              </span>
              <span className="text-xs font-bold text-sky-900">
                (سورة {selectedClue.surahName}):
              </span>
              <span className="text-sm font-semibold text-slate-800 font-tajawal">
                {selectedClue.text}
              </span>
            </div>
            <button
              onClick={() => soundManager.speakArabic(selectedClue.text)}
              className="p-1.5 rounded-xl bg-white hover:bg-sky-100 text-sky-700 border border-sky-200"
              title="استمع للتعريف"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Crossword Grid Area (Left/Main) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-slate-800 p-4 sm:p-6 rounded-3xl shadow-lg inline-block border-4 border-slate-700">
            <div
              className="grid gap-1.5 sm:gap-2"
              style={{
                gridTemplateColumns: `repeat(${puzzle.gridSize.cols}, minmax(0, 1fr))`,
              }}
            >
              {puzzle.grid.map((row, r) =>
                row.map((cell, c) => {
                  const isBlocked = cell === null;
                  const isCellSelected = selectedCell?.row === r && selectedCell?.col === c;
                  const userVal = userGrid[r]?.[c] || '';
                  const isCorrect = userVal === cell;

                  // Find clue number if this is a starting cell
                  const clueStarting = puzzle.clues.find(
                    (clue) => clue.row === r && clue.col === c
                  );

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-bold text-lg sm:text-2xl select-none transition-all ${
                        isBlocked
                          ? 'bg-slate-900/80 cursor-default'
                          : isCellSelected
                          ? 'bg-amber-300 text-slate-900 ring-4 ring-amber-400 scale-105 z-10 shadow-md cursor-pointer'
                          : userVal
                          ? 'bg-white text-slate-800 hover:bg-amber-50 cursor-pointer shadow-xs'
                          : 'bg-slate-100 text-slate-800 hover:bg-amber-50 cursor-pointer'
                      }`}
                    >
                      {/* Clue Number tag */}
                      {clueStarting && !isBlocked && (
                        <span className="absolute top-1 right-1.5 text-[9px] sm:text-[10px] text-slate-400 font-bold leading-none pointer-events-none">
                          {clueStarting.number}
                        </span>
                      )}

                      {/* Letter Content */}
                      {!isBlocked && (
                        <span className="font-quran">
                          {userVal}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Virtual Arabic Keyboard */}
          <div className="w-full mt-6 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span>لوحة الحروف العربية:</span>
              <span className="text-[11px] text-slate-400">يمكنك أيضاً الكتابة بلوحة المفاتيح</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {ARABIC_KEYBOARD_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-1">
                  {row.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleInputLetter(letter)}
                      className="px-2 sm:px-3 py-2 bg-slate-100 hover:bg-amber-200 active:bg-amber-300 text-slate-800 font-bold rounded-xl text-sm sm:text-base transition-colors shadow-2xs font-tajawal"
                    >
                      {letter}
                    </button>
                  ))}
                  {rowIdx === 2 && (
                    <button
                      onClick={handleBackspace}
                      className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1 transition-colors"
                      title="مسح"
                    >
                      <Delete className="w-4 h-4" />
                      <span>مسح</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clues Sidebar (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Across Clues */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 font-cairo mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>الكلمات الأفقية (→)</span>
            </h3>
            <div className="space-y-2.5">
              {puzzle.clues
                .filter((c) => c.direction === 'across')
                .map((clue) => {
                  const isCurrent = selectedClue?.number === clue.number && selectedClue.direction === 'across';
                  return (
                    <div
                      key={`across-${clue.number}-${clue.col}`}
                      onClick={() => {
                        setSelectedClue(clue);
                        setActiveDirection('across');
                        setSelectedCell({ row: clue.row, col: clue.col });
                      }}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-emerald-800">
                          {clue.number}. سورة {clue.surahName} ({clue.answer.length} أحرف)
                        </span>
                      </div>
                      <p className="text-slate-700 font-tajawal">{clue.text}</p>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Down Clues */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 font-cairo mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>الكلمات الرأسية (↓)</span>
            </h3>
            <div className="space-y-2.5">
              {puzzle.clues
                .filter((c) => c.direction === 'down')
                .map((clue) => {
                  const isCurrent = selectedClue?.number === clue.number && selectedClue.direction === 'down';
                  return (
                    <div
                      key={`down-${clue.number}-${clue.col}`}
                      onClick={() => {
                        setSelectedClue(clue);
                        setActiveDirection('down');
                        setSelectedCell({ row: clue.row, col: clue.col });
                      }}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sky-800">
                          {clue.number}. سورة {clue.surahName} ({clue.answer.length} أحرف)
                        </span>
                      </div>
                      <p className="text-slate-700 font-tajawal">{clue.text}</p>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

      </div>

      {/* Completion Modal */}
      {isSolved && (
        <div className="mt-8 bg-sky-900 text-white rounded-3xl p-6 text-center border-2 border-sky-400 shadow-xl animate-bounce">
          <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-2" />
          <h3 className="text-2xl font-bold font-cairo text-amber-200">مبارك! تم حل اللغز القرآني بنجاح!</h3>
          <p className="text-sm text-sky-100 mt-1 font-tajawal">
            أحسنت في استنتاج مفردات جزء عمّ وملء جميع مربعات الشبكة!
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setSelectedPuzzleIdx((prev) => (prev + 1) % CROSSWORD_PUZZLES.length);
              }}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-2xl shadow-md transition-transform active:scale-95 text-sm"
            >
              اللغز التالي
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-sky-800 hover:bg-sky-700 text-white font-bold rounded-2xl border border-sky-600 shadow-md transition-transform active:scale-95 text-sm"
            >
              العودة للألعاب
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

