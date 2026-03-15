import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { characters as initialCharacters, chapters as initialChapters, type CharacterProfile, type Chapter } from '@/data/storyData';

interface AffectionData {
  characterId: string;
  points: number;
  maxPoints: number;
}

interface UnlockedCG {
  id: string;
  characterId: string;
  sceneId: string;
  image: string;
  description: string;
}

interface GameProgress {
  currentChapterId: string | null;
  currentSceneId: string | null;
  completedChapters: string[];
  completedScenes: string[];
}

interface GameState {
  // ข้อมูลตัวละคร
  characters: CharacterProfile[];
  chapters: Chapter[];
  
  // ความสัมพันธ์
  affection: Record<string, AffectionData>;
  
  // ความคืบหน้า
  progress: GameProgress;
  
  // CG Gallery
  unlockedCGs: UnlockedCG[];
  
  // Flags สำหรับเนื้อเรื่อง
  storyFlags: Record<string, boolean>;
  
  // Actions
  unlockCharacter: (characterId: string) => void;
  updateAffection: (characterId: string, amount: number) => void;
  getAffection: (characterId: string) => number;
  getAffectionLevel: (characterId: string) => number;
  completeScene: (sceneId: string) => void;
  completeChapter: (chapterId: string) => void;
  setCurrentScene: (sceneId: string) => void;
  setCurrentChapter: (chapterId: string) => void;
  unlockChapter: (chapterId: string) => void;
  setStoryFlag: (flag: string, value: boolean) => void;
  getStoryFlag: (flag: string) => boolean;
  addCG: (cg: UnlockedCG) => void;
  resetGame: () => void;
  
  // Check conditions
  checkUnlockCondition: (characterId: string) => boolean;
  checkChapterUnlockCondition: (chapterId: string) => boolean;
}

const initialAffection: Record<string, AffectionData> = {
  sakura: { characterId: 'sakura', points: 10, maxPoints: 100 },
  rito: { characterId: 'rito', points: 0, maxPoints: 100 },
  luna: { characterId: 'luna', points: 0, maxPoints: 100 },
  hinata: { characterId: 'hinata', points: 0, maxPoints: 100 },
  yuki: { characterId: 'yuki', points: 0, maxPoints: 100 },
  mystery: { characterId: 'mystery', points: 0, maxPoints: 100 },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      characters: initialCharacters,
      chapters: initialChapters,
      affection: initialAffection,
      progress: {
        currentChapterId: null,
        currentSceneId: null,
        completedChapters: [],
        completedScenes: [],
      },
      unlockedCGs: [],
      storyFlags: {},

      // Unlock character
      unlockCharacter: (characterId: string) => {
        set((state) => ({
          characters: state.characters.map((char) =>
            char.id === characterId ? { ...char, isUnlocked: true } : char
          ),
        }));
      },

      // Update affection points
      updateAffection: (characterId: string, amount: number) => {
        set((state) => ({
          affection: {
            ...state.affection,
            [characterId]: {
              ...state.affection[characterId],
              points: Math.min(
                state.affection[characterId].maxPoints,
                Math.max(0, state.affection[characterId].points + amount)
              ),
            },
          },
        }));
        
        // Check if unlocking any characters after affection change
        const state = get();
        state.characters.forEach((char) => {
          if (!char.isUnlocked && state.checkUnlockCondition(char.id)) {
            state.unlockCharacter(char.id);
          }
        });
        
        // Check chapter unlocks
        state.chapters.forEach((chapter) => {
          if (chapter.isLocked && state.checkChapterUnlockCondition(chapter.id)) {
            state.unlockChapter(chapter.id);
          }
        });
      },

      // Get affection points
      getAffection: (characterId: string) => {
        return get().affection[characterId]?.points || 0;
      },

      // Get affection level (1-10)
      getAffectionLevel: (characterId: string) => {
        const points = get().getAffection(characterId);
        return Math.floor(points / 10) + 1;
      },

      // Complete scene
      completeScene: (sceneId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            completedScenes: [...state.progress.completedScenes, sceneId],
          },
        }));
      },

      // Complete chapter
      completeChapter: (chapterId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            completedChapters: [...state.progress.completedChapters, chapterId],
          },
        }));
        
        // Check chapter unlocks after completing
        const state = get();
        state.chapters.forEach((chapter) => {
          if (chapter.isLocked && state.checkChapterUnlockCondition(chapter.id)) {
            state.unlockChapter(chapter.id);
          }
        });
      },

      // Set current scene
      setCurrentScene: (sceneId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentSceneId: sceneId,
          },
        }));
      },

      // Set current chapter
      setCurrentChapter: (chapterId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentChapterId: chapterId,
          },
        }));
      },

      // Unlock chapter
      unlockChapter: (chapterId: string) => {
        set((state) => ({
          chapters: state.chapters.map((ch) =>
            ch.id === chapterId ? { ...ch, isLocked: false } : ch
          ),
        }));
      },

      // Story flags
      setStoryFlag: (flag: string, value: boolean) => {
        set((state) => ({
          storyFlags: {
            ...state.storyFlags,
            [flag]: value,
          },
        }));
      },

      getStoryFlag: (flag: string) => {
        return get().storyFlags[flag] || false;
      },

      // Add CG
      addCG: (cg: UnlockedCG) => {
        set((state) => ({
          unlockedCGs: [...state.unlockedCGs, cg],
        }));
      },

      // Reset game
      resetGame: () => {
        set({
          characters: initialCharacters,
          chapters: initialChapters,
          affection: initialAffection,
          progress: {
            currentChapterId: null,
            currentSceneId: null,
            completedChapters: [],
            completedScenes: [],
          },
          unlockedCGs: [],
          storyFlags: {},
        });
      },

      // Check unlock condition for character
      checkUnlockCondition: (characterId: string) => {
        const state = get();
        const character = state.characters.find((c) => c.id === characterId);
        if (!character || character.isUnlocked) return false;

        const condition = character.unlockCondition;
        
        switch (condition.type) {
          case 'start':
            return true;
          case 'scene':
            return state.progress.completedScenes.includes(condition.sceneId);
          case 'affection':
            return state.getAffection(condition.characterId) >= condition.min;
          default:
            return false;
        }
      },

      // Check unlock condition for chapter
      checkChapterUnlockCondition: (chapterId: string) => {
        const state = get();
        const chapter = state.chapters.find((c) => c.id === chapterId);
        if (!chapter || !chapter.isLocked || !chapter.unlockCondition) return false;

        const condition = chapter.unlockCondition;
        
        switch (condition.type) {
          case 'completeChapter':
            return state.progress.completedChapters.includes(condition.chapterId);
          case 'affection':
            return state.getAffection(condition.characterId) >= condition.min;
          default:
            return false;
        }
      },
    }),
    {
      name: 'manga-drama-world-save',
      version: 1,
    }
  )
);
