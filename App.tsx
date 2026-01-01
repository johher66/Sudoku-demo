
import React, { useState, useEffect, useCallback } from 'react';
import { SudokuBoard, SudokuCellData } from './types';
import { SOLVED_BOARD, BOARD_MASK } from './constants';
import SudokuGrid from './components/SudokuGrid';
import Celebration from './components/Celebration';

const INITIAL_TIME = 15;

const App: React.FC = () => {
  const [board, setBoard] = useState<SudokuBoard>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [emptyCells, setEmptyCells] = useState<{ r: number, c: number }[]>([]);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

  const initGame = useCallback(() => {
    const initialBoard: SudokuBoard = [];
    const hidden: { r: number, c: number }[] = [];

    for (let r = 0; r < 9; r++) {
      const row: SudokuCellData[] = [];
      for (let c = 0; c < 9; c++) {
        const isShown = BOARD_MASK[r][c] === 1;
        row.push({
          value: isShown ? SOLVED_BOARD[r][c] : null,
          isInitial: isShown
        });
        if (!isShown) {
          hidden.push({ r, c });
        }
      }
      initialBoard.push(row);
    }

    setBoard(initialBoard);
    setIsComplete(false);
    setIsAutoFilling(false);
    setTimeLeft(INITIAL_TIME);
    setEmptyCells(hidden.sort(() => Math.random() - 0.5));
    
    const timer = setTimeout(() => setIsAutoFilling(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize board on mount
  useEffect(() => {
    const cleanup = initGame();
    return cleanup;
  }, [initGame]);

  // Countdown Logic
  useEffect(() => {
    if (isComplete || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, timeLeft]);

  // Filling Logic
  useEffect(() => {
    if (!isAutoFilling || emptyCells.length === 0) {
      if (isAutoFilling && emptyCells.length === 0) {
        const timer = setTimeout(() => setIsComplete(true), 800);
        return () => clearTimeout(timer);
      }
      return;
    }

    const fillNextCell = () => {
      setBoard(prev => {
        const nextBoard = [...prev.map(row => [...row])];
        if (emptyCells.length === 0) return prev;
        const { r, c } = emptyCells[0];
        nextBoard[r][c] = {
          ...nextBoard[r][c],
          value: SOLVED_BOARD[r][c]
        };
        return nextBoard;
      });
      setEmptyCells(prev => prev.slice(1));
    };

    const delay = emptyCells.length > 20 ? 80 : 150; 
    const timer = setTimeout(fillNextCell, delay);
    return () => clearTimeout(timer);
  }, [isAutoFilling, emptyCells]);

  return (
    <div className="mobile-container flex flex-col items-center justify-between py-12 px-4 overflow-hidden">
      {/* Header */}
      <div className="w-full text-center space-y-2 mt-4 relative z-20">
        <h2 className="text-slate-400 text-sm font-semibold tracking-widest uppercase">Elite Challenge</h2>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Sudoku Master</h1>
        
        {/* Stress Timer */}
        <div className="flex flex-col items-center justify-center mt-4">
          <div className={`
            transition-all duration-300 transform
            ${timeLeft < 5 && !isComplete ? 'scale-125 text-red-500 animate-pulse' : 'text-yellow-400 scale-110'}
            font-black text-6xl drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]
          `}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
          <div className="text-yellow-400/60 text-xs font-bold uppercase tracking-[0.3em] mt-1">
            Hurry Up!
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-6">
          <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 backdrop-blur-md">
            <span className="text-slate-400 text-[10px] block leading-none font-bold">DIFFICULTY</span>
            <span className="text-white font-bold">Expert</span>
          </div>
          <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 backdrop-blur-md">
            <span className="text-slate-400 text-[10px] block leading-none font-bold">POINTS</span>
            <span className="text-white font-bold">12,450</span>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="relative z-10 w-full flex justify-center py-4">
        {board.length > 0 && <SudokuGrid board={board} />}
      </div>

      {/* Footer Controls */}
      <div className="w-full space-y-6 mb-4 relative z-20">
        <div className="grid grid-cols-9 gap-1 px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} className="aspect-square bg-slate-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-lg border border-white/5 active:bg-blue-600 transition-all">
              {num}
            </button>
          ))}
        </div>
        
        <div className="flex justify-around items-center text-slate-400 px-4">
          <div className="flex flex-col items-center group cursor-pointer">
             <div className="p-3 bg-slate-800/80 rounded-full mb-1 border border-white/5 transition-colors group-active:bg-slate-700">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
             </div>
             <span className="text-[10px] font-bold uppercase tracking-wider">Undo</span>
          </div>
          <div className="flex flex-col items-center group cursor-pointer">
             <div className="p-3 bg-slate-800/80 rounded-full mb-1 border border-white/5 transition-colors group-active:bg-slate-700">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </div>
             <span className="text-[10px] font-bold uppercase tracking-wider">Erase</span>
          </div>
          <div className="flex flex-col items-center group cursor-pointer">
             <div className="p-3 bg-slate-800/80 rounded-full mb-1 border border-white/5 transition-colors group-active:bg-slate-700">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </div>
             <span className="text-[10px] font-bold uppercase tracking-wider">Notes</span>
          </div>
        </div>
      </div>

      {isComplete && <Celebration onRestart={initGame} />}

      {/* Floating background numbers */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-1/4 -left-10 text-8xl font-black text-slate-500 blur-sm rotate-12">4</div>
        <div className="absolute bottom-1/4 -right-10 text-9xl font-black text-slate-500 blur-sm -rotate-12">9</div>
        <div className="absolute top-10 right-10 text-6xl font-black text-slate-500 blur-sm rotate-45">7</div>
      </div>
    </div>
  );
};

export default App;
