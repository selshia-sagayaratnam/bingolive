// Win detection for bingo
export const checkBingo = (markedSquares: boolean[]): { hasBingo: boolean; winningLine: number[] | null } => {
  const size = 5;
  
  // Check rows
  for (let row = 0; row < size; row++) {
    const rowStart = row * size;
    const rowIndices = [0, 1, 2, 3, 4].map(i => rowStart + i);
    if (rowIndices.every(i => markedSquares[i])) {
      return { hasBingo: true, winningLine: rowIndices };
    }
  }
  
  // Check columns
  for (let col = 0; col < size; col++) {
    const colIndices = [0, 1, 2, 3, 4].map(row => row * size + col);
    if (colIndices.every(i => markedSquares[i])) {
      return { hasBingo: true, winningLine: colIndices };
    }
  }
  
  // Check diagonals
  const diagonal1 = [0, 6, 12, 18, 24];
  if (diagonal1.every(i => markedSquares[i])) {
    return { hasBingo: true, winningLine: diagonal1 };
  }
  
  const diagonal2 = [4, 8, 12, 16, 20];
  if (diagonal2.every(i => markedSquares[i])) {
    return { hasBingo: true, winningLine: diagonal2 };
  }
  
  return { hasBingo: false, winningLine: null };
};

// Count marked squares in potential winning lines
export const getClosestToWin = (markedSquares: boolean[]): number => {
  const size = 5;
  let maxMarked = 0;
  
  // Check rows
  for (let row = 0; row < size; row++) {
    const rowStart = row * size;
    const count = [0, 1, 2, 3, 4].map(i => rowStart + i).filter(i => markedSquares[i]).length;
    maxMarked = Math.max(maxMarked, count);
  }
  
  // Check columns
  for (let col = 0; col < size; col++) {
    const count = [0, 1, 2, 3, 4].map(row => row * size + col).filter(i => markedSquares[i]).length;
    maxMarked = Math.max(maxMarked, count);
  }
  
  // Check diagonals
  const diagonal1Count = [0, 6, 12, 18, 24].filter(i => markedSquares[i]).length;
  const diagonal2Count = [4, 8, 12, 16, 20].filter(i => markedSquares[i]).length;
  
  maxMarked = Math.max(maxMarked, diagonal1Count, diagonal2Count);
  
  return maxMarked;
};

// Generate a random game code
export const generateGameCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get cell color based on position
export const getCellColor = (index: number): string => {
  const colors = [
    'bg-bingo-pink',
    'bg-bingo-purple',
    'bg-bingo-blue',
    'bg-bingo-green',
    'bg-bingo-yellow',
    'bg-bingo-orange',
    'bg-bingo-red',
  ];
  return colors[index % colors.length];
};

// Get cell border color based on position
export const getCellBorderColor = (index: number): string => {
  const colors = [
    'border-bingo-pink',
    'border-bingo-purple',
    'border-bingo-blue',
    'border-bingo-green',
    'border-bingo-yellow',
    'border-bingo-orange',
    'border-bingo-red',
  ];
  return colors[index % colors.length];
};
