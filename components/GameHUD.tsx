
import React, { useState } from 'react';
import { Brain, Box, X, Info, HelpCircle } from 'lucide-react';
import { GameState, GameStatus } from '../types';
import { ITEMS_DB, SOUNDS } from '../constants';

interface GameHUDProps {
  gameState: GameState;
  status: GameStatus;
  playSfx: (url: string) => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ gameState, status, playSfx }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Hide HUD in Menu or Cinematic modes (Show in Playing, Dice, Investigation, Puzzle)
  if (status === GameStatus.MENU || status === GameStatus.CINEMATIC) return null;

  const handleItemClick = (itemName: string) => {
    playSfx(SOUNDS.CLICK);
    setSelectedItem(itemName);
  };

  const closeItemModal = () => {
    playSfx(SOUNDS.CLICK);
    setSelectedItem(null);
  };

  return (
    <>
    <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-start z-40 pointer-events-none">
      
      {/* Sanity Meter */}
      <div className="flex flex-col gap-2 w-48 md:w-64 drop-shadow-md">
        <div className="flex items-center gap-3 text-stone-400">
          <Brain size={16} className={gameState.sanity < 30 ? 'text-red-600 animate-pulse' : ''} />
          <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-stone-500">Psychological Stability</span>
        </div>
        <div className="w-full h-3 bg-black border border-stone-800 rounded-none overflow-hidden shadow-inner relative">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('/THE_SILENT_THREAD/images/noise.svg')] opacity-20" />
          
          <div 
            className={`h-full transition-all duration-700 ease-out relative 
              ${gameState.sanity < 30 ? 'bg-red-800 shadow-[0_0_15px_red]' : 'bg-stone-400'}
            `}
            style={{ width: `${gameState.sanity}%` }}
          >
             <div className="absolute right-0 top-0 bottom-0 w-px bg-white/50 shadow-[0_0_5px_white]" />
          </div>
        </div>
        <span className="text-[9px] font-mono text-stone-600 text-right">{gameState.sanity} / 100</span>
      </div>

      {/* Inventory */}
      <div className="flex flex-col gap-3 items-end pointer-events-auto">
        <div className="flex items-center gap-2 text-stone-500">
          <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Evidence</span>
          <Box size={14} />
        </div>
        <div className="flex flex-wrap justify-end gap-3 min-h-[1.5rem] items-center max-w-[300px]">
            {gameState.inventory.length === 0 ? (
                <span className="text-stone-800 text-[10px] font-mono uppercase tracking-widest border border-stone-900 px-2 py-1 bg-black/50">No Items</span>
            ) : (
                gameState.inventory.map((item, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleItemClick(item)}
                        onMouseEnter={() => playSfx(SOUNDS.HOVER)}
                        className="group relative w-10 h-10 flex items-center justify-center bg-stone-900 border border-stone-700 hover:border-cyan-500 hover:bg-stone-800 text-stone-400 hover:text-cyan-200 shadow-md transition-all duration-200 overflow-hidden"
                    >
                        {ITEMS_DB[item]?.icon ? React.createElement(ITEMS_DB[item].icon, { size: 18 }) : <HelpCircle size={18} />}
                        <div className="absolute inset-0 bg-cyan-400/10 scale-0 group-hover:scale-100 transition-transform duration-200 rounded-full blur-md" />
                    </button>
                ))
            )}
        </div>
      </div>
    </div>

    {/* Item Inspection Modal */}
    {selectedItem && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in zoom-in duration-300 p-4 pointer-events-auto">
            <div className="bg-stone-950 border border-stone-800 p-8 md:p-12 max-w-lg w-full relative shadow-[0_0_100px_rgba(0,0,0,1)]">
                {/* Decoration Lines */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-stone-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-stone-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-stone-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-stone-500" />

                <button onClick={closeItemModal} className="absolute top-4 right-4 text-stone-600 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                
                <div className="flex flex-col items-center text-center gap-8">
                    <div className="p-8 bg-black rounded-full border border-stone-800 text-stone-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative group">
                        <div className="absolute inset-0 bg-stone-100 opacity-0 group-hover:opacity-5 rounded-full transition-opacity" />
                        {ITEMS_DB[selectedItem]?.icon ? React.createElement(ITEMS_DB[selectedItem].icon, { size: 64 }) : <Info size={64} />}
                    </div>
                    <div className="w-full space-y-4">
                        <h3 className="text-2xl font-serif text-stone-100 uppercase tracking-[0.3em] border-b border-stone-800 pb-4 w-full">
                            {selectedItem}
                        </h3>
                        <p className="font-mono text-sm md:text-base text-stone-400 leading-relaxed italic tracking-wide">
                            "{ITEMS_DB[selectedItem]?.description || "A mysterious object found in the dark."}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default GameHUD;
