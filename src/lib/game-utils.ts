import { SnakeOrLadder } from '../types';

export const generateSnakesAndLadders = (size: number): { snakes: SnakeOrLadder[], ladders: SnakeOrLadder[] } => {
  const totalCells = size * size;
  const snakes: SnakeOrLadder[] = [];
  const ladders: SnakeOrLadder[] = [];
  
  const usedPositions = new Set<number>();
  usedPositions.add(0); // Start
  usedPositions.add(totalCells - 1); // End

  const count = Math.floor(size * 1.2); // Number of snakes and ladders based on size

  // Generate Ladders
  for (let i = 0; i < count; i++) {
    let start, end;
    let attempts = 0;
    do {
      start = Math.floor(Math.random() * (totalCells - size)) + 1;
      end = Math.floor(Math.random() * (totalCells - start - 1)) + start + 1;
      attempts++;
    } while ((usedPositions.has(start) || usedPositions.has(end) || (end - start) < size) && attempts < 100);

    if (attempts < 100) {
      ladders.push({ start, end, type: 'ladder' });
      usedPositions.add(start);
      usedPositions.add(end);
    }
  }

  // Generate Snakes
  for (let i = 0; i < count; i++) {
    let start, end;
    let attempts = 0;
    do {
      start = Math.floor(Math.random() * (totalCells - size)) + size;
      end = Math.floor(Math.random() * (start - 1)) + 1;
      attempts++;
    } while ((usedPositions.has(start) || usedPositions.has(end) || (start - end) < size) && attempts < 100);

    if (attempts < 100) {
      snakes.push({ start, end, type: 'snake' });
      usedPositions.add(start);
      usedPositions.add(end);
    }
  }

  return { snakes, ladders };
};

export const getCellCoords = (index: number, size: number) => {
  const row = Math.floor(index / size);
  const isEvenRow = row % 2 === 0;
  const col = isEvenRow ? (index % size) : (size - 1 - (index % size));
  
  // Return coords from bottom-left
  return {
    x: col,
    y: size - 1 - row
  };
};
