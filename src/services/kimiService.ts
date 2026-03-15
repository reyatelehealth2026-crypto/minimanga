// Kimi Service - Moonshot AI Integration
// เน้นการสร้างบรรยากาศเหมือนอ่านนิยาย Visual Novel
import axios from 'axios';

const KIMI_API_KEY = import.meta.env.VITE_KIMI_API_KEY || '';
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export interface KimiDialogueRequest {
  characterName: string;
  personality: string;
  context: string;
  situation: string;
  mood: string;
  relationshipLevel: number;
  playerName?: string;
}

export interface KimiDialogueResponse {
  text: string;
  emotion: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'blush' | 'excited';
  thought?: string;
  atmosphere?: string; // บรรยากาศ/คำบรรยายฉาก
  choices?: {
    text: string;
    affectionChange: number;
  }[];
}

export interface NovelSceneResponse {
  title: string;
  atmosphere: string; // คำบรรยายบรรยากาศ
  narration: string; // คำบรรยายของผู้เล่า
  dialogue: string;
  emotion: KimiDialogueResponse['emotion'];
  innerThought: string; // ความคิดภายในของตัวละคร
  choices: {
    text: string;
    affectionChange: number;
    preview?: string; // คำใบ้ว่าจะเกิดอะไรขึ้น
  }[];
}

// Generate immersive novel-style scene using Kimi
export async function generateNovelSceneWithKimi(
  request: KimiDialogueRequest
): Promise<NovelSceneResponse | null> {
  if (!KIMI_API_KEY) {
    console.warn('Kimi API key not configured');
    return null;
  }

  try {
    const response = await axios.post(
      KIMI_API_URL,
      {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `คุณเป็นนักเขียนนิยาย Visual Novel มังงะชั้นเยี่ยม เขียนในภาษาไทย

ตัวละคร: ${request.characterName}
บุคลิก: ${request.personality}
ความสัมพันธ์: ${request.relationshipLevel}/100

สร้างฉากที่มีบรรยากาศเหมือนอ่านนิยาย เน้นคำบรรยายที่สร้างภาพ อารมณ์ และความรู้สึก

ตอบในรูปแบบนี้:
TITLE: [ชื่อฉากสั้นๆ]
ATMOSPHERE: [บรรยากาศ/คำบรรยายสถานที่ 2-3 ประโยค]
NARRATION: [คำบรรยายของผู้เล่า 1-2 ประโยค]
DIALOGUE: [บทสนทนาของตัวละคร]
EMOTION: [normal/happy/sad/angry/surprised/blush/excited]
INNER_THOUGHT: [ความคิดภายในของตัวละคร]
CHOICE1: [ตัวเลือกที่ 1] | [คะแนนความรู้สึก -10 ถึง +10] | [คำใบ้สั้นๆ]
CHOICE2: [ตัวเลือกที่ 2] | [คะแนนความรู้สึก -10 ถึง +10] | [คำใบ้สั้นๆ]`,
          },
          {
            role: 'user',
            content: `สถานการณ์: ${request.situation}\nอารมณ์: ${request.mood}\nบริบท: ${request.context}`,
          },
        ],
        temperature: 0.85,
        max_tokens: 600,
      },
      {
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (content) {
      return parseNovelScene(content);
    }
  } catch (error) {
    console.error('Error calling Kimi API:', error);
  }

  return null;
}

// Generate dialogue using Kimi (legacy - for backward compatibility)
export async function generateDialogueWithKimi(
  request: KimiDialogueRequest
): Promise<KimiDialogueResponse | null> {
  if (!KIMI_API_KEY) {
    console.warn('Kimi API key not configured');
    return null;
  }

  try {
    const response = await axios.post(
      KIMI_API_URL,
      {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `คุณเป็นตัวละครในเกม Visual Novel มังงะ ตอบเป็นภาษาไทย

ตัวละคร: ${request.characterName}
บุคลิก: ${request.personality}
ความสัมพันธ์: ${request.relationshipLevel}/100

สร้างบทสนทนาที่มีอารมณ์ความรู้สึกลึกซึ้ง มีตัวเลือกให้ผู้เล่น

ตอบในรูปแบบนี้:
ATMOSPHERE: [บรรยากาศ/คำบรรยายสั้นๆ]
DIALOGUE: [บทสนทนา]
EMOTION: [normal/happy/sad/angry/surprised/blush/excited]
THOUGHT: [ความคิดภายใน]
CHOICE1: [ตัวเลือก] | [คะแนน -10 ถึง +10]
CHOICE2: [ตัวเลือก] | [คะแนน -10 ถึง +10]`,
          },
          {
            role: 'user',
            content: `สถานการณ์: ${request.situation}\nอารมณ์: ${request.mood}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 450,
      },
      {
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (content) {
      return parseKimiResponse(content);
    }
  } catch (error) {
    console.error('Error calling Kimi API:', error);
  }

  return null;
}

// Generate romantic scene using Kimi
export async function generateRomanticSceneWithKimi(
  characterName: string,
  relationshipLevel: number
): Promise<{ scene: string; dialogue: string; cgDescription: string } | null> {
  if (!KIMI_API_KEY) return null;

  try {
    const response = await axios.post(
      KIMI_API_URL,
      {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `Create a romantic scene for a manga visual novel in Thai.
Relationship Level: ${relationshipLevel}/100

Format:
SCENE: [scene setting description]
DIALOGUE: [romantic dialogue]
CG: [description for CG image generation]`,
          },
          {
            role: 'user',
            content: `Create a romantic moment with ${characterName}`,
          },
        ],
        temperature: 0.9,
        max_tokens: 400,
      },
      {
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (content) {
      return parseRomanticScene(content);
    }
  } catch (error) {
    console.error('Error generating romantic scene:', error);
  }

  return null;
}

// Generate character letter using Kimi
export async function generateLetterWithKimi(
  characterName: string,
  personality: string,
  relationshipLevel: number
): Promise<string | null> {
  if (!KIMI_API_KEY) return null;

  try {
    const response = await axios.post(
      KIMI_API_URL,
      {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `Write a heartfelt letter from ${characterName} to the player in Thai.
Personality: ${personality}
Relationship: ${relationshipLevel}/100

Make it emotional and personal. 3-5 sentences.`,
          },
        ],
        temperature: 0.85,
        max_tokens: 250,
      },
      {
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data?.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Error generating letter:', error);
    return null;
  }
}

// Parse novel scene response
function parseNovelScene(content: string): NovelSceneResponse {
  const lines = content.split('\n');
  let title = '';
  let atmosphere = '';
  let narration = '';
  let dialogue = '';
  let emotion: KimiDialogueResponse['emotion'] = 'normal';
  let innerThought = '';
  const choices: { text: string; affectionChange: number; preview?: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('TITLE:')) {
      title = trimmed.replace('TITLE:', '').trim();
    } else if (trimmed.startsWith('ATMOSPHERE:')) {
      atmosphere = trimmed.replace('ATMOSPHERE:', '').trim();
    } else if (trimmed.startsWith('NARRATION:')) {
      narration = trimmed.replace('NARRATION:', '').trim();
    } else if (trimmed.startsWith('DIALOGUE:')) {
      dialogue = trimmed.replace('DIALOGUE:', '').trim();
    } else if (trimmed.startsWith('EMOTION:')) {
      const emo = trimmed.replace('EMOTION:', '').trim().toLowerCase();
      if (['normal', 'happy', 'sad', 'angry', 'surprised', 'blush', 'excited'].includes(emo)) {
        emotion = emo as KimiDialogueResponse['emotion'];
      }
    } else if (trimmed.startsWith('INNER_THOUGHT:')) {
      innerThought = trimmed.replace('INNER_THOUGHT:', '').trim();
    } else if (trimmed.startsWith('THOUGHT:')) {
      innerThought = trimmed.replace('THOUGHT:', '').trim();
    } else if (trimmed.startsWith('CHOICE1:') || trimmed.startsWith('CHOICE2:') || trimmed.startsWith('CHOICE3:')) {
      const choiceText = trimmed.replace(/CHOICE\d:/, '').trim();
      const parts = choiceText.split('|');
      if (parts.length >= 2) {
        choices.push({
          text: parts[0].trim(),
          affectionChange: parseInt(parts[1].trim()) || 0,
          preview: parts[2]?.trim(),
        });
      }
    }
  }

  return { title, atmosphere, narration, dialogue, emotion, innerThought, choices };
}

// Parse Kimi response
function parseKimiResponse(content: string): KimiDialogueResponse {
  const lines = content.split('\n');
  let text = '';
  let emotion: KimiDialogueResponse['emotion'] = 'normal';
  let thought = '';
  let atmosphere = '';
  const choices: { text: string; affectionChange: number }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('DIALOGUE:')) {
      text = trimmed.replace('DIALOGUE:', '').trim();
    } else if (trimmed.startsWith('ATMOSPHERE:')) {
      atmosphere = trimmed.replace('ATMOSPHERE:', '').trim();
    } else if (trimmed.startsWith('EMOTION:')) {
      const emo = trimmed.replace('EMOTION:', '').trim().toLowerCase();
      if (['normal', 'happy', 'sad', 'angry', 'surprised', 'blush', 'excited'].includes(emo)) {
        emotion = emo as KimiDialogueResponse['emotion'];
      }
    } else if (trimmed.startsWith('THOUGHT:')) {
      thought = trimmed.replace('THOUGHT:', '').trim();
    } else if (trimmed.startsWith('CHOICE1:') || trimmed.startsWith('CHOICE2:')) {
      const choiceText = trimmed.replace(/CHOICE\d:/, '').trim();
      const parts = choiceText.split('|');
      if (parts.length >= 2) {
        choices.push({
          text: parts[0].trim(),
          affectionChange: parseInt(parts[1].trim()) || 0,
        });
      }
    }
  }

  if (!text) {
    text = content.trim();
  }

  return { text, emotion, thought, atmosphere, choices };
}

// Parse romantic scene
function parseRomanticScene(content: string): { scene: string; dialogue: string; cgDescription: string } {
  const lines = content.split('\n');
  let scene = '';
  let dialogue = '';
  let cgDescription = '';

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('SCENE:')) {
      scene = trimmed.replace('SCENE:', '').trim();
    } else if (trimmed.startsWith('DIALOGUE:')) {
      dialogue = trimmed.replace('DIALOGUE:', '').trim();
    } else if (trimmed.startsWith('CG:')) {
      cgDescription = trimmed.replace('CG:', '').trim();
    }
  }

  return { scene, dialogue, cgDescription };
}

// Check if Kimi is available
export function isKimiAvailable(): boolean {
  return !!KIMI_API_KEY;
}
