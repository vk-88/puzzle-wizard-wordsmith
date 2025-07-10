
import React from 'react';
import { Check, HelpCircle } from 'lucide-react';

interface WordListProps {
  words: string[];
  foundWords: Set<string>;
  totalWords: number;
}

export const WordList: React.FC<WordListProps> = ({ words, foundWords, totalWords }) => {
  const progress = (foundWords.size / totalWords) * 100;

  return (
    <div className="h-full">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <h2 className="text-lg font-semibold">Words to find</h2>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Progress</span>
            <span>{foundWords.size}/{totalWords}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {words.map((word, index) => {
          const isFound = foundWords.has(word);
          return (
            <div
              key={index}
              className={`
                flex items-center justify-between p-3 rounded-lg transition-all duration-300
                ${isFound 
                  ? 'bg-green-900 bg-opacity-50 border border-green-500' 
                  : 'bg-slate-700 border border-slate-600'
                }
              `}
            >
              <span 
                className={`
                  font-medium transition-all duration-300
                  ${isFound ? 'text-green-300 line-through' : 'text-white'}
                `}
              >
                {word}
              </span>
              {isFound && (
                <Check className="w-4 h-4 text-green-400 animate-in fade-in duration-300" />
              )}
            </div>
          );
        })}
      </div>

      {foundWords.size === totalWords && (
        <div className="mt-6 p-4 bg-green-900 bg-opacity-50 border border-green-500 rounded-lg text-center">
          <div className="text-green-300 font-semibold">🎉 All words found!</div>
        </div>
      )}
    </div>
  );
};
