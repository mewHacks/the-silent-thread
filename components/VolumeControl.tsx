
import React, { useState } from 'react';
import { Volume2, VolumeX, HelpCircle, X, MousePointer, Brain, Dices, Eye } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  setVolume: (v: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, setVolume }) => {
  const [prevVolume, setPrevVolume] = useState(0.4);
  const [showHelp, setShowHelp] = useState(false);

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      // Restore to previous volume, or default to 0.4 if previous was 0
      setVolume(prevVolume > 0 ? prevVolume : 0.4);
    }
  };

  return (
    <>
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* Help Button */}
        <button
          onClick={() => setShowHelp(true)}
          className="p-3 bg-black/40 backdrop-blur-sm rounded-lg border border-stone-800/50 hover:border-cyan-500/50 hover:text-cyan-400 text-stone-400 transition-all shadow-lg group"
          title="How to Play"
        >
          <HelpCircle size={18} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-3 p-3 bg-black/40 backdrop-blur-sm rounded-lg border border-stone-800/50 hover:border-stone-600 transition-all shadow-lg">
          <button 
            onClick={toggleMute}
            className="text-stone-400 hover:text-stone-200 transition-colors"
            title={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <div className="w-24 flex items-center">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-200 hover:accent-cyan-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-stone-950 border border-stone-800 w-full max-w-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-900 bg-black/50">
              <h2 className="text-2xl font-serif text-stone-200 tracking-widest uppercase flex items-center gap-3">
                <HelpCircle className="text-cyan-600" size={24} />
                Survival Guide
              </h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-stone-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[80vh]">
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-stone-900 h-fit rounded border border-stone-800 text-cyan-500">
                    <MousePointer size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-stone-300 text-lg uppercase tracking-wider mb-1">Choices Matter</h3>
                    <p className="font-mono text-stone-500 text-xs leading-relaxed">
                      Every decision branches the narrative. Some paths require specific items or knowledge found in previous chapters.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-stone-900 h-fit rounded border border-stone-800 text-red-500">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-stone-300 text-lg uppercase tracking-wider mb-1">Sanity</h3>
                    <p className="font-mono text-stone-500 text-xs leading-relaxed">
                      Traumatic events drain your sanity. Low stability causes hallucinations and unlocks dangerous behavioral options.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-stone-900 h-fit rounded border border-stone-800 text-amber-500">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-stone-300 text-lg uppercase tracking-wider mb-1">Investigation</h3>
                    <p className="font-mono text-stone-500 text-xs leading-relaxed">
                      In First-Person mode, move your cursor to explore the environment. Look for subtle distortions to find clues and items.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-stone-900 h-fit rounded border border-stone-800 text-purple-500">
                    <Dices size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-stone-300 text-lg uppercase tracking-wider mb-1">Skill Checks</h3>
                    <p className="font-mono text-stone-500 text-xs leading-relaxed">
                      Risky actions require a D20 roll. Success depends on the target threshold. Failure often leads to injury or death.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 border-t border-stone-900 pt-6 mt-2">
                 <p className="text-center font-mono text-[10px] text-stone-600 uppercase tracking-[0.2em]">
                    Headphones Strongly Recommended for Full Immersion
                 </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VolumeControl;
