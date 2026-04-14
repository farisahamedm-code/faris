export type Player = {
  id: string;
  name: string;
  color: string;
  position: number; // 0 to (size * size - 1)
};

export type SnakeOrLadder = {
  start: number;
  end: number;
  type: 'snake' | 'ladder';
};

export type GameStatus = 'setup' | 'playing' | 'finished';

export type GameState = {
  boardSize: number;
  players: Player[];
  currentPlayerIndex: number;
  snakes: SnakeOrLadder[];
  ladders: SnakeOrLadder[];
  status: GameStatus;
  winner: Player | null;
  lastDiceRoll: number | null;
  isMoving: boolean;
};
