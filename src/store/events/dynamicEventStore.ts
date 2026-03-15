import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateSpecialEvent } from '@/services/aiProviderManager';
import { getCurrentWeather, getWeatherEvent, type WeatherData } from '@/services/weatherService';
import { getCurrentTimeEvent, getHolidayEvent } from '@/services/timeService';
import { useGameStore } from '@/store/gameStore';

export interface GeneratedDialogue {
  text: string;
  emotion: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'blush' | 'excited';
  thought?: string;
  choices?: {
    text: string;
    affectionChange: number;
    preview?: string;
  }[];
}

export interface ActiveEvent {
  id: string;
  type: 'weather' | 'time' | 'holiday' | 'ai_generated' | 'random';
  title: string;
  description: string;
  characterId: string;
  dialogue: GeneratedDialogue;
  background: string;
  rewards: string[];
  expiresAt: Date;
  isCompleted: boolean;
}

export interface EventHistory {
  eventId: string;
  type: string;
  characterId: string;
  completedAt: Date;
  rewards: string[];
}

interface DynamicEventState {
  // Current active events
  activeEvents: ActiveEvent[];
  
  // Event history
  eventHistory: EventHistory[];
  
  // Current weather
  currentWeather: WeatherData | null;
  lastWeatherUpdate: Date | null;
  
  // Last checked time
  lastTimeCheck: Date | null;
  
  // Notification queue
  pendingNotifications: string[];
  
  // Actions
  initializeEvents: () => Promise<void>;
  checkForNewEvents: () => Promise<void>;
  completeEvent: (eventId: string) => void;
  dismissEvent: (eventId: string) => void;
  updateWeather: () => Promise<void>;
  generateAIEvent: (type: string) => Promise<void>;
  clearExpiredEvents: () => void;
  addNotification: (message: string) => void;
  clearNotifications: () => void;
  
  // Getters
  getAvailableEvents: () => ActiveEvent[];
  getEventById: (id: string) => ActiveEvent | undefined;
  hasUncompletedEvents: () => boolean;
}

export const useDynamicEventStore = create<DynamicEventState>()(
  persist(
    (set, get) => ({
      activeEvents: [],
      eventHistory: [],
      currentWeather: null,
      lastWeatherUpdate: null,
      lastTimeCheck: null,
      pendingNotifications: [],

      // Initialize events on app start
      initializeEvents: async () => {
        await get().updateWeather();
        await get().checkForNewEvents();
      },

      // Check for new events based on time/weather
      checkForNewEvents: async () => {
        const now = new Date();
        const lastCheck = get().lastTimeCheck;
        
        // Only check every 5 minutes
        if (lastCheck && (now.getTime() - lastCheck.getTime()) < 5 * 60 * 1000) {
          return;
        }

        set({ lastTimeCheck: now });

        const newEvents: ActiveEvent[] = [];

        // Check for holiday event
        const holidayEvent = getHolidayEvent();
        if (holidayEvent) {
          const existingHoliday = get().activeEvents.find(
            e => e.type === 'holiday' && e.id === holidayEvent.id
          );
          if (!existingHoliday) {
            newEvents.push({
              id: holidayEvent.id,
              type: 'holiday',
              title: holidayEvent.title,
              description: holidayEvent.description,
              characterId: holidayEvent.availableCharacters[0],
              dialogue: {
                text: holidayEvent.specialScene,
                emotion: 'happy',
              },
              background: holidayEvent.background,
              rewards: holidayEvent.rewards,
              expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
              isCompleted: false,
            });
          }
        }

        // Check for time-based event
        const timeEvent = getCurrentTimeEvent();
        if (timeEvent) {
          const existingTimeEvent = get().activeEvents.find(
            e => e.type === 'time' && e.id === timeEvent.id
          );
          if (!existingTimeEvent) {
            newEvents.push({
              id: timeEvent.id,
              type: 'time',
              title: timeEvent.title,
              description: timeEvent.description,
              characterId: timeEvent.availableCharacters[0],
              dialogue: {
                text: timeEvent.specialDialogue,
                emotion: 'normal',
              },
              background: timeEvent.background,
              rewards: timeEvent.rewards,
              expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours
              isCompleted: false,
            });
          }
        }

        // Check for weather event
        const weather = get().currentWeather;
        if (weather) {
          const weatherEvent = getWeatherEvent(weather.condition);
          if (weatherEvent) {
            const existingWeatherEvent = get().activeEvents.find(
              e => e.type === 'weather' && e.id === weatherEvent.id
            );
            if (!existingWeatherEvent) {
              newEvents.push({
                id: weatherEvent.id,
                type: 'weather',
                title: weatherEvent.title,
                description: weatherEvent.description,
                characterId: weatherEvent.availableCharacters[0],
                dialogue: {
                  text: weatherEvent.specialDialogue,
                  emotion: 'normal',
                },
                background: weatherEvent.background,
                rewards: weatherEvent.rewards,
                expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours
                isCompleted: false,
              });
            }
          }
        }

        // Add new events and notify
        if (newEvents.length > 0) {
          set(state => ({
            activeEvents: [...state.activeEvents, ...newEvents],
          }));

          // Add notifications
          newEvents.forEach(event => {
            get().addNotification(`🎉 เหตุการณ์พิเศษ: ${event.title}`);
          });
        }

        // Clear expired events
        get().clearExpiredEvents();
      },

      // Complete an event
      completeEvent: (eventId: string) => {
        const event = get().activeEvents.find(e => e.id === eventId);
        if (!event) return;

        // Mark as completed
        set(state => ({
          activeEvents: state.activeEvents.map(e =>
            e.id === eventId ? { ...e, isCompleted: true } : e
          ),
        }));

        // Add to history
        set(state => ({
          eventHistory: [
            ...state.eventHistory,
            {
              eventId,
              type: event.type,
              characterId: event.characterId,
              completedAt: new Date(),
              rewards: event.rewards,
            },
          ],
        }));

        // Apply affection changes if dialogue has choices
        if (event.dialogue.choices) {
          const gameStore = useGameStore.getState();
          // Apply first choice by default (or track which choice was selected)
          const firstChoice = event.dialogue.choices[0];
          if (firstChoice) {
            gameStore.updateAffection(event.characterId, firstChoice.affectionChange || 0);
          }
        }

        // Remove from active events after delay
        setTimeout(() => {
          set(state => ({
            activeEvents: state.activeEvents.filter(e => e.id !== eventId),
          }));
        }, 5000);
      },

      // Dismiss an event
      dismissEvent: (eventId: string) => {
        set(state => ({
          activeEvents: state.activeEvents.filter(e => e.id !== eventId),
        }));
      },

      // Update weather
      updateWeather: async () => {
        const weather = await getCurrentWeather();
        set({
          currentWeather: weather,
          lastWeatherUpdate: new Date(),
        });
      },

      // Generate AI event
      generateAIEvent: async (type: string) => {
        const characters = useGameStore.getState().characters;
        const unlockedChars = characters.filter(c => c.isUnlocked);
        
        if (unlockedChars.length === 0) return;

        const randomChar = unlockedChars[Math.floor(Math.random() * unlockedChars.length)];

        const event = await generateSpecialEvent(type, randomChar.id);

        if (event) {
          const now = new Date();
          const newEvent: ActiveEvent = {
            id: `ai_${Date.now()}`,
            type: 'ai_generated',
            title: event.title,
            description: event.description,
            characterId: event.characterId,
            dialogue: {
            text: event.dialogue.text,
            emotion: event.dialogue.emotion as GeneratedDialogue['emotion'],
            thought: event.dialogue.thought,
            choices: event.dialogue.choices,
          },
            background: event.background,
            rewards: event.rewards,
            expiresAt: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
            isCompleted: false,
          };

          set(state => ({
            activeEvents: [...state.activeEvents, newEvent],
          }));

          get().addNotification(`✨ เหตุการณ์พิเศษ: ${event.title}`);
        }
      },

      // Clear expired events
      clearExpiredEvents: () => {
        const now = new Date();
        set(state => ({
          activeEvents: state.activeEvents.filter(
            e => e.expiresAt > now && !e.isCompleted
          ),
        }));
      },

      // Add notification
      addNotification: (message: string) => {
        set(state => ({
          pendingNotifications: [...state.pendingNotifications, message],
        }));
      },

      // Clear notifications
      clearNotifications: () => {
        set({ pendingNotifications: [] });
      },

      // Get available (uncompleted) events
      getAvailableEvents: () => {
        return get().activeEvents.filter(e => !e.isCompleted);
      },

      // Get event by ID
      getEventById: (id: string) => {
        return get().activeEvents.find(e => e.id === id);
      },

      // Check if there are uncompleted events
      hasUncompletedEvents: () => {
        return get().activeEvents.some(e => !e.isCompleted);
      },
    }),
    {
      name: 'dynamic-events-save',
      version: 1,
    }
  )
);
