// Gemini Service - Google Gemini AI Integration
import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiDialogueRequest {
  characterName: string;
  personality: string;
  context: string;
  situation: string;
  mood: string;
  previousDialogue?: string;
}

export interface GeminiDialogueResponse {
  text: string;
  emotion: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'blush' | 'excited';
  thought?: string;
}

// Generate dialogue using Gemini
export async function generateDialogueWithGemini(
  request: GeminiDialogueRequest
): Promise<GeminiDialogueResponse | null> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured');
    return null;
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a character in a manga visual novel game. Respond in Thai language only.

Character: ${request.characterName}
Personality: ${request.personality}
Situation: ${request.situation}
Mood: ${request.mood}

Respond naturally as this character would speak. Keep it short (1-3 sentences) and emotional.

Format your response as:
TEXT: [dialogue in Thai]
EMOTION: [normal/happy/sad/angry/surprised/blush/excited]
THOUGHT: [inner thought in Thai, optional]`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200,
        },
      }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (content) {
      return parseGeminiResponse(content);
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
  }

  return null;
}

// Generate special event using Gemini
export async function generateEventWithGemini(
  eventType: string,
  characterName: string
): Promise<{ title: string; description: string; dialogue: string } | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Create a special event for a manga visual novel game in Thai.

Event Type: ${eventType}
Character: ${characterName}

Respond in this format:
TITLE: [event title in Thai]
DESCRIPTION: [event description in Thai]
DIALOGUE: [opening dialogue in Thai]`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 300,
        },
      }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (content) {
      return parseEventResponse(content);
    }
  } catch (error) {
    console.error('Error generating event with Gemini:', error);
  }

  return null;
}

// Generate character backstory using Gemini
export async function generateBackstoryWithGemini(
  characterName: string,
  traits: string[]
): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Write a short backstory (2-3 sentences) for a manga character in Thai.

Name: ${characterName}
Traits: ${traits.join(', ')}

Make it emotional and intriguing.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 150,
        },
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error('Error generating backstory:', error);
    return null;
  }
}

// Parse Gemini response
function parseGeminiResponse(content: string): GeminiDialogueResponse {
  const lines = content.split('\n');
  let text = '';
  let emotion: GeminiDialogueResponse['emotion'] = 'normal';
  let thought = '';

  for (const line of lines) {
    if (line.startsWith('TEXT:')) {
      text = line.replace('TEXT:', '').trim();
    } else if (line.startsWith('EMOTION:')) {
      const emo = line.replace('EMOTION:', '').trim().toLowerCase();
      if (['normal', 'happy', 'sad', 'angry', 'surprised', 'blush', 'excited'].includes(emo)) {
        emotion = emo as GeminiDialogueResponse['emotion'];
      }
    } else if (line.startsWith('THOUGHT:')) {
      thought = line.replace('THOUGHT:', '').trim();
    }
  }

  // If no structured format found, use entire content as text
  if (!text) {
    text = content.trim();
  }

  return { text, emotion, thought };
}

// Parse event response
function parseEventResponse(content: string): { title: string; description: string; dialogue: string } {
  const lines = content.split('\n');
  let title = '';
  let description = '';
  let dialogue = '';

  for (const line of lines) {
    if (line.startsWith('TITLE:')) {
      title = line.replace('TITLE:', '').trim();
    } else if (line.startsWith('DESCRIPTION:')) {
      description = line.replace('DESCRIPTION:', '').trim();
    } else if (line.startsWith('DIALOGUE:')) {
      dialogue = line.replace('DIALOGUE:', '').trim();
    }
  }

  return { title, description, dialogue };
}

// Check if Gemini is available
export function isGeminiAvailable(): boolean {
  return !!GEMINI_API_KEY;
}
