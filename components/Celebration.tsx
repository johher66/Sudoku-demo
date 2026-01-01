
import React, { useEffect } from 'react';

declare const confetti: any;

interface CelebrationProps {
  onRestart: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({ onRestart }) => {
  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-auto z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="text-center p-8 rounded-3xl bg-white/10 border border-white/20 shadow-2xl scale-110 animate-in zoom-in duration-500">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4 uppercase tracking-tighter">
          Congratulations!
        </h1>
        <div className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">
          100% SOLVED
        </div>
        <div className="flex justify-center space-x-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-10 h-10 text-yellow-400 fill-current animate-bounce" style={{ animationDelay: `${i * 100}ms` }} viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        
        <button 
          onClick={onRestart}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 px-10 rounded-full shadow-xl transform transition-all active:scale-95 hover:scale-105 uppercase tracking-widest border border-white/20"
        >
          Restart Challenge
        </button>
      </div>
    </div>
  );
};

export default Celebration;
