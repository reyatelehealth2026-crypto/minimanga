export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
}

export interface CharacterStats {
  hp: { current: number; max: number };
  mana: { current: number; max: number };
  level: number;
  exp: number;
}

export interface CharacterProfile {
  name: string;
  class: string;
  avatarUrl: string;
  description: string;
}

export interface WorldRules {
  worldName: string;
  theme: string;
  chaosLevel: number;
  magicLevel: number;
  permaDeath: boolean;
  customInstructions: string;
}

export interface GameChoice {
  id: string;
  label: string;
  description: string;
  actionType: string;
}

export interface GameState {
  // Character
  profile: CharacterProfile;
  stats: CharacterStats;
  inventory: string[];
  
  // World Settings
  worldRules: WorldRules;
  isWorldCreated: boolean;
  currentLocationImage: string | null;
  
  // Game Session / Chat
  chatHistory: ChatMessage[];
  isAiTyping: boolean;
  choices: GameChoice[];
  pendingChoice: GameChoice | null;
  
  // Actions
  setProfile: (profile: Partial<CharacterProfile>) => void;
  setWorldRules: (rules: Partial<WorldRules>) => void;
  completeWorldCreation: () => void;
  updateStats: (statName: keyof CharacterStats, amount: number) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setAiTyping: (isTyping: boolean) => void;
  setChoices: (choices: GameChoice[]) => void;
  makeChoice: (choice: GameChoice) => void;
  processGameLogic: (type: 'start' | 'dice_roll' | 'chat', value?: number) => Promise<void>;
  resetGame: () => void;
}