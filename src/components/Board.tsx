import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { SnakeOrLadder, Player } from '../types';
import { getCellCoords } from '../lib/game-utils';

interface BoardProps {
  size: number;
  snakes: SnakeOrLadder[];
  ladders: SnakeOrLadder[];
  players: Player[];
}

export const Board: React.FC<BoardProps> = ({ size, snakes, ladders, players }) => {
  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < size * size; i++) {
      arr.push(i);
    }
    return arr;
  }, [size]);

  const cellSize = 100 / size;

  return (
    <div className="relative aspect-square w-full max-w-[600px] border-4 border-slate-800 bg-slate-100 shadow-2xl overflow-hidden rounded-xl">
      {/* Grid */}
      <div 
        className="grid h-full w-full" 
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`
        }}
      >
        {cells.map((index) => {
          const { x, y } = getCellCoords(index, size);
          const isEven = (x + y) % 2 === 0;
          return (
            <div 
              key={index}
              className={`relative flex items-center justify-center border-[0.5px] border-slate-300 text-[10px] font-bold sm:text-xs ${isEven ? 'bg-white' : 'bg-slate-50'}`}
              style={{
                gridColumn: x + 1,
                gridRow: y + 1
              }}
            >
              <span className="absolute top-1 left-1 opacity-30">{index + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Snakes and Ladders SVG Overlay */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="ladderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* Ladders */}
        {ladders.map((ladder, i) => {
          const start = getCellCoords(ladder.start, size);
          const end = getCellCoords(ladder.end, size);
          const x1 = start.x + 0.5;
          const y1 = start.y + 0.5;
          const x2 = end.x + 0.5;
          const y2 = end.y + 0.5;
          
          return (
            <g key={`ladder-${i}`}>
              <line 
                x1={x1 - 0.1} y1={y1} x2={x2 - 0.1} y2={y2} 
                stroke="url(#ladderGradient)" strokeWidth="0.08" strokeLinecap="round" 
              />
              <line 
                x1={x1 + 0.1} y1={y1} x2={x2 + 0.1} y2={y2} 
                stroke="url(#ladderGradient)" strokeWidth="0.08" strokeLinecap="round" 
              />
              {/* Rungs */}
              {Array.from({ length: 5 }).map((_, j) => {
                const t = (j + 1) / 6;
                const rx = x1 + (x2 - x1) * t;
                const ry = y1 + (y2 - y1) * t;
                return (
                  <line 
                    key={j}
                    x1={rx - 0.15} y1={ry} x2={rx + 0.15} y2={ry} 
                    stroke="url(#ladderGradient)" strokeWidth="0.04" 
                  />
                );
              })}
            </g>
          );
        })}

        {/* Snakes */}
        {snakes.map((snake, i) => {
          const start = getCellCoords(snake.start, size);
          const end = getCellCoords(snake.end, size);
          const x1 = start.x + 0.5;
          const y1 = start.y + 0.5;
          const x2 = end.x + 0.5;
          const y2 = end.y + 0.5;
          
          // Create a curvy path for the snake
          const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 0.5;
          const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 0.5;
          const path = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

          return (
            <g key={`snake-${i}`}>
              <path 
                d={path} 
                fill="none" 
                stroke="url(#snakeGradient)" 
                strokeWidth="0.12" 
                strokeLinecap="round" 
                strokeDasharray="0.1 0.05"
              />
              {/* Snake Head */}
              <circle cx={x1} cy={y1} r="0.15" fill="#15803d" />
              <circle cx={x1 - 0.05} cy={y1 - 0.05} r="0.03" fill="white" />
              <circle cx={x1 + 0.05} cy={y1 - 0.05} r="0.03" fill="white" />
            </g>
          );
        })}
      </svg>

      {/* Players */}
      {players.map((player) => {
        const { x, y } = getCellCoords(player.position, size);
        return (
          <motion.div
            key={player.id}
            layout
            initial={false}
            animate={{
              left: `${(x / size) * 100}%`,
              top: `${(y / size) * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute flex items-center justify-center z-20"
            style={{ 
              width: `${100 / size}%`, 
              height: `${100 / size}%`,
              padding: '4px'
            }}
          >
            <div 
              className="h-full w-full rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-[8px] sm:text-xs"
              style={{ backgroundColor: player.color }}
            >
              {player.name[0].toUpperCase()}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
