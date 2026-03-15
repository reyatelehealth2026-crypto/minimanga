import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, CharacterProfile, WorldRules, CharacterStats } from '../types';
import { callAiGameMaster } from '../utils/aiService';

const defaultProfile: CharacterProfile = {
  name: 'Unknown Hero',
  class: 'Wanderer',
  avatarUrl: '/avatars/user-avatar.png',
  description: ''
};

const defaultStats: CharacterStats = {
  hp: { current: 100, max: 100 },
  mana: { current: 50, max: 50 },
  level: 1,
  exp: 0
};

const defaultWorldRules: WorldRules = {
  worldName: 'Genesis',
  theme: 'Dark Fantasy',
  chaosLevel: 50,
  magicLevel: 50,
  permaDeath: false,
  customInstructions: ''
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      profile: { ...defaultProfile },
      stats: { ...defaultStats },
      inventory: [],
      worldRules: { ...defaultWorldRules },
      isWorldCreated: false,
      currentLocationImage: null,
      chatHistory: [],
      isAiTyping: false,
      choices: [],
      pendingChoice: null,

      // Actions
      setProfile: (profileUpdates) => set((state) => ({ 
        profile: { ...state.profile, ...profileUpdates } 
      })),

      setWorldRules: (rulesUpdates) => set((state) => ({ 
        worldRules: { ...state.worldRules, ...rulesUpdates } 
      })),

      completeWorldCreation: () => {
        set({ isWorldCreated: true });
      },

      updateStats: (statName, amount) => set((state) => {
        const statObj = state.stats[statName];
        if (statObj && typeof statObj === 'object' && 'current' in statObj) {
          return {
            stats: {
              ...state.stats,
              [statName]: {
                ...statObj,
                current: Math.max(0, Math.min(statObj.max, statObj.current + amount))
              }
            }
          };
        }
        if (typeof statObj === 'number') {
          return {
            stats: {
              ...state.stats,
              [statName]: Math.max(0, (statObj as number) + amount)
            }
          };
        }
        return state;
      }),

      addMessage: (msg) => {
        const newMessage = { 
          ...msg, 
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, 
          timestamp: Date.now() 
        };
        set((state) => ({ chatHistory: [...state.chatHistory, newMessage] }));
      },

      setAiTyping: (isTyping) => set({ isAiTyping: isTyping }),

      setChoices: (choices) => set({ choices }),

      makeChoice: (choice) => {
        const state = get();
        state.addMessage({ role: 'user', content: `ฉันเลือก: ${choice.label}` });
        set({ pendingChoice: choice, choices: [] });
        
        state.addMessage({ 
          role: 'system', 
          content: `⚡ กำลังเตรียมการสำหรับ [${choice.label}]... กรุณาทอยเต๋าเพื่อตัดสินความสำเร็จ` 
        });
      },

      processGameLogic: async (type, diceValue) => {
        const state = get();
        if (state.isAiTyping) return;

        set({ isAiTyping: true });

        let currentAction = "";
        if (type === 'start') {
          currentAction = "เริ่มต้นการจุติครั้งใหม่ และเปิดฉากการผจญภัย";
        } else if (type === 'dice_roll' && state.pendingChoice) {
          currentAction = `ผู้เล่นพยายาม ${state.pendingChoice.label} และทอยเต๋าได้ ${diceValue} แต้ม (D20)`;
          set({ pendingChoice: null });
        } else {
          const lastMsg = state.chatHistory[state.chatHistory.length - 1];
          currentAction = lastMsg?.role === 'user' ? lastMsg.content : "ผู้เล่นกำลังสำรวจโลก";
        }

        try {
          const response = await callAiGameMaster(
            state.profile,
            state.stats,
            state.worldRules,
            state.chatHistory,
            currentAction
          );

          if (response.statUpdates) {
            if (response.statUpdates.hp) state.updateStats('hp', response.statUpdates.hp);
            if (response.statUpdates.mana) state.updateStats('mana', response.statUpdates.mana);
            if (response.statUpdates.exp) state.updateStats('exp', response.statUpdates.exp);
          }

          state.addMessage({ role: 'ai', content: response.storyText });
          set({ isAiTyping: false, choices: response.choices || [] });
        } catch (error) {
          console.error("AI Logic Error:", error);
          state.addMessage({ role: 'ai', content: "พลังงานบางอย่างขัดขวางข้า... (AI Error)" });
          set({ isAiTyping: false });
        }
      },

      resetGame: () => {
        localStorage.removeItem('manga-rpg-storage');
        set({
          profile: { ...defaultProfile },
          stats: { ...defaultStats },
          inventory: [],
          worldRules: { ...defaultWorldRules },
          isWorldCreated: false,
          currentLocationImage: null,
          chatHistory: [],
          isAiTyping: false,
          choices: [],
          pendingChoice: null
        });
      }
    }),
    {
      name: 'manga-rpg-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        profile: state.profile,
        stats: state.stats,
        worldRules: state.worldRules,
        isWorldCreated: state.isWorldCreated,
        chatHistory: state.chatHistory,
        inventory: state.inventory,
        currentLocationImage: state.currentLocationImage
      }),
    }
  )
);