
import { StoryNode, ItemDetails, InvestigationNode, PuzzleConfig } from './types';
import { Key, FileText, Image, PenTool, Flame, Zap, Disc, FlaskConical, Ghost, SlashSquare, BlendIcon } from 'lucide-react';

export const GAME_TITLE = "THE SILENT THREAD";

// --- ASSETS ---

// Images
export const IMG_WARD = "/images/ward.png";
export const IMG_HALL = "/images/hall.png";
export const IMG_FACTORY = "/images/factory.png";
export const IMG_OFFICE = "/images/office.png";
export const IMG_CRAWLSPACE = "/images/crawlspace.png"; 
export const IMG_PORTRAIT = "/images/portrait.png"; 
export const IMG_TOWER = "/images/tower.png"; 
export const IMG_LOOM = "/images/loom.png"; 
export const IMG_SHADOW = "/images/shadow.png";
export const IMG_CREATURE = "/images/creature.png";
export const IMG_THREAD = "/images/thread.png";
export const IMG_VOID = "/images/void.png";
export const IMG_FIELD = "/images/field.png";

// Video Clips
export const VIDEOS = {
  INTRO: "/videos/intro.mp4",
  ENDING_BAD: "/videos/ending_bad.mp4",
  ENDING_NEUTRAL: "/videos/ending_neutral.mp4",
  ENDING_TRUE: "/videos/ending_true.mp4",
  ENDING_SHADOW: "/videos/ending_shadow.mp4",
  ENDING_SUCCESSOR: "/videos/ending_successor.mp4"
};

// Audio
export const SOUNDS = {
  BGM: "/audio/sfx/dark_ambient.mp3", 
  CLICK: "/audio/sfx/click.mp3", 
  HOVER: "/audio/sfx/hover.mp3", 
  HEARTBEAT: "/audio/sfx/heartbeat.mp3",
  DICE_ROLL: "/audio/sfx/dice_roll.mp3",
  SUCCESS: "/audio/sfx/success.mp3",
  FAILURE: "/audio/sfx/failure.mp3", 
  ITEM_GET: "/audio/sfx/item_get.mp3" 
};

export const VOICE_CLIPS = {
  INTRO: "/audio/voice/intro_whisper.mp3",
  SEAMSTRESS_LAUGH: "/audio/voice/seamstress_laugh.mp3",
  HEARTBEAT_FAST: "/audio/voice/heartbeat_fast.wav"
};


// --- DATA ---

export const INTRO_NARRATION = "The mind is a tapestry, woven from moments we choose to keep... and those we desperately try to forget. You are not lost. You are simply... unraveled. Pull the thread. Find yourself.";

export const ITEMS_DB: Record<string, ItemDetails> = {
  "Metal Shard": {
    name: "Metal Shard",
    description: "A jagged piece of rusted iron found under a pillow. It vibrates near the Seamstress.",
    icon: SlashSquare
  },
  "Old Key": {
    name: "Old Key",
    description: "Cold to the touch. It opens the Archives in the Factory.",
    icon: Key
  },
  "Personnel File": {
    name: "Personnel File",
    description: "Evidence of your past. 'Subject 89 - Memory Erasure: Incomplete'.",
    icon: FileText
  },
  "Child's Drawing": {
    name: "Child's Drawing",
    description: "A crayon sketch of a happy family, scribbled over in black thread.",
    icon: Image
  },
  "Burnt Canvas": {
    name: "Burnt Canvas",
    description: "A scrap of a painting showing the Seamstress weeping. She was human once.",
    icon: Flame
  },
  "Golden Thread": {
    name: "Golden Thread",
    description: "A piece of pure truth, cut from the loom.",
    icon: PenTool
  },
  "Strange Vial": {
      name: "Strange Vial",
      description: "A small bottle of viscous black liquid. It whispers when shaken.",
      icon: FlaskConical
  },
  "Patient Wristband": {
      name: "Patient Wristband",
      description: "A plastic band. Name: UNKNOWN. ID: 089.",
      icon: BlendIcon
  },
  "Mechanic's Fuse": {
      name: "Mechanic's Fuse",
      description: "A heavy industrial fuse. Smells of ozone.",
      icon: Zap
  },
  "Stone Rune": {
      name: "Stone Rune",
      description: "A heavy disk carved with an eye symbol. It feels warm.",
      icon: Disc
  },
  "Doll": {
      name: "Creepy Doll",
      description: "Its eyes follow you. A remnant of a forgotten childhood.",
      icon: Ghost
  }
};

export const SAFE_PUZZLE: PuzzleConfig = {
    id: 'office_safe',
    type: 'keypad',
    correctCode: '089',
    successRewardItem: 'Personnel File',
    description: 'Enter Patient ID'
};

export const FACTORY_CIRCUIT: PuzzleConfig = {
    id: 'factory_circuit',
    type: 'circuit',
    description: 'Stabilize Power Grid',
    successRewardItem: "Mechanic's Fuse",
    gridSize: 3,
    initialLights: [1, 3, 4, 5, 7] // Cross pattern off
};

export const TOWER_RUNE: PuzzleConfig = {
    id: 'tower_rune',
    type: 'rune',
    description: 'Align the Three Seals',
    successNextId: 'tower_unlocked'
};

export const INVESTIGATION_NODES: Record<string, InvestigationNode> = {
    'ward_investigation': {
        id: 'ward_investigation',
        image: IMG_WARD,
        exitNodeId: 'hallway_choice',
        introText: "The room smells of antiseptic and old dust. Something was hidden here.",
        hotspots: [
            {
                id: 'bed_pillow',
                x: 21, y: 45, width: 20, height: 15,
                itemReward: "Metal Shard",
                description: "You lift the pillow. A jagged Metal Shard lies there, pulsing."
            },
            {
                id: 'floor_debris',
                x: 65, y: 82, width: 15, height: 10,
                itemReward: "Patient Wristband",
                description: "A discarded plastic wristband in the dust. It reads: ID 089."
            },
            {
                id: 'cabinet',
                x: 82, y: 18, width: 15, height: 40,
                description: "Empty medical supplies. Just mothballs and rust."
            },
            {
                id: 'hidden_doll',
                x: 8, y: 75, width: 8, height: 10,
                itemReward: "Doll",
                description: "A small doll hidden in the shadows. It blinks at you."
            }
        ]
    },
    'office_investigation': {
        id: 'office_investigation',
        image: IMG_OFFICE,
        exitNodeId: 'office_aftermath',
        introText: "The Manager's office. Papers are strewn everywhere. A locked cabinet sits in the corner.",
        hotspots: [
            {
                id: 'desk_drawer',
                x: 42, y: 70, width: 20, height: 10,
                itemReward: "Old Key",
                description: "Hidden in the false bottom of the drawer: an Old Key."
            },
            {
                id: 'cabinet_locked',
                x: 90, y: 42, width: 12, height: 28,
                puzzleId: 'office_safe',
                description: "It's locked electronically. It needs a 3-digit Patient ID."
            },
            {
                id: 'wall_panel',
                x: 8, y: 20, width: 15, height: 15,
                puzzleId: 'factory_circuit',
                description: "A sparking fuse box panel. Looks like a logic gate mechanism."
            },
            {
                id: 'notice_board',
                x: 56, y: 10, width: 20, height: 20,
                description: "Notices about 'Production Quotas'. They weren't making paper... they were processing memories."
            }
        ]
    },
    'portrait_investigation': {
        id: 'portrait_investigation',
        image: IMG_PORTRAIT,
        exitNodeId: 'portrait_puzzle',
        introText: "The eyes of the paintings follow you. The central canvas is charred but pulsating.",
        hotspots: [
             {
                id: 'main_portrait',
                x: 40, y: 18, width: 20, height: 55,
                description: "The Seamstress... she looks sad. The paint is warm to the touch."
            },
            {
                id: 'hidden_niche',
                x: 85, y: 20, width: 5, height: 10,
                itemReward: "Strange Vial",
                description: "A loose frame reveals a hidden compartment. A vial of dark liquid sits inside."
            }
        ]
    },
    'tower_investigation': {
        id: 'tower_investigation',
        image: IMG_TOWER,
        exitNodeId: 'tower_door_puzzle',
        introText: "The air is thin here. A massive stone seal blocks the way. The rings must be aligned.",
        hotspots: [
            {
                id: 'rune_seal',
                x: 37, y: 25, width: 25, height: 55,
                puzzleId: 'tower_rune',
                description: "The mechanism is locked. Align the Ley Lines to proceed."
            },
            {
                id: 'wall_scratching',
                x: 2, y: 55, width: 20, height: 30,
                description: "Scratched into the stone: 'North, Southwest, East'."
            }
        ]
    }
};

export const STORY_NODES: Record<string, StoryNode> = {
  // --- CHAPTER 1: THE AWAKENING HALL ---
  'start': {
    id: 'start',
    text: "CHAPTER 1: The Awakening Hall\n\nYou wake in a decaying industrial ward. Dust motes dance in blue moonlight. A faint, glowing thread is tied to your wrist, pulling gently into the dark hallway.",
    image: IMG_WARD,
    voiceUrl: VOICE_CLIPS.INTRO,
    options: [
      { text: "Follow the thread immediately.", nextId: 'hallway_rush' },
      { text: "Look around the room first.", nextId: 'ward_investigation', startInvestigation: 'ward_investigation' },
    ]
  },
  'hallway_choice': {
      id: 'hallway_choice',
      text: "You have what you need. The thread pulses, urging you to the door.",
      image: IMG_WARD,
      options: [
          { text: "Enter the hallway.", nextId: 'hallway_slow' }
      ]
  },
  'hallway_rush': {
    id: 'hallway_rush',
    text: "You stumble into the corridor without looking back. The silence is heavy. Suddenly, a shadow detaches itself from the wall ahead.",
    image: IMG_HALL,
    effect: 'heartbeat',
    options: [
      { text: "Freeze!", nextId: 'shadow_encounter' },
      { text: "Run past it!", nextId: 'run_check' }
    ]
  },
  'hallway_slow': {
    id: 'hallway_slow',
    text: "You step carefully into the corridor, shard in hand. A shadow lurks ahead, twitching like a broken puppet.",
    image: IMG_HALL,
    options: [
      { text: "Sneak past it.", nextId: 'sneak_check' },
      { text: "Throw a rock to distract it.", nextId: 'distraction_check' },
      { text: "Run for it!", nextId: 'run_check' }
    ]
  },
  'run_check': {
    id: 'run_check',
    text: "You sprint. The floorboards scream. The shadow expands, engulfing you in suffocating cold.",
    image: IMG_SHADOW,
    effect: 'shake',
    options: [],
    diceChallenge: {
      target: 18,
      statName: "Evasion",
      successId: 'run_success', // Fixed: leads to escape
      failId: 'death_shadow'    // Failure leads to death
    }
  },
  'run_success': {
      id: 'run_success',
      text: "Miraculously, you outrun the darkness. You slam the heavy iron doors shut behind you, collapsing on the cold metal floor. You are safe... for now.",
      image: IMG_FACTORY,
      effect: 'flash',
      options: [
          { text: "Catch your breath.", nextId: 'factory_entrance' }
      ]
  },
  'death_shadow': {
    id: 'death_shadow',
    text: "The shadow consumes your memories. You forget who you are. The loop restarts.",
    finalScreenText: "STATUS: DECEASED\nMEMORY: CONSUMED",
    image: IMG_VOID,
    options: [
       { text: "Wake up.", nextId: 'start' }
    ]
  },
  'shadow_encounter': {
    id: 'shadow_encounter',
    text: "The shadow creates a shape of a child, then dissolves. Your heart hammers against your ribs.",
    image: IMG_SHADOW,
    options: [
      { text: "Exhale and continue.", nextId: 'factory_entrance', sanityCost: 10 }
    ]
  },
  'distraction_check': {
      id: 'distraction_check',
      text: "You pick up a piece of debris and toss it down the hall.",
      image: IMG_HALL,
      options: [],
      diceChallenge: {
          target: 5,
          statName: "Precision",
          successId: 'sneak_success',
          failId: 'sneak_fail'
      }
  },
  'sneak_check': {
    id: 'sneak_check',
    text: "You try to hug the wall, timing your breath with the flickering lights.",
    image: IMG_HALL,
    options: [],
    diceChallenge: {
      target: 8,
      statName: "Stealth",
      successId: 'sneak_success',
      failId: 'sneak_fail'
    }
  },
  'sneak_success': {
    id: 'sneak_success',
    text: "You slip past unseen. The thread pulses brighter, pleased with your caution.",
    image: IMG_HALL,
    options: [
      { text: "Move to the Factory.", nextId: 'factory_entrance' }
    ]
  },
  'sneak_fail': {
    id: 'sneak_fail',
    text: "Your foot scuffs a loose tile. The shadow shrieks. You take damage to your mind.",
    image: IMG_SHADOW,
    effect: 'shake',
    options: [
      { text: "Run to the door!", nextId: 'factory_entrance', sanityCost: 25 }
    ]
  },

  // --- CHAPTER 2: THE PAPER FACTORY ---
  'factory_entrance': {
    id: 'factory_entrance',
    text: "CHAPTER 2: The Paper Factory\n\nMassive machines grind invisible bones. The thread leads straight into the gears. To the left, a manager's office.",
    image: IMG_FACTORY,
    options: [
      { text: "Climb the gears immediately.", nextId: 'gear_climb' },
      { text: "Investigate the Office.", nextId: 'office_investigation', startInvestigation: 'office_investigation' }
    ]
  },
  'office_aftermath': {
      id: 'office_aftermath',
      text: "You have searched the office. The noises from the factory floor are getting louder.",
      image: IMG_FACTORY,
      options: [
          { text: "Head to the gears.", nextId: 'gear_climb' }
      ]
  },
  'gear_climb': {
    id: 'gear_climb',
    text: "The oil is slippery. One slip means being crushed. The Listener is hunting you.",
    image: IMG_CREATURE,
    options: [],
    diceChallenge: {
      target: 10,
      statName: "Agility",
      successId: 'ch3_start',
      failId: 'ch3_start_injured'
    }
  },
  'ch3_start_injured': {
    id: 'ch3_start_injured',
    text: "You barely escape, but your leg is gashed. The pain sharpens your focus.",
    image: IMG_CRAWLSPACE,
    effect: 'flash',
    options: [
        { text: "Bandage and proceed.", nextId: 'ch3_start', sanityCost: 20 }
    ]
  },

  // --- CHAPTER 3: THE CRAWLSPACE MAZE ---
  'ch3_start': {
    id: 'ch3_start',
    text: "CHAPTER 3: The Crawlspace\n\nTight, rust-colored vents. The air tastes like copper. The thread goes deeper.",
    image: IMG_CRAWLSPACE,
    options: [
      { text: "Crawl forward.", nextId: 'vent_voices' }
    ]
  },
  'vent_voices': {
    id: 'vent_voices',
    text: "You reach a junction. Voices echo from both sides. Left sounds like your mother. Right sounds like the Seamstress.",
    image: IMG_CRAWLSPACE,
    options: [
      { text: "Go Left (Mother).", nextId: 'vent_trap' },
      { text: "Go Right (Seamstress).", nextId: 'vent_truth' }
    ]
  },
  'vent_trap': {
    id: 'vent_trap',
    text: "It was a mimic! Steam vents blast your face.",
    image: IMG_CRAWLSPACE,
    effect: 'shake',
    options: [
      { text: "Recoil and take the other path.", nextId: 'vent_truth', sanityCost: 15 }
    ]
  },
  'vent_truth': {
    id: 'vent_truth',
    text: "You find a small nook with a child's hiding spot. A drawing is pinned to the wall.",
    image: IMG_CRAWLSPACE,
    itemReward: "Child's Drawing",
    options: [
      { text: "Take the drawing.", nextId: 'ch4_start' }
    ]
  },

  // --- CHAPTER 4: THE PORTRAIT HALL ---
  'ch4_start': {
    id: 'ch4_start',
    text: "CHAPTER 4: The Portrait Hall\n\nYou emerge into a gallery. The paintings are moving. They show distorted versions of your life.",
    image: IMG_PORTRAIT,
    options: [
      { text: "Inspect the central portrait.", nextId: 'portrait_puzzle' },
      { text: "Look for a hidden passage behind the frames.", nextId: 'portrait_investigation', startInvestigation: 'portrait_investigation' }
    ]
  },
  'portrait_puzzle': {
    id: 'portrait_puzzle',
    text: "The painting shows the Seamstress as a kind woman, weeping over a grave. The thread vibrates violently here.",
    image: IMG_PORTRAIT,
    options: [
      { text: "Touch the canvas.", nextId: 'portrait_burn_check' }
    ]
  },
  'portrait_burn_check': {
    id: 'portrait_burn_check',
    text: "You feel intense heat. This memory is a fabrication covering a tragedy.",
    image: IMG_PORTRAIT,
    options: [],
    diceChallenge: {
      target: 14,
      statName: "Willpower",
      successId: 'portrait_success',
      failId: 'portrait_fail'
    }
  },
  'portrait_success': {
    id: 'portrait_success',
    text: "You mentally reject the lie. The canvas burns away, leaving a scrap of truth.",
    image: IMG_PORTRAIT,
    itemReward: "Burnt Canvas",
    effect: 'flash',
    options: [
      { text: "Enter the hidden door.", nextId: 'ch5_start' }
    ]
  },
  'portrait_fail': {
    id: 'portrait_fail',
    text: "The memory overwhelms you. You weep with her, losing yourself.",
    image: IMG_PORTRAIT,
    effect: 'heartbeat',
    options: [
      { text: "Stumble forward.", nextId: 'ch5_start', sanityCost: 20 }
    ]
  },

  // --- CHAPTER 5: THE LOOM TOWER ---
  'ch5_start': {
    id: 'ch5_start',
    text: "CHAPTER 5: The Loom Tower\n\nA massive spiral staircase winds up into the dark. The sound of a giant loom—CLACK, THUD, CLACK—shakes the walls.",
    image: IMG_TOWER,
    options: [
      { text: "Ascend.", nextId: 'tower_climb' },
      { text: "Inspect the Sealed Door.", nextId: 'tower_door_puzzle' }
    ]
  },
  'tower_door_puzzle': {
      id: 'tower_door_puzzle',
      text: "A heavy stone door carved with rotating rings blocks a side passage.",
      image: IMG_TOWER,
      options: [
          { text: "Solve the Seal.", nextId: 'tower_climb', startInvestigation: 'tower_investigation' } 
      ]
  },
  'tower_unlocked': {
      id: 'tower_unlocked',
      text: "The stone rings click into place. The door rumbles open, revealing a hidden shortcut... and a strange artifact.",
      image: IMG_TOWER,
      itemReward: "Stone Rune",
      effect: 'flash',
      options: [
          { text: "Proceed to the summit.", nextId: 'ch6_start' }
      ]
  },
  'tower_climb': {
    id: 'tower_climb',
    text: "The stairs are missing steps. The void below is infinite.",
    image: IMG_TOWER,
    options: [],
    diceChallenge: {
      target: 12,
      statName: "Endurance",
      successId: 'ch6_start',
      failId: 'ch6_start_exhausted'
    }
  },
  'ch6_start_exhausted': {
    id: 'ch6_start_exhausted',
    text: "You crawl the last few steps, barely breathing.",
    image: IMG_TOWER,
    options: [
      { text: "Enter the Loom Room.", nextId: 'ch6_start', sanityCost: 10 }
    ]
  },

  // --- CHAPTER 6: THE FRAYED TRUTH ---
  'ch6_start': {
    id: 'ch6_start',
    text: "CHAPTER 6: The Frayed Truth\n\nThe Seamstress sits at a loom made of bone. She is weaving a tapestry of the orphanage—pristine and happy. She sees you.",
    image: IMG_LOOM,
    voiceUrl: VOICE_CLIPS.SEAMSTRESS_LAUGH,
    options: [
      { text: "Confront her.", nextId: 'final_dialogue' }
    ]
  },
  'final_dialogue': {
    id: 'final_dialogue',
    text: "\"I am fixing you,\" she whispers. \"Why do you resist the repair?\"",
    image: IMG_LOOM,
    options: [
      { text: "I want to forget. (Give Up)", nextId: 'ending_bad' },
      { text: "I just want to leave! (Flee)", nextId: 'ending_neutral' },
      { text: "The truth matters, even if it hurts. (True Ending)", nextId: 'true_ending_decision', isTrueEnding: true },
      { text: "Drink the Vial. (Secret Ending)", nextId: 'ending_shadow', requiredItem: "Strange Vial" }
    ]
  },
  'true_ending_decision': {
    id: 'true_ending_decision',
    text: "You present the Metal Shard, the Personnel File, and the Burnt Canvas. The Seamstress screams as her fabrication unravels. The threads holding the nightmare together snap.",
    image: IMG_LOOM,
    options: [
      { text: "Cut the final thread.", nextId: 'ending_good' },
      { text: "Take her place at the Loom.", nextId: 'ending_successor' }
    ]
  },

  // --- ENDINGS ---
  'ending_bad': {
    id: 'ending_bad',
    text: "You surrender. She weaves you back into the tapestry. You are safe, you are happy, and you are trapped forever.",
    finalScreenText: "STATUS: ASSIMILATED\nMEMORY: ERADICATED\nLOOP: CONTINUING",
    image: IMG_VOID,
    options: []
  },
  'ending_neutral': {
    id: 'ending_neutral',
    text: "You cut the thread and jump from the tower. You wake up in a field, alive. But you remember nothing of who you are.",
    finalScreenText: "STATUS: SURVIVOR\nMEMORY: LOST\nIDENTITY: UNKNOWN",
    image: IMG_FIELD,
    options: []
  },
  'ending_good': {
    id: 'ending_good',
    text: "The orphanage dissolves. You stand in the ruins of an old factory. You remember the accident. You remember her name. You are free.",
    finalScreenText: "STATUS: FREEDOM\nMEMORY: RESTORED\nTRUTH: UNWOVEN",
    image: IMG_THREAD,
    options: []
  },
  'ending_shadow': {
      id: 'ending_shadow',
      text: "You drink the black vial. Your body dissolves into smoke. You become one of the shadows in the hall, forever watching.",
      finalScreenText: "STATUS: OBSCURE\nFORM: SHADOW\nOBSERVER: ETERNAL",
      image: IMG_SHADOW,
      options: []
  },
  'ending_successor': {
      id: 'ending_successor',
      text: "You push the Seamstress aside and take the shuttle. You will weave a better world. You will never leave.",
      finalScreenText: "STATUS: ASCENDED\nROLE: THE NEW SEAMSTRESS\nREALITY: YOURS",
      image: IMG_LOOM,
      options: []
  }
};
