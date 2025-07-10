
import React, { useRef, useEffect } from 'react';
import { GridCell } from './GridCell';

interface WordGridProps {
  grid: string[][];
  selectedCells: { row: number; col: number }[];
  foundWords: Set<string>;
  wordPositions: Array<{
    word: string;
    start: { row: number; col: number };
    end: { row: number; col: number };
    direction: string;
  }>;
  onCellSelect: (row: number, col: number) => void;
  onSelectionEnd: () => void;
  isSelecting: boolean;
}

export const WordGrid: React.FC<WordGridProps> = ({
  grid,
  selectedCells,
  foundWords,
  wordPositions,
  onCellSelect,
  onSelectionEnd,
  isSelecting
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isSelecting) {
        onSelectionEnd();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isSelecting, onSelectionEnd]);

  const getFoundWordPositions = () => {
    const positions = new Set<string>();
    wordPositions.forEach(wordInfo => {
      if (foundWords.has(wordInfo.word)) {
        const cells = getCellsInLine(
          wordInfo.start.row, 
          wordInfo.start.col, 
          wordInfo.end.row, 
          wordInfo.end.col
        );
        cells.forEach(cell => positions.add(`${cell.row}-${cell.col}`));
      }
    });
    return positions;
  };

  const getCellsInLine = (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const cells = [];
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    
    for (let i = 0; i <= steps; i++) {
      const row = startRow + Math.round((rowDiff * i) / steps);
      const col = startCol + Math.round((colDiff * i) / steps);
      cells.push({ row, col });
    }
    
    return cells;
  };

  const isSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isFoundWord = (row: number, col: number) => {
    return getFoundWordPositions().has(`${row}-${col}`);
  };

  return (
    <div 
      ref={gridRef}
      className="inline-block bg-slate-800 p-4 rounded-lg shadow-2xl"
      style={{ userSelect: 'none' }}
    >
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 1fr)` }}>
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <GridCell
              key={`${rowIndex}-${colIndex}`}
              letter={letter}
              row={rowIndex}
              col={colIndex}
              isSelected={isSelected(rowIndex, colIndex)}
              isFoundWord={isFoundWord(rowIndex, colIndex)}
              onSelect={onCellSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};
