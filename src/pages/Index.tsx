
import React, { useState, useEffect, useCallback } from 'react';
import { WordGrid } from '../components/WordGrid';
import { WordList } from '../components/WordList';
import { generateWordSearch } from '../utils/gameLogic';
import { ChevronLeft, RotateCcw, User } from 'lucide-react';

const Index = () => {
  const [gameData, setGameData] = useState(null);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const words = [
    'PUZZLE', 'SEARCH', 'WORD', 'GAME', 'BRAIN', 'LOGIC', 'FIND', 'HIDDEN',
    'LETTERS', 'GRID', 'SOLVE', 'CHALLENGE'
  ];

  useEffect(() => {
    const data = generateWordSearch(words, 15, 12);
    setGameData(data);
  }, []);

  const handleCellSelect = useCallback((row, col) => {
    if (!isSelecting) {
      setSelectedCells([{ row, col }]);
      setIsSelecting(true);
    } else {
      const newSelection = [...selectedCells, { row, col }];
      setSelectedCells(newSelection);
    }
  }, [isSelecting, selectedCells]);

  const handleSelectionEnd = useCallback(() => {
    if (selectedCells.length > 1 && gameData) {
      const selectedWord = selectedCells
        .map(cell => gameData.grid[cell.row][cell.col])
        .join('');
      
      const reverseWord = selectedWord.split('').reverse().join('');
      
      // Check if the selected sequence matches any word
      const matchedWord = gameData.words.find(wordInfo => 
        wordInfo.word === selectedWord || wordInfo.word === reverseWord
      );

      if (matchedWord && !foundWords.has(matchedWord.word)) {
        setFoundWords(prev => new Set([...prev, matchedWord.word]));
      }
    }
    
    setSelectedCells([]);
    setIsSelecting(false);
  }, [selectedCells, gameData, foundWords]);

  const resetGame = () => {
    const data = generateWordSearch(words, 15, 12);
    setGameData(data);
    setFoundWords(new Set());
    setSelectedCells([]);
    setIsSelecting(false);
  };

  if (!gameData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Word Search</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={resetGame}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Word List */}
        <div className="w-80 bg-slate-800 p-6 overflow-y-auto">
          <WordList 
            words={words} 
            foundWords={foundWords}
            totalWords={words.length}
          />
        </div>

        {/* Main Game Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-center items-center min-h-full">
            <WordGrid 
              grid={gameData.grid}
              selectedCells={selectedCells}
              foundWords={foundWords}
              wordPositions={gameData.words}
              onCellSelect={handleCellSelect}
              onSelectionEnd={handleSelectionEnd}
              isSelecting={isSelecting}
            />
          </div>
        </div>
      </div>

      {/* Game Complete Modal */}
      {foundWords.size === words.length && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
            <p className="mb-6">You found all {words.length} words!</p>
            <button 
              onClick={resetGame}
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
