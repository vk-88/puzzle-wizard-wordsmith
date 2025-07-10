
export interface WordPosition {
  word: string;
  start: { row: number; col: number };
  end: { row: number; col: number };
  direction: string;
}

export interface GameData {
  grid: string[][];
  words: WordPosition[];
}

const DIRECTIONS = [
  { name: 'horizontal', dr: 0, dc: 1 },
  { name: 'vertical', dr: 1, dc: 0 },
  { name: 'diagonal-down', dr: 1, dc: 1 },
  { name: 'diagonal-up', dr: -1, dc: 1 },
  { name: 'horizontal-reverse', dr: 0, dc: -1 },
  { name: 'vertical-reverse', dr: -1, dc: 0 },
  { name: 'diagonal-down-reverse', dr: -1, dc: -1 },
  { name: 'diagonal-up-reverse', dr: 1, dc: -1 }
];

export function generateWordSearch(words: string[], rows: number, cols: number): GameData {
  const grid: string[][] = Array(rows).fill(null).map(() => Array(cols).fill(''));
  const placedWords: WordPosition[] = [];

  // Shuffle words to randomize placement order
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  // Try to place each word
  for (const word of shuffledWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const startRow = Math.floor(Math.random() * rows);
      const startCol = Math.floor(Math.random() * cols);

      if (canPlaceWord(grid, word, startRow, startCol, direction, rows, cols)) {
        placeWord(grid, word, startRow, startCol, direction);
        
        const endRow = startRow + direction.dr * (word.length - 1);
        const endCol = startCol + direction.dc * (word.length - 1);
        
        placedWords.push({
          word,
          start: { row: startRow, col: startCol },
          end: { row: endRow, col: endCol },
          direction: direction.name
        });
        
        placed = true;
      }
      attempts++;
    }
  }

  // Fill empty cells with random letters
  fillEmptyCells(grid, rows, cols);

  return { grid, words: placedWords };
}

function canPlaceWord(
  grid: string[][], 
  word: string, 
  startRow: number, 
  startCol: number, 
  direction: { dr: number; dc: number }, 
  rows: number, 
  cols: number
): boolean {
  const { dr, dc } = direction;
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + dr * i;
    const col = startCol + dc * i;
    
    // Check bounds
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      return false;
    }
    
    // Check if cell is empty or contains the same letter
    if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
      return false;
    }
  }
  
  return true;
}

function placeWord(
  grid: string[][], 
  word: string, 
  startRow: number, 
  startCol: number, 
  direction: { dr: number; dc: number }
): void {
  const { dr, dc } = direction;
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + dr * i;
    const col = startCol + dc * i;
    grid[row][col] = word[i];
  }
}

function fillEmptyCells(grid: string[][], rows: number, cols: number): void {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}
