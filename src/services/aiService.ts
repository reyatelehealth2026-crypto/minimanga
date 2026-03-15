// AI Service - OpenAI Integration for Dynamic Content Generation
import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface CharacterPersonality {
  name: string;
  personality: string;
  speechStyle: string;
  likes: string[];
  dislikes: string[];
  relationshipLevel: number;
}

export interface DialogueChoice {
  id: string;
  text: string;
  affectionChange?: { characterId: string; amount: number };
  nextSceneId: string;
  condition?: { type: 'affection'; characterId: string; min: number };
}

export interface GeneratedDialogue {
  text: string;
  emotion: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'blush' | 'excited';
  thought?: string;
  choices?: DialogueChoice[];
}

export interface SpecialEventRequest {
  eventType: 'weather' | 'time' | 'holiday' | 'random';
  trigger: string;
  availableCharacters: string[];
  playerContext: {
    favoriteCharacter?: string;
    playTime: number;
    lastLogin: Date;
  };
}

export interface GeneratedEvent {
  title: string;
  description: string;
  characterId: string;
  dialogue: GeneratedDialogue;
  rewards: string[];
  duration: number;
}

// Generate dynamic dialogue based on character personality and context
export async function generateDialogue(
  request: {
    character: CharacterPersonality;
    context: string;
    situation: string;
    mood: 'romantic' | 'comedy' | 'drama' | 'mystery' | 'normal';
    playerName?: string;
  }
): Promise<GeneratedDialogue | null> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return null;
  }

  try {
    const prompt = buildDialoguePrompt(request);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a visual novel dialogue generator. Generate natural, engaging dialogue in Thai language for a manga-style game.

Character: ${request.character.name}
Personality: ${request.character.personality}
Speech Style: ${request.character.speechStyle}
Relationship Level: ${request.character.relationshipLevel}/100

Respond in JSON format:
{
  "text": "dialogue text in Thai",
  "emotion": "normal|happy|sad|angry|surprised|blush|excited",
  "thought": "inner monologue (optional)"
}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return parsed as GeneratedDialogue;
      } catch {
        return {
          text: content,
          emotion: 'normal',
        };
      }
    }
  } catch (error) {
    console.error('Error generating dialogue:', error);
  }

  return null;
}

// Generate special event based on triggers
export async function generateSpecialEvent(
  request: SpecialEventRequest
): Promise<GeneratedEvent | null> {
  if (!OPENAI_API_KEY) {
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Generate a special event for a manga visual novel game in Thai.
Event Type: ${request.eventType}
Trigger: ${request.trigger}

Respond in JSON format:
{
  "title": "event title in Thai",
  "description": "event description",
  "characterId": "character involved",
  "dialogue": {
    "text": "opening dialogue",
    "emotion": "emotion"
  },
  "rewards": ["reward1", "reward2"],
  "duration": minutes
}`,
        },
        {
          role: 'user',
          content: `Create a ${request.eventType} event triggered by: ${request.trigger}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 600,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      try {
        return JSON.parse(content) as GeneratedEvent;
      } catch {
        return null;
      }
    }
  } catch (error) {
    console.error('Error generating event:', error);
  }

  return null;
}

// Build prompt for dialogue generation
function buildDialoguePrompt(request: {
  character: CharacterPersonality;
  context: string;
  situation: string;
  mood: string;
  playerName?: string;
}): string {
  const parts = [
    `Context: ${request.context}`,
    `Situation: ${request.situation}`,
    `Mood: ${request.mood}`,
  ];

  if (request.playerName) {
    parts.push(`Player Name: ${request.playerName}`);
  }

  parts.push(`\nGenerate dialogue for ${request.character.name}:`);

  return parts.join('\n');
}

// Check if AI service is available
export function isAIServiceAvailable(): boolean {
  return !!OPENAI_API_KEY;
}
