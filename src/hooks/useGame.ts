import { useState, useCallback } from 'react';
import { GameState, Player, SnakeOrLadder, GameStatus } from '../types';
import { generateSnakesAndLadders } from '../lib/game-utils';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const useGame = () => {
  const [state, setState] = useState<GameState>({
    boardSize: 10,
    players: [],
    currentPlayerIndex: 0,
    snakes: [],
    ladders: [],
    status: 'setup',
    winner: null,
    lastDiceRoll: null,
    isMoving: false,
  });

  const initGame = useCallback((playerNames: string[], size: number) => {
    const { snakes, ladders } = generateSnakesAndLadders(size);
    const players: Player[] = playerNames.map((name, i) => ({
      id: `p-${i}`,
      name,
      color: COLORS[i % COLORS.length],
      position: 0,
    }));

    setState({
      boardSize: size,
      players,
      currentPlayerIndex: 0,
      snakes,
      ladders,
      status: 'playing',
      winner: null,
      lastDiceRoll: null,
      isMoving: false,
    });
  }, []);

  const rollDice = useCallback(async () => {
    if (state.status !== 'playing' || state.isMoving) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setState(prev => ({ ...prev, lastDiceRoll: roll, isMoving: true }));

    // Simulate movement delay
    await new Promise(resolve => setTimeout(resolve, 600));

    setState(prev => {
      const currentPlayer = prev.players[prev.currentPlayerIndex];
      let newPosition = currentPlayer.position + roll;
      const totalCells = prev.boardSize * prev.boardSize;

      if (newPosition >= totalCells - 1) {
        newPosition = totalCells - 1;
        const updatedPlayers = prev.players.map((p, i) => 
          i === prev.currentPlayerIndex ? { ...p, position: newPosition } : p
        );
        return {
          ...prev,
          players: updatedPlayers,
          status: 'finished',
          winner: currentPlayer,
          isMoving: false
        };
      }

      // Check for snakes or ladders
      const snake = prev.snakes.find(s => s.start === newPosition);
      const ladder = prev.ladders.find(l => l.start === newPosition);
      
      if (snake) newPosition = snake.end;
      if (ladder) newPosition = ladder.end;

      const updatedPlayers = prev.players.map((p, i) => 
        i === prev.currentPlayerIndex ? { ...p, position: newPosition } : p
      );

      return {
        ...prev,
        players: updatedPlayers,
        currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
        isMoving: false
      };
    });
  }, [state.status, state.isMoving]);

  const resetGame = useCallback(() => {
    setState(prev => ({ ...prev, status: 'setup', winner: null, lastDiceRoll: null }));
  }, []);

  return {
    state,
    initGame,
    rollDice,
    resetGame
  };
};
