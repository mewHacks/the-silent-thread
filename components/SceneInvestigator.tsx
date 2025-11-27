/// <reference lib="dom" />
import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft, Eye, Lock } from 'lucide-react';
import { InvestigationNode, Hotspot } from '../types';
import { SOUNDS } from '../constants';

interface SceneInvestigatorProps {
  node: InvestigationNode;
  onExit: () => void;
  onItemFound: (item: string, text: string) => void;
  onPuzzleTrigger: (puzzleId: string) => void;
  playSfx: (url: string) => void;
  inventory: string[];
}

const SceneInvestigator: React.FC<SceneInvestigatorProps> = ({ node, onExit, onItemFound, onPuzzleTrigger, playSfx, inventory }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [narrativeText, setNarrativeText] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);

  // Clear narrative after a few seconds
  useEffect(() => {
    if (!narrativeText) return;
    const timer = setTimeout(() => setNarrativeText(""), 2000);
    return () => clearTimeout(timer);
  }, [narrativeText]);


  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const x = (e.clientX / clientWidth - 0.5) * 2; 
    const y = (e.clientY / clientHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (foundHotspots.includes(hotspot.id)) return;

    if (hotspot.requiredItem && !inventory.includes(hotspot.requiredItem)) {
      playSfx(SOUNDS.FAILURE);
      return;
    }

    playSfx(SOUNDS.CLICK);

    // Puzzle
    if (hotspot.puzzleId) {
      onPuzzleTrigger(hotspot.puzzleId);
      return;
    }

    // Item reward
    if (hotspot.itemReward) {
      playSfx(SOUNDS.ITEM_GET);
      setFoundHotspots(prev => [...prev, hotspot.id]);
      onItemFound(hotspot.itemReward, hotspot.description);
      return;
    }

    // Show narrative toast
    const flavor = hotspot.onInteractText || hotspot.description;
    setFoundHotspots(prev => [...prev, hotspot.id]);
    setNarrativeText(flavor);   
    return;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 z-20 overflow-hidden cursor-crosshair bg-black"
    >
      {/* Parallax Background */}
      <div 
        className="absolute inset-[-5%] w-[110%] h-[110%] bg-cover bg-center transition-transform duration-100 ease-out"
        style={{
          backgroundImage: `url(${node.image})`,
          transform: `translate(${-mousePos.x * 20}px, ${-mousePos.y * 20}px) scale(1.05)`
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* UI Overlay */}
      <div className="absolute bottom-8 left-8 pointer-events-none z-40 max-w-md">
          <div className="bg-black/70 backdrop-blur-md border-l-2 border-cyan-500 p-6 animate-in slide-in-from-left duration-500 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <h3 className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Eye size={14} /> Investigation Mode
              </h3>
              <p className="text-stone-300 font-serif text-lg leading-relaxed border-t border-stone-700/50 pt-2 mt-2">{node.introText}</p>
          </div>
      </div>

      {/* Exit Button */}
      <div className="absolute bottom-8 right-8 pointer-events-auto z-40">
          <button 
            onClick={() => { playSfx(SOUNDS.CLICK); onExit(); }}
            className="group flex items-center gap-3 px-6 py-3 bg-stone-900/80 border border-stone-700 hover:bg-stone-800 hover:border-white hover:text-white text-stone-400 transition-all uppercase tracking-widest font-mono text-sm shadow-lg"
          >
              <span>Stop Searching</span>
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </button>
      </div>

      {/* Hotspots */}
      {node.hotspots.map(spot => {
        if (foundHotspots.includes(spot.id) && spot.itemReward) return null;

        return (
            <div
                key={spot.id}
                onClick={() => handleHotspotClick(spot)}
                onMouseEnter={() => { playSfx(SOUNDS.HOVER); setHoveredHotspot(spot.id); }}
                onMouseLeave={() => setHoveredHotspot(null)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300"
                style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: `${spot.width}%`,
                    height: `${spot.height}%`,
                    transform: `translate(${-mousePos.x * 30}px, ${-mousePos.y * 30}px)`
                }}
            >
                <div className={`w-full h-full border border-cyan-500/0 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-500 rounded-full ${hoveredHotspot === spot.id ? 'scale-110' : 'scale-100'}`}>
                    {hoveredHotspot === spot.id && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-cyan-200 text-[10px] uppercase tracking-widest px-2 py-1 whitespace-nowrap border border-cyan-900 shadow-lg pointer-events-none">
                            {spot.puzzleId ? <><Lock size={10} className="inline mr-1" /> Inspect</> : <><Search size={10} className="inline mr-1" /> Inspect</>}
                        </div>
                    )}
                </div>
            </div>
        );
      })}

      {/* Narrative Toast */}
      {narrativeText && (
        <div className="absolute bottom-0 left-0 right-0 z-50 py-4 px-8 bg-black/80 backdrop-blur-md border-t border-cyan-900 animate-in fade-in duration-300">
          <p className="text-stone-200 text-center font-serif text-lg italic">
            {narrativeText}
          </p>
        </div>
      )}
    </div>
  );
};

export default SceneInvestigator;
