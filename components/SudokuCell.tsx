
import React from 'react';
import { SudokuCellData } from '../types';

interface SudokuCellProps {
  data: SudokuCellData;
  rowIndex: number;
  colIndex: number;
}

const SudokuCell: React.FC<SudokuCellProps> = ({ data, rowIndex, colIndex }) => {
  const isBottomEdge = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;
  const isRightEdge = (colIndex + 1) % 3 === 0 && colIndex !== 8;

  return (
    <div
      className={`
        relative flex items-center justify-center w-full h-full text-2xl font-bold transition-all duration-300
        ${data.isInitial ? 'text-slate-400' : 'text-blue-400 scale-110'}
        ${isBottomEdge ? 'border-b-4 border-slate-700' : 'border-b border-slate-800'}
        ${isRightEdge ? 'border-r-4 border-slate-700' : 'border-r border-slate-800'}
        bg-slate-900/40
      `}
    >
      {data.value && (
        <span className={`animate-in fade-in zoom-in duration-500`}>
          {data.value}
        </span>
      )}
      
      {/* Decorative pulse for auto-filled numbers */}
      {!data.isInitial && data.value && (
        <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export default SudokuCell;
