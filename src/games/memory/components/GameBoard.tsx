import React from 'react';
import { motion } from 'motion/react';
import { MemoryCardItem, GameDifficulty } from '../types';
import { MemoryCard } from './MemoryCard';
import { DIFFICULTY_CONFIGS } from '../data/juzAmmaWords';

interface GameBoardProps {
  cards: MemoryCardItem[];
  difficulty: GameDifficulty;
  onCardClick: (card: MemoryCardItem) => void;
  isProcessing: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  difficulty,
  onCardClick,
  isProcessing,
}) => {
  const diffConfig = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div className="w-full flex justify-center py-2 sm:py-4">
      <motion.div
        layout
        className={`w-full grid gap-3 sm:gap-4.5 ${diffConfig.gridColsClass} justify-center items-center`}
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.instanceId}
            card={card}
            onClick={onCardClick}
            disabled={isProcessing}
          />
        ))}
      </motion.div>
    </div>
  );
};
