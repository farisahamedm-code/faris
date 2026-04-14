import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}

const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, disabled }) => {
  const Icon = value ? DiceIcons[value - 1] : DiceIcons[0];

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={isRolling ? {
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1],
        } : {}}
        transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
        className={`p-4 rounded-2xl bg-white shadow-xl border-2 border-slate-200 cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}`}
        onClick={() => !disabled && onRoll()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={value || 'empty'}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <Icon size={64} className="text-slate-800" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <p className="text-sm font-medium text-slate-500">
        {isRolling ? 'Rolling...' : value ? `You rolled a ${value}!` : 'Click to roll'}
      </p>
    </div>
  );
};
