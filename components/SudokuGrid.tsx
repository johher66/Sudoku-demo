
import React from 'react';
import { SudokuBoard } from '../types';
import SudokuCell from './SudokuCell';

interface SudokuGridProps {
  board: SudokuBoard;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ board }) => {
  return (
    <div className="w-full max-w-[90vw] aspect-square border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-slate-900">
      <div className="grid grid-cols-9 h-full w-full">
        {board.map((row, rIdx) => (
          row.map((cell, cIdx) => (
            <SudokuCell 
              key={`${rIdx}-${cIdx}`} 
              data={cell} 
              rowIndex={rIdx} 
              colIndex={cIdx} 
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default SudokuGrid;
