import React, { useState, useEffect, useRef } from 'react';
import { Dices, Disc } from 'lucide-react';
import { DiceChallenge } from '../types';
import { SOUNDS } from '../constants';

interface DiceRollerProps {
  challenge: DiceChallenge;
  onRollComplete: (roll: number) => void;
  playSfx: (url: string, volumeScale?: number) => void;
  triggerShake: () => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ challenge, onRollComplete, playSfx, triggerShake }) => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const rollInterval = useRef<any>(null);

  const rollDice = () => {
    setIsRolling(true);
    playSfx(SOUNDS.DICE_ROLL);
    
    let duration = 0;
    rollInterval.current = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * 20) + 1);
      duration += 50;
      
      if (duration > 1500) {
        if (rollInterval.current) clearInterval(rollInterval.current);
        finishRoll();
      }
    }, 50);
  };

  const finishRoll = () => {
    const finalRoll = Math.floor(Math.random() * 20) + 1;
    setResult(finalRoll);
    setIsRolling(false);
    
    if (finalRoll >= challenge.target) {
        // Success: Lower volume (0.4 scale)
        playSfx(SOUNDS.SUCCESS, 0.4);
    } else {
        // Failure: Standard volume + Trigger Screen Shake
        playSfx(SOUNDS.FAILURE, 1.0);
        triggerShake();
    }

    setTimeout(() => onRollComplete(finalRoll), 2500);
  };

  useEffect(() => {
    return () => {
        if (rollInterval.current) clearInterval(rollInterval.current);
    }
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="flex flex-col items-center gap-10 animate-in fade-in zoom-in duration-500 relative">
        
        {/* Ritual Circles / Decorative Rings */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-stone-800 rounded-full opacity-30 ${isRolling ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-dashed border-cyan-900/40 rounded-full opacity-40 ${isRolling ? 'animate-spin' : ''}`} style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border-2 border-stone-800 rounded-full opacity-60 ${isRolling ? 'scale-110' : 'scale-100'} transition-transform duration-1000`} />

        <h2 className="text-5xl font-serif text-stone-200 tracking-[0.3em] uppercase border-b-2 border-stone-800 pb-6 relative z-10 text-flicker">
          {challenge.statName}
        </h2>
        
        <div className="relative group">
          {/* Main Dice Visual - Circular Portal Style */}
          <div className={`w-48 h-48 flex items-center justify-center rounded-full border-4 transition-all duration-500 relative z-10 overflow-hidden shadow-2xl
            ${isRolling ? 'border-cyan-500/50 shadow-[0_0_60px_rgba(6,182,212,0.4)]' : 'border-stone-600'}
            ${result !== null ? (result >= challenge.target ? 'border-green-500 bg-green-950/20 shadow-[0_0_80px_rgba(34,197,94,0.4)]' : 'border-red-600 bg-red-950/20 shadow-[0_0_80px_rgba(220,38,38,0.6)]') : 'bg-black'}
          `}>
             <div className="flex flex-col items-center justify-center">
                 <span className={`text-8xl font-serif font-bold ${result !== null ? (result >= challenge.target ? 'text-green-400' : 'text-red-500') : 'text-stone-100'}`}>
                   {result !== null ? result : currentNumber}
                 </span>
                 {isRolling && <span className="absolute bottom-8 text-[10px] tracking-widest text-cyan-400 animate-pulse">DIVINING...</span>}
             </div>
             
             {/* Inner Ring Pulse */}
             {isRolling && <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-20" />}
          </div>
        </div>

        <div className="text-stone-500 font-mono text-xs tracking-[0.3em] uppercase flex flex-col items-center gap-2">
            <span className="text-stone-600">Threshold Required</span>
            <span className="text-stone-200 font-bold text-3xl">{challenge.target}</span>
        </div>

        {!isRolling && result === null && (
          <button 
            onClick={rollDice}
            onMouseEnter={() => playSfx(SOUNDS.HOVER)}
            className="group relative px-12 py-5 bg-stone-100 text-black font-serif font-bold tracking-[0.25em] hover:bg-cyan-900 hover:text-cyan-50 transition-all duration-300 flex items-center gap-4 mt-4 border border-white hover:border-cyan-500 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Dices size={24} />
            <span>TEST FATE</span>
          </button>
        )}

        {result !== null && (
          <div className="text-3xl font-serif mt-2 tracking-widest uppercase animate-in slide-in-from-bottom-5 fade-in duration-500">
            {result >= challenge.target ? (
              <span className="text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]">Destiny Aligned</span>
            ) : (
              <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] text-flicker">Thread Severed</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;