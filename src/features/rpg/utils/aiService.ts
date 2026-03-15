import axios from 'axios';
import type { GameChoice, ChatMessage, WorldRules, CharacterProfile, CharacterStats } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using gemini-flash-latest based on available models list
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

interface AiResponse {
  storyText: string;
  choices: GameChoice[];
  statUpdates: {
    hp?: number;
    mana?: number;
    exp?: number;
  };
}

export const callAiGameMaster = async (
  profile: CharacterProfile,
  stats: CharacterStats,
  worldRules: WorldRules,
  history: ChatMessage[],
  currentAction: string
): Promise<AiResponse> => {
  const systemPrompt = `
    You are an expert Game Master for a Dark Fantasy RPG called "Manga Drama World".
    Player Profile: ${profile.name} the ${profile.class}.
    Current Stats: HP ${stats.hp.current}/${stats.hp.max}, Mana ${stats.mana.current}/${stats.mana.max}, Level ${stats.level}.
    World Rules: Name: ${worldRules.worldName}, Theme: ${worldRules.theme}, Chaos: ${worldRules.chaosLevel}%, Magic: ${worldRules.magicLevel}%.

    RULES:
    1. Continue the story based on the player's last action and the chat history.
    2. Be descriptive, epic, and mysterious in Thai language.
    3. If the player rolled dice, incorporate the success/fail result into the narrative.
    4. ALWAYS return a VALID JSON object. No markdown, no backticks.
    5. Required fields:
       {
         "storyText": "Your narrative here in Thai",
         "choices": [{"id": "unique_id", "label": "Short Action Name", "description": "Action details", "actionType": "strength|magic|investigate|etc"}],
         "statUpdates": {"hp": 0, "mana": 0, "exp": 0}
       }
    6. Provide 2-3 meaningful choices for the next turn.
    7. Keep storyText length around 2-3 paragraphs.
  `;

  const chatContext = history.slice(-10).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
  
  const prompt = `
    [SYSTEM]: ${systemPrompt}
    
    [CHAT HISTORY]:
    ${chatContext}
    
    [PLAYER CURRENT ACTION]: ${currentAction}
    
    [GM]: Generate the next part of the story in JSON format.
  `;

  try {
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 800,
        temperature: 0.7,
      }
    });

    if (!response.data.candidates || !response.data.candidates[0].content.parts[0].text) {
      throw new Error("Invalid API response structure");
    }

    let textResponse = response.data.candidates[0].content.parts[0].text;
    
    // Clean up response just in case it has markdown blocks
    textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(textResponse) as AiResponse;
  } catch (error: any) {
    console.error("AI GM Error Detail:", error.response?.data || error.message);
    // Fallback if AI fails
    return {
      storyText: "เกิดความผิดพลาดในการเชื่อมต่อกับพลังเร้นลับ... (AI Error: " + (error.response?.data?.error?.message || "Connection Failed") + ")",
      choices: [{ id: 'retry', label: 'พยายามอีกครั้ง', description: 'ลองเรียกพลังใหม่อีกรอบ', actionType: 'system' }],
      statUpdates: {}
    };
  }
};