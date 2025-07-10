
import React from 'react';

interface GridCellProps {
  letter: string;
  row: number;
  col: number;
  isSelected: boolean;
  isFoundWord: boolean;
  isSelecting: boolean;
  onSelect: (row: number, col: number) => void;
}

export const GridCell: React.FC<GridCellProps> = ({
  letter,
  row,
  col,
  isSelected,
  isFoundWord,
  isSelecting,
  onSelect
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(row, col);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isSelecting && e.buttons === 1) { // Left mouse button is pressed
      onSelect(row, col);
    }
  };

  const handleMouseOver = () => {
    if (isSelecting) {
      onSelect(row, col);
    }
  };

  return (
    <div
      className={`
        w-8 h-8 flex items-center justify-center text-sm font-medium cursor-pointer
        transition-all duration-200 rounded border border-slate-600
        ${isFoundWord 
          ? 'bg-green-500 text-white border-green-400' 
          : isSelected 
          ? 'bg-green-400 text-slate-900 border-green-300' 
          : 'bg-slate-700 text-white hover:bg-slate-600'
        }
        hover:scale-105 select-none
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseOver={handleMouseOver}
    >
      {letter}
    </div>
  );
};
