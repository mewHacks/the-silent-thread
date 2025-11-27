
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Delete, Zap, Disc, RotateCw } from 'lucide-react';
import { PuzzleConfig } from '../types';
import { SOUNDS } from '../constants';

interface PuzzleInterfaceProps {
  config: PuzzleConfig;
  onSuccess: () => void;
  onExit: () => void;
  playSfx: (url: string) => void;
  triggerShake?: () => void;
}

const PuzzleInterface: React.FC<PuzzleInterfaceProps> = ({ config, onSuccess, onExit, playSfx, triggerShake }) => {
  const [isSolved, setIsSolved] = useState(false);

  const handleSolve = () => {
      setIsSolved(true);
      playSfx(SOUNDS.SUCCESS);
      setTimeout(onSuccess, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
        <div className="bg-stone-900 border-2 border-stone-700 p-8 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-md w-full animate-in zoom-in duration-300 relative">
            
            <button onClick={onExit} className="absolute top-4 right-4 text-stone-500 hover:text-white">Close</button>
            
            <div className="text-center mb-6">
                <div className={`mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full border ${isSolved ? 'border-green-500 text-green-500 bg-green-900/20' : 'border-stone-600 text-stone-400 bg-stone-800'}`}>
                    {config.type === 'keypad' && <Lock size={24} />}
                    {config.type === 'circuit' && <Zap size={24} />}
                    {config.type === 'rune' && <Disc size={24} />}
                </div>
                <h3 className="font-serif text-xl text-stone-200 tracking-widest uppercase mb-1">
                    {config.type === 'keypad' && "Security Mechanism"}
                    {config.type === 'circuit' && "Power Grid Breaker"}
                    {config.type === 'rune' && "Seal of the Loom"}
                </h3>
                <p className="font-mono text-xs text-stone-500">{config.description}</p>
            </div>

            <div className="flex justify-center">
                {config.type === 'keypad' && (
                    <KeypadPuzzle config={config} onSolve={handleSolve} playSfx={playSfx} isSolved={isSolved} triggerShake={triggerShake} />
                )}
                {config.type === 'circuit' && (
                    <CircuitPuzzle config={config} onSolve={handleSolve} playSfx={playSfx} isSolved={isSolved} />
                )}
                {config.type === 'rune' && (
                    <RunePuzzle config={config} onSolve={handleSolve} playSfx={playSfx} isSolved={isSolved} />
                )}
            </div>
        </div>
    </div>
  );
};

// --- SUB-PUZZLE: KEYPAD ---
const KeypadPuzzle = ({ config, onSolve, playSfx, isSolved, triggerShake }: any) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);

    const handlePress = (num: string) => {
        if (isSolved) return;
        if (input.length < 4) {
          playSfx(SOUNDS.CLICK);
          setInput(prev => prev + num);
        }
    };

    const handleDelete = () => {
        if (isSolved) return;
        playSfx(SOUNDS.CLICK);
        setInput(prev => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (input === config.correctCode) {
            onSolve();
        } 
        // Easter Egg: HELL
        else if (input === "666") {
            playSfx(SOUNDS.HEARTBEAT); // Scary thump
            if (triggerShake) triggerShake();
            setError(true);
            setInput("HELL");
            setTimeout(() => { setError(false); setInput(""); }, 1000);
        }
        // Easter Egg: Mockery
        else if (input === "1234") {
            playSfx(SOUNDS.FAILURE);
            setInput("TOO EASY");
            setTimeout(() => setInput(""), 1000);
        }
        else {
            playSfx(SOUNDS.FAILURE);
            setError(true);
            setInput("");
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="w-full max-w-xs">
             <div className={`bg-black border border-stone-600 p-4 mb-6 text-center font-mono text-3xl tracking-[0.5em] h-16 flex items-center justify-center
                ${error ? 'text-red-500 border-red-900 animate-shake' : 'text-cyan-500'}
                ${isSolved ? 'text-green-500 border-green-900' : ''}
            `}>
                {isSolved ? 'OPEN' : input.padEnd(input.length, '_')}
            </div>
            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button key={num} onClick={() => handlePress(num.toString())} className="h-12 bg-stone-800 border border-stone-700 hover:bg-stone-700 hover:border-cyan-500 text-stone-300 font-mono text-xl transition-colors">{num}</button>
                ))}
                <button onClick={handleDelete} className="h-12 bg-stone-900 border border-stone-800 text-red-400 hover:bg-red-900/20 flex items-center justify-center"><Delete size={18} /></button>
                <button onClick={() => handlePress("0")} className="h-12 bg-stone-800 border border-stone-700 hover:bg-stone-700 hover:border-cyan-500 text-stone-300 font-mono text-xl">0</button>
                <button onClick={handleSubmit} className="h-12 bg-cyan-900/30 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/50 flex items-center justify-center"><Unlock size={18} /></button>
            </div>
        </div>
    );
};

// --- SUB-PUZZLE: CIRCUIT (Lights Out) ---
const CircuitPuzzle = ({ config, onSolve, playSfx, isSolved }: any) => {
    const size = config.gridSize || 3;
    // Initialize grid based on config (false = OFF, true = ON)
    // Goal: All ON
    const [grid, setGrid] = useState<boolean[]>(() => {
        const arr = new Array(size * size).fill(true);
        // Turn off specific lights based on initial config
        if (config.initialLights) {
            config.initialLights.forEach((idx: number) => {
                arr[idx] = false;
            });
        } else {
             // Default puzzle state
             [1, 3, 4, 5, 7].forEach(i => arr[i] = false);
        }
        return arr;
    });

    useEffect(() => {
        if (!isSolved && grid.every(x => x === true)) {
            onSolve();
        }
    }, [grid, isSolved]);

    const toggle = (index: number) => {
        if (isSolved) return;
        playSfx(SOUNDS.CLICK);
        
        const newGrid = [...grid];
        const row = Math.floor(index / size);
        const col = index % size;

        // Toggle self and neighbors (Cross pattern)
        const moves = [
            index, // self
            row > 0 ? index - size : null, // up
            row < size - 1 ? index + size : null, // down
            col > 0 ? index - 1 : null, // left
            col < size - 1 ? index + 1 : null // right
        ];

        moves.forEach(idx => {
            if (idx !== null) newGrid[idx] = !newGrid[idx];
        });

        setGrid(newGrid);
    };

    return (
        <div className="grid grid-cols-3 gap-3 p-4 bg-black/50 rounded-lg border border-stone-800">
            {grid.map((isOn, i) => (
                <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={`w-16 h-16 rounded-sm border-2 transition-all duration-300 relative overflow-hidden group
                        ${isOn 
                            ? 'bg-amber-100 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]' 
                            : 'bg-stone-900 border-stone-800 shadow-inner'
                        }
                    `}
                >
                    {isOn && <div className="absolute inset-0 bg-white/50 animate-pulse" />}
                    <div className="absolute inset-0 bg-[url('/THE_SILENT_THREAD/images/noise.svg')] opacity-20" />
                </button>
            ))}
            <div className="col-span-3 text-center mt-2">
                <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">Connect all nodes</p>
            </div>
        </div>
    );
};

// --- SUB-PUZZLE: RUNE (Ring Rotation) ---
const RunePuzzle = ({ config, onSolve, playSfx, isSolved }: any) => {
    // 3 Rings. Angles in degrees.
    const [angles, setAngles] = useState([0, 0, 0]);
    // Target: All rings must align to 0 (top)
    // Randomize start? Or fixed start. Let's do fixed for deterministic gameplay.
    // Start: [135, 225, 90]
    
    // Reset to specific scramble on mount
    useEffect(() => {
        setAngles([135, 225, 90]);
    }, []);

    const rotate = (ringIndex: number) => {
        if (isSolved) return;
        playSfx(SOUNDS.CLICK);
        const newAngles = [...angles];
        newAngles[ringIndex] = (newAngles[ringIndex] + 45) % 360;
        setAngles(newAngles);

        // Check win condition: All aligned to 0 (or 360)
        // We allow 0 or 360
        if (newAngles.every(a => a === 0 || a === 360)) {
            onSolve();
        }
    };

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-cyan-900/10 rounded-full blur-xl" />

            {/* Ring 3 (Outer) */}
            <button 
                onClick={() => rotate(0)}
                className="absolute inset-0 w-full h-full rounded-full border-[12px] border-stone-800 border-t-cyan-700 hover:border-stone-700 transition-transform duration-500 ease-out flex items-start justify-center"
                style={{ transform: `rotate(${angles[0]}deg)` }}
            >
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1 shadow-[0_0_10px_cyan]" />
            </button>

            {/* Ring 2 (Middle) */}
            <button 
                onClick={() => rotate(1)}
                className="absolute w-44 h-44 rounded-full border-[12px] border-stone-800 border-t-cyan-600 hover:border-stone-700 transition-transform duration-500 ease-out flex items-start justify-center"
                style={{ transform: `rotate(${angles[1]}deg)` }}
            >
                 <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1 shadow-[0_0_10px_cyan]" />
            </button>

             {/* Ring 1 (Inner) */}
            <button 
                onClick={() => rotate(2)}
                className="absolute w-24 h-24 rounded-full border-[12px] border-stone-800 border-t-cyan-500 hover:border-stone-700 transition-transform duration-500 ease-out flex items-start justify-center"
                style={{ transform: `rotate(${angles[2]}deg)` }}
            >
                 <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1 shadow-[0_0_10px_cyan]" />
            </button>
            
            {/* Center / Goal Indicator */}
            <div className={`absolute w-8 h-8 rounded-full border-2 z-10 transition-all duration-500 ${isSolved ? 'bg-cyan-400 border-white shadow-[0_0_30px_cyan]' : 'bg-black border-stone-700'}`}>
                {/* Top Marker */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-0.5 h-32 bg-gradient-to-b from-stone-500 to-transparent pointer-events-none" />
            </div>
            
             <div className="absolute -bottom-12 text-center w-full">
                <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest flex items-center justify-center gap-2">
                    <RotateCw size={10} /> Align the Ley Lines
                </p>
            </div>
        </div>
    );
};

export default PuzzleInterface;
