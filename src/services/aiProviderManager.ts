// AI Provider Manager - Unified interface for multiple AI services
import { 
  generateDialogue as generateOpenAIDialogue, 
  generateSpecialEvent as generateOpenAIEvent,
  isAIServiceAvailable as isOpenAIAvailable 
} from './aiService';
import { 
  generateDialogueWithGemini, 
  generateEventWithGemini,
  isGeminiAvailable 
} from './geminiService';
import { 
  generateDialogueWithKimi, 
  generateRomanticSceneWithKimi,
  generateNovelSceneWithKimi,
  isKimiAvailable
} from './kimiService';

export type AIProvider = 'openai' | 'gemini' | 'kimi' | 'auto';

export interface AIRequest {
  characterName: string;
  personality: string;
  context: string;
  situation: string;
  mood: 'romantic' | 'comedy' | 'drama' | 'mystery' | 'normal';
  relationshipLevel: number;
  playerName?: string;
}

export interface AIResponse {
  text: string;
  emotion: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'blush' | 'excited';
  thought?: string;
  choices?: {
    text: string;
    affectionChange: number;
    preview?: string;
  }[];
  provider: AIProvider;
}

export interface AIEventResponse {
  title: string;
  description: string;
  characterId: string;
  dialogue: {
    text: string;
    emotion: string;
    thought?: string;
    choices?: any[];
  };
  background: string;
  rewards: string[];
  provider: AIProvider;
}

export interface NovelSceneRequest {
  characterName: string;
  personality: string;
  context: string;
  situation: string;
  mood: 'romantic' | 'comedy' | 'drama' | 'mystery' | 'normal';
  relationshipLevel: number;
  playerName?: string;
}

export interface NovelSceneResult {
  title: string;
  atmosphere: string; // บรรยากาศ/คำบรรยายสถานที่
  narration: string; // คำบรรยายของผู้เล่า
  dialogue: string;
  emotion: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'blush' | 'excited';
  innerThought: string; // ความคิดภายในของตัวละคร
  choices: {
    text: string;
    affectionChange: number;
    preview?: string;
  }[];
  provider: AIProvider;
}

// Get available AI providers
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  
  if (isOpenAIAvailable()) providers.push('openai');
  if (isGeminiAvailable()) providers.push('gemini');
  if (isKimiAvailable()) providers.push('kimi');
  
  return providers;
}

// Get best available provider
export function getBestProvider(): AIProvider {
  const providers = getAvailableProviders();
  
  // Priority: Kimi > OpenAI > Gemini
  if (providers.includes('kimi')) return 'kimi';
  if (providers.includes('openai')) return 'openai';
  if (providers.includes('gemini')) return 'gemini';
  
  return 'auto'; // Will use fallback
}

// Generate dialogue with selected provider
export async function generateDialogue(
  request: AIRequest,
  preferredProvider: AIProvider = 'auto'
): Promise<AIResponse | null> {
  const provider = preferredProvider === 'auto' ? getBestProvider() : preferredProvider;
  
  let response: AIResponse | null = null;
  
  switch (provider) {
    case 'openai':
      const openaiResult = await generateOpenAIDialogue({
        character: {
          name: request.characterName,
          personality: request.personality,
          speechStyle: 'natural',
          likes: [],
          dislikes: [],
          relationshipLevel: request.relationshipLevel,
        },
        context: request.context,
        situation: request.situation,
        mood: request.mood,
        playerName: request.playerName,
      });
      
      if (openaiResult) {
        response = {
          text: openaiResult.text,
          emotion: openaiResult.emotion,
          thought: openaiResult.thought,
          choices: openaiResult.choices?.map(c => ({
            text: c.text,
            affectionChange: c.affectionChange?.amount || 0,
            preview: c.nextSceneId,
          })),
          provider: 'openai',
        };
      }
      break;
      
    case 'gemini':
      const geminiResult = await generateDialogueWithGemini({
        characterName: request.characterName,
        personality: request.personality,
        context: request.context,
        situation: request.situation,
        mood: request.mood,
      });
      
      if (geminiResult) {
        response = {
          text: geminiResult.text,
          emotion: geminiResult.emotion,
          thought: geminiResult.thought,
          provider: 'gemini',
        };
      }
      break;
      
    case 'kimi':
      const kimiResult = await generateDialogueWithKimi({
        characterName: request.characterName,
        personality: request.personality,
        context: request.context,
        situation: request.situation,
        mood: request.mood,
        relationshipLevel: request.relationshipLevel,
      });
      
      if (kimiResult) {
        response = {
          text: kimiResult.text,
          emotion: kimiResult.emotion,
          thought: kimiResult.thought,
          choices: kimiResult.choices,
          provider: 'kimi',
        };
      }
      break;
  }
  
  // If selected provider failed, try others
  if (!response && provider !== 'auto') {
    console.log(`Provider ${provider} failed, trying fallback...`);
    return generateDialogue(request, 'auto');
  }
  
  return response;
}

// Generate special event
export async function generateSpecialEvent(
  eventType: string,
  characterId: string,
  preferredProvider: AIProvider = 'auto'
): Promise<AIEventResponse | null> {
  const provider = preferredProvider === 'auto' ? getBestProvider() : preferredProvider;
  
  // Map character IDs to names
  const characterNames: Record<string, string> = {
    'sakura': 'ซากุระ',
    'rito': 'ไรโตะ',
    'luna': 'ลูน่า',
    'hinata': 'ฮินาตะ',
    'yuki': 'ยูกิ',
    'mystery': '???',
  };
  
  const characterName = characterNames[characterId] || characterId;
  
  let response: AIEventResponse | null = null;
  
  switch (provider) {
    case 'openai':
      const openaiEvent = await generateOpenAIEvent({
        eventType: eventType as any,
        trigger: `special_${eventType}`,
        availableCharacters: [characterId],
        playerContext: {
          favoriteCharacter: characterId,
          playTime: 0,
          lastLogin: new Date(),
        },
      });
      
      if (openaiEvent) {
        response = {
          title: openaiEvent.title,
          description: openaiEvent.description,
          characterId: openaiEvent.characterId,
          dialogue: openaiEvent.dialogue,
          background: 'linear-gradient(135deg, #e94560 0%, #533483 100%)',
          rewards: openaiEvent.rewards,
          provider: 'openai',
        };
      }
      break;
      
    case 'gemini':
      const geminiEvent = await generateEventWithGemini(eventType, characterName);
      
      if (geminiEvent) {
        response = {
          title: geminiEvent.title,
          description: geminiEvent.description,
          characterId,
          dialogue: {
            text: geminiEvent.dialogue,
            emotion: 'happy',
          },
          background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
          rewards: ['special_event_reward'],
          provider: 'gemini',
        };
      }
      break;
      
    case 'kimi':
      // Kimi doesn't have direct event generation, use romantic scene as fallback
      const kimiScene = await generateRomanticSceneWithKimi(characterName, 50);
      
      if (kimiScene) {
        response = {
          title: `เหตุการณ์พิเศษกับ${characterName}`,
          description: kimiScene.scene,
          characterId,
          dialogue: {
            text: kimiScene.dialogue,
            emotion: 'blush',
          },
          background: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)',
          rewards: ['romantic_scene', 'affection_boost'],
          provider: 'kimi',
        };
      }
      break;
  }
  
  // Fallback to other providers
  if (!response && provider !== 'auto') {
    return generateSpecialEvent(eventType, characterId, 'auto');
  }
  
  return response;
}

// Generate romantic content (Kimi specializes in this)
export async function generateRomanticContent(
  characterName: string,
  relationshipLevel: number
): Promise<{ scene: string; dialogue: string; cgDescription: string } | null> {
  // Kimi is best for romantic content
  if (isKimiAvailable()) {
    return generateRomanticSceneWithKimi(characterName, relationshipLevel);
  }
  
  // Fallback to other providers
  return null;
}

// Generate immersive novel-style scene (Kimi is best for this)
export async function generateNovelScene(
  request: NovelSceneRequest,
  preferredProvider: AIProvider = 'auto'
): Promise<NovelSceneResult | null> {
  const provider = preferredProvider === 'auto' ? getBestProvider() : preferredProvider;
  
  // Kimi is best for novel-style content
  if (provider === 'kimi' || (provider === 'auto' && isKimiAvailable())) {
    const kimiResult = await generateNovelSceneWithKimi({
      characterName: request.characterName,
      personality: request.personality,
      context: request.context,
      situation: request.situation,
      mood: request.mood,
      relationshipLevel: request.relationshipLevel,
      playerName: request.playerName,
    });
    
    if (kimiResult) {
      return {
        title: kimiResult.title,
        atmosphere: kimiResult.atmosphere,
        narration: kimiResult.narration,
        dialogue: kimiResult.dialogue,
        emotion: kimiResult.emotion,
        innerThought: kimiResult.innerThought,
        choices: kimiResult.choices,
        provider: 'kimi',
      };
    }
  }
  
  // Fallback to regular dialogue generation
  const fallback = await generateDialogue(request, provider === 'kimi' ? 'openai' : provider);
  if (fallback) {
    return {
      title: 'ฉากพิเศษ',
      atmosphere: '',
      narration: '',
      dialogue: fallback.text,
      emotion: fallback.emotion,
      innerThought: fallback.thought || '',
      choices: fallback.choices || [],
      provider: fallback.provider,
    };
  }
  
  return null;
}

// Generate letter from character
export async function generateCharacterLetter(
  characterName: string,
  personality: string,
  relationshipLevel: number
): Promise<string | null> {
  // Kimi is best for emotional letters
  if (isKimiAvailable()) {
    return generateLetterWithKimiFallback(characterName, personality, relationshipLevel);
  }
  
  // Fallback to Gemini
  if (isGeminiAvailable()) {
    const { generateBackstoryWithGemini } = await import('./geminiService');
    return generateBackstoryWithGemini(characterName, [personality]);
  }
  
  return null;
}

// Kimi letter fallback
async function generateLetterWithKimiFallback(
  characterName: string,
  personality: string,
  relationshipLevel: number
): Promise<string | null> {
  const KIMI_API_KEY = import.meta.env.VITE_KIMI_API_KEY || '';
  if (!KIMI_API_KEY) return null;
  
  try {
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIMI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `เขียนจดหมายจาก ${characterName} ถึงผู้เล่น เป็นภาษาไทย
บุคลิก: ${personality}
ความสัมพันธ์: ${relationshipLevel}/100

เขียนให้อบอุ่น ซึ้งใจ 3-5 ประโยค`,
          },
        ],
        temperature: 0.85,
        max_tokens: 250,
      }),
    });
    
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Error generating letter:', error);
    return null;
  }
}

// Check if any AI service is available
export function isAnyAIAvailable(): boolean {
  return getAvailableProviders().length > 0;
}

// Get provider display name
export function getProviderDisplayName(provider: AIProvider): string {
  const names: Record<AIProvider, string> = {
    'openai': 'OpenAI GPT',
    'gemini': 'Google Gemini',
    'kimi': 'Kimi AI',
    'auto': 'Auto Select',
  };
  return names[provider] || provider;
}

// Get provider icon/color
export function getProviderStyle(provider: AIProvider): { color: string; icon: string } {
  const styles: Record<AIProvider, { color: string; icon: string }> = {
    'openai': { color: '#10A37F', icon: '🤖' },
    'gemini': { color: '#4285F4', icon: '✨' },
    'kimi': { color: '#E91E63', icon: '🌙' },
    'auto': { color: '#9E9E9E', icon: '🎲' },
  };
  return styles[provider] || styles.auto;
}
