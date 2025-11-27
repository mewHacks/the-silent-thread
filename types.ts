
export interface GameState {
  currentNodeId: string;
  inventory: string[];
  sanity: number; // 0-100
  sanityMax: number;
  isGameOver: boolean;
  isVictory: boolean;
  endingType?: 'bad' | 'neutral' | 'true' | 'shadow' | 'successor';
  diceRoll: number | null;
  volume: number; // 0-1
  currentInvestigationId?: string;
  currentVideoUrl?: string; // For cinematics
  currentPuzzleId?: string;
}

export interface Option {
  text: string;
  nextId: string;
  requiredItem?: string; // Player needs this to click
  sanityCost?: number;
  isTrueEnding?: boolean; // Only visible if all secret items are found
  startInvestigation?: string; // ID of the investigation scene to trigger
}

export interface DiceChallenge {
  target: number; // Roll must be >= this
  successId: string;
  failId: string;
  statName: string; // e.g., "Willpower", "Stealth"
}

export interface ItemDetails {
  name: string;
  description: string;
  icon: any; // Lucide icon component
}

export type PuzzleType = 'keypad' | 'circuit' | 'rune';

export interface PuzzleConfig {
    id: string;
    type: PuzzleType;
    description: string;
    successRewardItem?: string;
    successNextId?: string; 
    
    // Keypad Specific
    correctCode?: string; 
    
    // Circuit Specific (Lights Out)
    gridSize?: number; // usually 3
    initialLights?: number[]; // Indices of lights that are initially OFF
    
    // Rune Specific (Ring Rotation)
    runeSymbols?: string[]; // URLs or names of symbols
}

export interface Hotspot {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage
  height: number; // Percentage
  itemReward?: string;
  description: string; // Text shown when clicked/found
  requiredItem?: string; // Item needed to interact
  onInteractText?: string; // Text to show in UI when interacted
  puzzleId?: string; // Triggers a puzzle instead of item
}

export interface InvestigationNode {
  id: string;
  image: string;
  hotspots: Hotspot[];
  exitNodeId: string; // Where to go when done/exit button clicked
  introText: string;
}

export interface StoryNode {
  id: string;
  text: string;
  finalScreenText?: string; // Short text specifically for the Victory/Game Over screen
  image: string; // URL
  options: Option[];
  diceChallenge?: DiceChallenge;
  effect?: 'shake' | 'flash' | 'heartbeat' | 'none';
  soundAmbience?: string; // key for sound type
  itemReward?: string;
  voiceUrl?: string; // URL for voice over narration
}

export enum GameStatus {
  MENU,
  CINEMATIC,
  PLAYING,
  DICE_ROLLING,
  INVESTIGATION,
  PUZZLE,
  GAME_OVER,
  VICTORY
}
