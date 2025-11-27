
/// <reference lib="dom" />
import React, { useState, useEffect, useRef } from 'react';
import { Play, RefreshCw, Skull, Trophy, AlertTriangle } from 'lucide-react';
import { GameState, GameStatus, StoryNode, Option, InvestigationNode } from './types';
import { GAME_TITLE, STORY_NODES, SOUNDS, INVESTIGATION_NODES, VIDEOS, INTRO_NARRATION, SAFE_PUZZLE, FACTORY_CIRCUIT, TOWER_RUNE } from './constants';
import Typewriter from './components/Typewriter';

import GameHUD from './components/GameHUD';
import Atmosphere from './components/Atmosphere';
import DiceRoller from './components/DiceRoller';
import VolumeControl from './components/VolumeControl';
import SceneInvestigator from './components/SceneInvestigator';
import CinematicPlayer from './components/CinematicPlayer';
import PuzzleInterface from './components/PuzzleInterface';
import Logo from './components/Logo';
import LoadingScreen from './components/LoadingScreen';

const INITIAL_STATE: GameState = {
  currentNodeId: 'start',
  inventory: [],
  sanity: 100,
  sanityMax: 100,
  isGameOver: false,
  isVictory: false,
  diceRoll: null,
  volume: 0.4
};

function App() {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [tempVisualEffect, setTempVisualEffect] = useState<string | null>(null);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Audio Refs
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  // Prevent flicker on load
  useEffect(() => {
    document.fonts.ready.then(() => {
       setFontsLoaded(true);
    });
  }, []);

  // Handle BGM Volume & State Sync
  useEffect(() => {
    if (!bgmRef.current) return;
    
    // Dip volume if voice is playing
    const voiceIsPlaying = voiceRef.current && !voiceRef.current.paused;
    bgmRef.current.volume = voiceIsPlaying ? gameState.volume * 0.3 : gameState.volume;

    if (status === GameStatus.MENU && !bgmRef.current.paused) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
    }
  }, [status, gameState.volume]);

  // Handle Voice Volume
  useEffect(() => {
      if (voiceRef.current) {
          voiceRef.current.volume = Math.min(gameState.volume + 0.2, 1);
      }
  }, [gameState.volume]);

  // Cleanup
  useEffect(() => {
      return () => {
          if (bgmRef.current) {
              bgmRef.current.pause();
              bgmRef.current = null;
          }
          if (voiceRef.current) {
              voiceRef.current.pause();
              voiceRef.current = null;
          }
      };
  }, []);

  // SFX Helper
  const playSfx = (url: string, volumeScale: number = 1.0) => {
    const sfx = new Audio(url);
    sfx.volume = Math.min(gameState.volume * volumeScale + 0.1, 1);
    sfx.play().catch(e => console.warn("SFX blocked", e));
  };

  const playVoice = (url: string) => {
      if (voiceRef.current) {
          voiceRef.current.pause();
      }
      voiceRef.current = new Audio(url);
      voiceRef.current.volume = Math.min(gameState.volume + 0.2, 1);
      
      // Dip BGM while voice plays
      if (bgmRef.current) bgmRef.current.volume = gameState.volume * 0.3;
      
      voiceRef.current.play().then(() => {
          voiceRef.current!.onended = () => {
              // Restore BGM
              if (bgmRef.current) bgmRef.current.volume = gameState.volume;
          };
      }).catch(e => console.warn("Voice blocked", e));
  };

  // Trigger global screen shake
  const triggerShake = () => {
      setTempVisualEffect('shake');
      // Remove the effect class after animation completes (0.5s)
      setTimeout(() => setTempVisualEffect(null), 500);
  };

  const handleStartGame = () => {
    // CRITICAL: Initialize and play audio DIRECTLY in the click handler to satisfy browser autoplay policies.
    if (!bgmRef.current) {
        bgmRef.current = new Audio(SOUNDS.BGM);
        bgmRef.current.loop = true;
    }
    bgmRef.current.volume = gameState.volume;
    
    // Using a promise catch to handle "Not Supported" errors gracefully
    const playPromise = bgmRef.current.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn("Audio playback failed (Autoplay policy or not supported):", error);
        });
    }

    playSfx(SOUNDS.CLICK);
    setGameState({...INITIAL_STATE, currentVideoUrl: VIDEOS.INTRO});
    
    // Start with Intro Cinematic
    setStatus(GameStatus.CINEMATIC);
    setIntroPlayed(false);
  };

  const handleCinematicComplete = () => {
      // If we just finished Intro, start game
      if (!introPlayed) {
          setIntroPlayed(true);
          setStatus(GameStatus.PLAYING);
          // Play starting voice if exists
          if (STORY_NODES['start'].voiceUrl) {
              playVoice(STORY_NODES['start'].voiceUrl);
          }
      } else {
          // If we finished an Ending cinematic, go to Victory/Game Over screen
          if (gameState.endingType === 'bad' || gameState.endingType === 'shadow') {
              setStatus(GameStatus.GAME_OVER);
          } else {
              setStatus(GameStatus.VICTORY);
          }
      }
  };

  const handleOptionClick = (option: Option) => {
    playSfx(SOUNDS.CLICK);

    // Special Check for True Ending
    if (option.isTrueEnding) {
        const hasShard = gameState.inventory.includes("Metal Shard");
        const hasFile = gameState.inventory.includes("Personnel File");
        const hasCanvas = gameState.inventory.includes("Burnt Canvas");
        
        if (!hasShard || !hasFile || !hasCanvas) {
            return;
        }
    }

    if (option.sanityCost) {
      playSfx(SOUNDS.HEARTBEAT);
      setGameState(prev => ({ ...prev, sanity: Math.max(0, prev.sanity - (option.sanityCost || 0)) }));
    }
    
    // Check for Investigation Mode trigger
    // CRITICAL FIX: Ensure the investigation node actually exists
    if (option.startInvestigation && INVESTIGATION_NODES[option.startInvestigation]) {
        setGameState(prev => ({ ...prev, currentInvestigationId: option.startInvestigation }));
        setStatus(GameStatus.INVESTIGATION);
        return;
    }

    const nextNode = STORY_NODES[option.nextId];
    if (nextNode.diceChallenge) {
      setGameState(prev => ({ ...prev, currentNodeId: option.nextId }));
      setStatus(GameStatus.DICE_ROLLING);
    } else {
      transitionToNode(option.nextId);
    }
  };

  const transitionToNode = (nodeId: string) => {
    const node = STORY_NODES[nodeId];
    
    // Check if item reward
    if (node.itemReward) {
      setGameState(prev => ({
        ...prev,
        inventory: prev.inventory.includes(node.itemReward!) ? prev.inventory : [...prev.inventory, node.itemReward!]
      }));
      playSfx(SOUNDS.ITEM_GET);
    }

    if (node.effect === 'heartbeat') playSfx(SOUNDS.HEARTBEAT);
    if (node.effect === 'shake') {
        playSfx(SOUNDS.FAILURE);
        triggerShake();
    }
    if (node.effect === 'flash') playSfx(SOUNDS.SUCCESS, 0.5);

    // Voice Over Trigger
    if (node.voiceUrl) {
        playVoice(node.voiceUrl);
    }

    setGameState(prev => ({ ...prev, currentNodeId: nodeId }));

    // Check Endings & Play Cinematics
    const isEnding = nodeId.startsWith('ending_') || nodeId === 'death_shadow';
    
    if (isEnding) {
        let endingType: GameState['endingType'] = 'neutral';
        let videoUrl = VIDEOS.ENDING_NEUTRAL;

        if (nodeId === 'ending_good') { endingType = 'true'; videoUrl = VIDEOS.ENDING_TRUE; }
        else if (nodeId === 'ending_successor') { endingType = 'successor'; videoUrl = VIDEOS.ENDING_SUCCESSOR; }
        else if (nodeId === 'ending_bad' || nodeId === 'death_shadow') { endingType = 'bad'; videoUrl = VIDEOS.ENDING_BAD; }
        else if (nodeId === 'ending_shadow') { endingType = 'shadow'; videoUrl = VIDEOS.ENDING_SHADOW; }
        
        setGameState(prev => ({ ...prev, endingType, currentVideoUrl: videoUrl }));
        setStatus(GameStatus.CINEMATIC);
    }
    else if (status !== GameStatus.DICE_ROLLING) {
        setStatus(GameStatus.PLAYING);
    }
  };

  const handleDiceComplete = (roll: number) => {
    const currentNode = STORY_NODES[gameState.currentNodeId];
    const challenge = currentNode.diceChallenge!;
    
    setStatus(GameStatus.PLAYING); 

    if (roll >= challenge.target) {
      transitionToNode(challenge.successId);
    } else {
      // The DiceRoller component handles the shake/audio for failure.
      transitionToNode(challenge.failId);
    }
  };

  const handleInvestigationExit = () => {
     if (!gameState.currentInvestigationId) return;
     const node = INVESTIGATION_NODES[gameState.currentInvestigationId];
     
     // Transition to the exit node defined in the investigation data
     transitionToNode(node.exitNodeId);
  };

  const handleInvestigationItemFound = (item: string, text: string) => {
      if (item && !gameState.inventory.includes(item)) {
          setGameState(prev => ({...prev, inventory: [...prev.inventory, item]}));
      }
  };

  const handlePuzzleTrigger = (puzzleId: string) => {
      setGameState(prev => ({ ...prev, currentPuzzleId: puzzleId }));
      setStatus(GameStatus.PUZZLE);
  };

  const handlePuzzleSuccess = () => {
      let rewardItem: string | undefined;
      
      if (gameState.currentPuzzleId === 'office_safe') {
          rewardItem = SAFE_PUZZLE.successRewardItem;
      } else if (gameState.currentPuzzleId === 'factory_circuit') {
          rewardItem = FACTORY_CIRCUIT.successRewardItem;
      } else if (gameState.currentPuzzleId === 'tower_rune') {
           // For Rune puzzle, we transition to a new node
           transitionToNode(TOWER_RUNE.successNextId || 'tower_climb');
           return; 
      }

      // FIX: Check if item already exists to prevent duplicates
      if (rewardItem && !gameState.inventory.includes(rewardItem)) {
          setGameState(prev => ({
              ...prev, 
              inventory: [...prev.inventory, rewardItem!]
          }));
          playSfx(SOUNDS.ITEM_GET);
      }
      
      // Return to investigation
      setStatus(GameStatus.INVESTIGATION);
  };

  const handlePuzzleExit = () => {
      setStatus(GameStatus.INVESTIGATION);
  };

  const currentNode = STORY_NODES[gameState.currentNodeId];

  // Logic to determine if True Ending button is visible/enabled
  const canUnlockTrueEnding = () => {
    const hasShard = gameState.inventory.includes("Metal Shard");
    const hasFile = gameState.inventory.includes("Personnel File");
    const hasCanvas = gameState.inventory.includes("Burnt Canvas");
    return hasShard && hasFile && hasCanvas;
  }

  // Render Functions
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-full text-center z-20 relative space-y-12 p-6 animate-in fade-in duration-1000">
      
      {/* Logo on top - Centered and Colored to match Title */}
      <div className="group relative cursor-pointer hover:scale-105 transition-transform duration-700">
        <Logo size={160} spinning={true} className="text-stone-100 transition-colors" />
      </div>
    
      <div className="space-y-6">

        <h1 className="text-6xl md:text-9xl font-serif text-stone-100 tracking-tighter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] glitch-effect text-flicker">
          {GAME_TITLE}
        </h1>
        <div className="flex items-center justify-center gap-4">
             <div className="h-px w-12 bg-stone-200"></div>
             <p className="text-stone-200 font-mono tracking-[0.4em] text-xs uppercase flicker drop-shadow-md">
              A Psychological Horror Odyssey
             </p>
            <div className="h-px w-12 bg-stone-200"></div>
        </div>
        <p className="text-stone-300 font-mono text-xs tracking-[0.4em] uppercase opacity-80 drop-shadow-md">
            Created by mewHacks
        </p>
      </div>
      
      <button 
        onClick={handleStartGame}
        onMouseEnter={() => playSfx(SOUNDS.HOVER)}
        className="group relative px-16 py-6 bg-transparent border border-stone-600 text-stone-300 font-mono uppercase tracking-widest hover:bg-stone-100 hover:text-black hover:border-white transition-all duration-500 flex items-center gap-4 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
      >
        <Play size={18} className="group-hover:fill-black transition-transform group-hover:scale-125" />
        <span className="text-lg">Enter the Thread</span>
      </button>
      <div className="text-[10px] text-stone-600 font-mono space-y-1 opacity-70">
        <p>Use Headphones for Immersion</p>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="flex flex-col h-full relative z-10 justify-end pb-12 md:pb-24 px-4 md:px-32 max-w-7xl mx-auto w-full">
      
      {/* Story Text */}
      <div className="mb-8 p-8 md:p-10 bg-black/80 backdrop-blur-md border border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom-5 duration-700 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        <Typewriter 
          key={currentNode.id} 
          text={currentNode.text} 
          speed={20} 
          className="font-serif text-xl md:text-3xl text-stone-200 leading-relaxed drop-shadow-md whitespace-pre-wrap"
        />
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentNode.options.map((opt, idx) => {
           const locked = opt.requiredItem && !gameState.inventory.includes(opt.requiredItem);
           
           if (opt.isTrueEnding && !canUnlockTrueEnding()) return null;

           return (
            <button
                key={idx}
                disabled={locked}
                onClick={() => handleOptionClick(opt)}
                onMouseEnter={() => !locked && playSfx(SOUNDS.HOVER)}
                className={`text-left p-6 border transition-all duration-300 group relative overflow-hidden flex flex-col justify-center min-h-[6rem]
                    ${opt.isTrueEnding ? 'border-amber-700/50 bg-amber-950/40 text-amber-100 hover:bg-amber-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}
                    ${locked 
                        ? 'border-stone-800 bg-black/60 text-stone-700 cursor-not-allowed grayscale' 
                        : 'border-stone-800 bg-stone-950/80 hover:bg-stone-200 hover:text-black text-stone-400 hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                    }`}
            >
                <div className="relative z-10 font-mono text-sm md:text-base tracking-wider w-full flex justify-between items-center group-hover:translate-x-2 transition-transform duration-300">
                    <span>{opt.text}</span>
                    <div className="flex flex-col items-end gap-1">
                        {locked && <span className="text-[10px] uppercase text-red-900 border border-red-900/50 px-2 py-1">Requires {opt.requiredItem}</span>}
                        {opt.sanityCost && <span className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertTriangle size={10} /> -{opt.sanityCost} Sanity</span>}
                        {opt.startInvestigation && <span className="text-[10px] text-cyan-500 font-bold border border-cyan-900 px-1">INVESTIGATE</span>}
                    </div>
                </div>
            </button>
           );
        })}
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="flex flex-col items-center justify-center h-full z-20 relative bg-black/95 backdrop-blur-sm animate-in zoom-in duration-500 text-center p-8">
      <Skull size={100} className="text-stone-800 mb-8 animate-pulse drop-shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
      <h1 className="text-7xl font-serif text-stone-600 mb-6 tracking-widest uppercase text-flicker">Memory Erasure</h1>
      {/* REDUNDANCY FIX: Use victoryText (Status Summary) instead of full story text */}
      <div className="text-stone-400 font-mono mb-12 max-w-md mx-auto leading-relaxed border-l-2 border-red-900/50 pl-4 text-left whitespace-pre-wrap">
        {currentNode.finalScreenText || "STATUS: FAILED"}
      </div>
      <button 
        onClick={handleStartGame}
        onMouseEnter={() => playSfx(SOUNDS.HOVER)}
        className="px-10 py-4 bg-stone-900 border border-stone-800 text-stone-400 font-mono hover:bg-stone-800 hover:text-white transition-all flex items-center gap-3 uppercase tracking-widest shadow-lg"
      >
        <RefreshCw size={18} /> Reweave Fate
      </button>
    </div>
  );
  
  const renderVictory = () => {
      const type = gameState.endingType;
      let color = 'text-cyan-400';
      let title = 'ESCAPED';
      
      if (type === 'true') {
          color = 'text-amber-400';
          title = 'TRUE ENDING';
      } else if (type === 'successor') {
          color = 'text-purple-400';
          title = 'THE SUCCESSOR';
      }

      return (
        <div className="flex flex-col items-center justify-center h-full z-20 relative bg-black/90 backdrop-blur-sm animate-in zoom-in duration-1000 text-center p-8">
        <Trophy size={100} className={`${color} mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]`} />
        <h1 className={`text-7xl font-serif ${color} mb-6 tracking-widest text-flicker`}>{title}</h1>
        {/* REDUNDANCY FIX: Use victoryText (Status Summary) instead of full story text */}
        <div className="max-w-xl mx-auto bg-black/50 p-8 border border-stone-800 mb-10 shadow-lg">
            <p className="text-stone-300 font-mono leading-relaxed text-lg whitespace-pre-wrap">
                {currentNode.finalScreenText || "STATUS: UNKNOWN"}
            </p>
        </div>
        <button 
            onClick={handleStartGame}
            onMouseEnter={() => playSfx(SOUNDS.HOVER)}
            className={`px-10 py-4 bg-stone-900 border ${type === 'true' ? 'border-amber-900/50 text-amber-500 hover:border-amber-500' : 'border-cyan-900/50 text-cyan-500 hover:border-cyan-500'} font-mono hover:bg-black transition-all flex items-center gap-3 uppercase tracking-widest`}
        >
            <RefreshCw size={18} /> Replay
        </button>
        </div>
      );
  };

  const currentImage = status === GameStatus.INVESTIGATION && gameState.currentInvestigationId 
    ? INVESTIGATION_NODES[gameState.currentInvestigationId]?.image 
    : currentNode.image;

  // Cinematic Logic: Show Intro Narration for Intro, else show the ending text (full story)
  const currentVideoText = status === GameStatus.CINEMATIC && !introPlayed ? INTRO_NARRATION : currentNode.text;

  // Get active puzzle config
  const getPuzzleConfig = () => {
      if (gameState.currentPuzzleId === 'office_safe') return SAFE_PUZZLE;
      if (gameState.currentPuzzleId === 'factory_circuit') return FACTORY_CIRCUIT;
      if (gameState.currentPuzzleId === 'tower_rune') return TOWER_RUNE;
      return SAFE_PUZZLE;
  };

  // 1. Loading Screen Logic
  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  // 2. Main App Render
  return (
    <div className={`relative h-screen w-screen bg-stone-950 flex flex-col overflow-hidden box-border transition-opacity duration-1000 ${fontsLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Cinematic Frame */}
      <div className="absolute inset-0 pointer-events-none z-50 border-[12px] border-black opacity-90" />
      <div className="absolute inset-0 pointer-events-none z-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

      {/* Visual Layer - Hide during Cinematics/Investigation to prevent clash */}
      {status !== GameStatus.INVESTIGATION && status !== GameStatus.CINEMATIC && status !== GameStatus.PUZZLE && (
        <Atmosphere 
            imageUrl={currentImage} 
            effect={currentNode.effect} 
            overrideEffect={tempVisualEffect}
            sanity={gameState.sanity}
        />
      )}
      
      {/* Overlays */}
      <div className="scanlines pointer-events-none" />

      {/* Controls & HUD */}
      <VolumeControl volume={gameState.volume} setVolume={(v) => setGameState(prev => ({ ...prev, volume: v }))} />
      
      <div className="relative z-30 h-full flex flex-col">
        {status !== GameStatus.MENU && (
             <GameHUD gameState={gameState} status={status} playSfx={playSfx} />
        )}

        {status === GameStatus.MENU && renderMenu()}
        
        {(status === GameStatus.PLAYING || status === GameStatus.DICE_ROLLING) && renderGame()}
        
        {status === GameStatus.CINEMATIC && gameState.currentVideoUrl && (
            <CinematicPlayer 
                src={gameState.currentVideoUrl} 
                onComplete={handleCinematicComplete} 
                volume={gameState.volume}
                text={currentVideoText}
            />
        )}
        
        {status === GameStatus.INVESTIGATION && gameState.currentInvestigationId && (
            <SceneInvestigator 
                node={INVESTIGATION_NODES[gameState.currentInvestigationId]} 
                onExit={handleInvestigationExit} 
                onItemFound={handleInvestigationItemFound}
                onPuzzleTrigger={handlePuzzleTrigger} 
                playSfx={playSfx}
                inventory={gameState.inventory}
            />
        )}

        {status === GameStatus.PUZZLE && (
            <PuzzleInterface 
                config={getPuzzleConfig()} 
                onSuccess={handlePuzzleSuccess} 
                onExit={handlePuzzleExit} 
                playSfx={playSfx} 
                triggerShake={triggerShake}
            />
        )}

        {status === GameStatus.DICE_ROLLING && (
            <DiceRoller 
                challenge={currentNode.diceChallenge!} 
                onRollComplete={handleDiceComplete} 
                playSfx={playSfx}
                triggerShake={triggerShake}
            />
        )}
        
        {status === GameStatus.GAME_OVER && renderGameOver()}
        {status === GameStatus.VICTORY && renderVictory()}
      </div>
    </div>
  );
}

export default App;
