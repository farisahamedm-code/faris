import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Board } from './Board';
import { Dice } from './Dice';
import { GameState } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { RotateCcw, Trophy, ArrowRight } from 'lucide-react';

interface GameUIProps {
  state: GameState;
  onRoll: () => void;
  onReset: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ state, onRoll, onReset }) => {
  const currentPlayer = state.players[state.currentPlayerIndex];

  useEffect(() => {
    if (state.status === 'finished' && state.winner) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [state.winner.color, '#ffffff', '#ffd700']
      });
    }
  }, [state.status, state.winner]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center gap-8">
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Snake & Ladder</h1>
          <Badge variant="outline" className="font-mono">{state.boardSize}x{state.boardSize}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {state.players.map((p, i) => (
            <div 
              key={p.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                i === state.currentPlayerIndex && state.status === 'playing'
                  ? 'bg-white shadow-md border-slate-300 scale-105 z-10' 
                  : 'bg-slate-100 border-transparent opacity-60'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-xs font-bold text-slate-700">{p.name}</span>
              {state.winner?.id === p.id && <Trophy size={12} className="text-yellow-500" />}
            </div>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-500 hover:text-red-500">
          <RotateCcw size={16} className="mr-2" /> Reset
        </Button>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        <div className="flex justify-center">
          <Board 
            size={state.boardSize} 
            snakes={state.snakes} 
            ladders={state.ladders} 
            players={state.players} 
          />
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center gap-6">
              {state.status === 'playing' ? (
                <>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Turn</p>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentPlayer.color }} />
                      {currentPlayer.name}
                    </h2>
                  </div>

                  <Dice 
                    value={state.lastDiceRoll} 
                    isRolling={state.isMoving} 
                    onRoll={onRoll}
                    disabled={state.isMoving}
                  />

                  <div className="w-full space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Game Stats</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Position</p>
                        <p className="text-lg font-black text-slate-800">{currentPlayer.position + 1}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">To Win</p>
                        <p className="text-lg font-black text-slate-800">{(state.boardSize * state.boardSize) - currentPlayer.position - 1}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center text-center gap-6">
                  <div className="relative">
                    <Trophy size={80} className="text-yellow-400" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full"
                    >
                      WINNER!
                    </motion.div>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900">{state.winner?.name}</h2>
                    <p className="text-slate-500 font-medium">Has conquered the board!</p>
                  </div>
                  <Button onClick={onReset} size="lg" className="w-full font-bold">
                    Play Again <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-slate-200/50 p-4 rounded-2xl space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Legend</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-green-500 rounded-full" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Snake (Go Down)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-amber-700 rounded-full" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Ladder (Go Up)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
