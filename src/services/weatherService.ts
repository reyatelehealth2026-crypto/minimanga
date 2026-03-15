// Weather Service - Real-world Weather Integration
import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export type WeatherCondition = 
  | 'sunny' 
  | 'cloudy' 
  | 'rainy' 
  | 'stormy' 
  | 'snowy' 
  | 'foggy' 
  | 'clear';

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number; // Celsius
  humidity: number;
  description: string;
  icon: string;
  location: string;
}

export interface WeatherEvent {
  id: string;
  title: string;
  description: string;
  condition: WeatherCondition;
  availableCharacters: string[];
  specialDialogue: string;
  rewards: string[];
  background: string;
}

// Get current weather (mock if no API key)
export async function getCurrentWeather(
  city: string = 'Bangkok'
): Promise<WeatherData | null> {
  if (!WEATHER_API_KEY) {
    // Return mock weather based on actual time
    return getMockWeather();
  }

  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
        lang: 'th',
      },
    });

    const data = response.data;
    const weatherId = data.weather[0]?.id || 800;

    return {
      condition: mapWeatherCode(weatherId),
      temperature: Math.round(data.main?.temp || 25),
      humidity: data.main?.humidity || 60,
      description: data.weather[0]?.description || 'แจ่มใส',
      icon: data.weather[0]?.icon || '01d',
      location: data.name || city,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return getMockWeather();
  }
}

// Map OpenWeatherMap code to our conditions
function mapWeatherCode(code: number): WeatherCondition {
  if (code >= 200 && code < 300) return 'stormy';
  if (code >= 300 && code < 600) return 'rainy';
  if (code >= 600 && code < 700) return 'snowy';
  if (code >= 700 && code < 800) return 'foggy';
  if (code === 800) return 'clear';
  if (code > 800 && code < 900) return 'cloudy';
  return 'sunny';
}

// Get mock weather based on time
function getMockWeather(): WeatherData {
  const hour = new Date().getHours();
  
  // Simulate different weather based on time
  if (hour >= 6 && hour < 18) {
    return {
      condition: 'sunny',
      temperature: 30,
      humidity: 65,
      description: 'แดดจ้า',
      icon: '01d',
      location: 'กรุงเทพฯ',
    };
  }
  
  return {
    condition: 'clear',
    temperature: 25,
    humidity: 70,
    description: 'ท้องฟ้าใส',
    icon: '01n',
    location: 'กรุงเทพฯ',
  };
}

// Weather-based events
export const weatherEvents: Record<WeatherCondition, WeatherEvent[]> = {
  sunny: [
    {
      id: 'sunny_picnic',
      title: 'ปิกนิกใต้แดดอ่อน',
      description: 'วันนี้อากาศดีจัง! ไปปิกนิกกันไหม?',
      condition: 'sunny',
      availableCharacters: ['sakura', 'hinata'],
      specialDialogue: 'แดดวันนี้อุ่นสบายดีนะ อยากอยู่แบบนี้ตลอดไปเลย...',
      rewards: ['picnic_photo', 'sunny_day_memory'],
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    },
    {
      id: 'sunny_sports',
      title: 'กีฬากลางแดด',
      description: 'อากาศดีแบบนี้ต้องออกกำลังกาย!',
      condition: 'sunny',
      availableCharacters: ['hinata'],
      specialDialogue: 'มาแข่งกัน! ฉันจะไม่แพ้เธอหรอก!',
      rewards: ['sports_energy', 'hinata_affection'],
      background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)',
    },
  ],
  cloudy: [
    {
      id: 'cloudy_reading',
      title: 'อ่านหนังสือวันฟ้าครึ้ม',
      description: 'ฟ้าครึ้มแบบนี้เหมาะกับการอ่านหนังสือ...',
      condition: 'cloudy',
      availableCharacters: ['yuki', 'rito'],
      specialDialogue: 'เงียบสงบดีนะ... อยากอยู่แบบนี้ไปนานๆ',
      rewards: ['book_recommendation', 'quiet_time'],
      background: 'linear-gradient(135deg, #B0C4DE 0%, #D3D3D3 100%)',
    },
  ],
  rainy: [
    {
      id: 'rainy_umbrella',
      title: 'แชร์ร่มด้วยกัน',
      description: 'ฝนตกหนัก! คุณลืมร่มที่บ้าน...',
      condition: 'rainy',
      availableCharacters: ['sakura', 'yuki'],
      specialDialogue: 'อ๊ะ! เธอเปียกหมดแล้ว! มาใกล้ๆ ฉันหน่อยสิ',
      rewards: ['shared_umbrella', 'rainy_day_memory'],
      background: 'linear-gradient(135deg, #4682B4 0%, #5F9EA0 100%)',
    },
    {
      id: 'rainy_cafe',
      title: 'หลบฝนในร้านกาแฟ',
      description: 'ฝนตกหนัก คุณเข้ามาหลบฝนในร้านกาแฟ...',
      condition: 'rainy',
      availableCharacters: ['rito', 'luna'],
      specialDialogue: '...ฝนตกหนักจัง รอที่นี่ก่อนก็ได้',
      rewards: ['warm_coffee', 'cozy_moment'],
      background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
    },
  ],
  stormy: [
    {
      id: 'stormy_scared',
      title: 'พายุและความกลัว',
      description: 'ฟ้าร้องดังมาก! มีคนกลัวฟ้าร้อง...',
      condition: 'stormy',
      availableCharacters: ['sakura', 'yuki'],
      specialDialogue: 'ตะ...ตกใจหมด! อย่าทิ้งฉันไปนะ!',
      rewards: ['protector_badge', 'trust_point'],
      background: 'linear-gradient(135deg, #4B0082 0%, #483D8B 100%)',
    },
  ],
  snowy: [
    {
      id: 'snowy_snowman',
      title: 'สร้างสโนว์แมน',
      description: 'หิมะตกแล้ว! มาสร้างสโนว์แมนกัน!',
      condition: 'snowy',
      availableCharacters: ['sakura', 'hinata'],
      specialDialogue: 'ว้าว! หิมะ! มาเล่นด้วยกันเถอะ!',
      rewards: ['snowman_photo', 'winter_memory'],
      background: 'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)',
    },
  ],
  foggy: [
    {
      id: 'foggy_mystery',
      title: 'หมอกลึกลับ',
      description: 'หมอกหนามาก... คุณได้ยินเสียงใครบางคน...',
      condition: 'foggy',
      availableCharacters: ['luna', 'mystery'],
      specialDialogue: 'ในหมอกนี้... ความจริงถูกซ่อนอยู่...',
      rewards: ['mystery_clue', 'secret_dialogue'],
      background: 'linear-gradient(135deg, #708090 0%, #A9A9A9 100%)',
    },
  ],
  clear: [
    {
      id: 'clear_stargazing',
      title: 'ดูดาวกลางคืน',
      description: 'ท้องฟ้าใส เหมาะกับการดูดาว...',
      condition: 'clear',
      availableCharacters: ['luna', 'yuki'],
      specialDialogue: 'ดวงดาวสวยจัง... อยากดูด้วยกันแบบนี้ตลอดไป',
      rewards: ['star_map', 'romantic_moment'],
      background: 'linear-gradient(135deg, #191970 0%, #000080 100%)',
    },
  ],
};

// Get event for current weather
export function getWeatherEvent(condition: WeatherCondition): WeatherEvent | null {
  const events = weatherEvents[condition];
  if (!events || events.length === 0) return null;
  
  // Return random event for this weather
  return events[Math.floor(Math.random() * events.length)];
}

// Get weather icon
export function getWeatherIcon(condition: WeatherCondition): string {
  const icons: Record<WeatherCondition, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    snowy: '❄️',
    foggy: '🌫️',
    clear: '🌙',
  };
  return icons[condition];
}

// Get weather description in Thai
export function getWeatherDescription(condition: WeatherCondition): string {
  const descriptions: Record<WeatherCondition, string> = {
    sunny: 'แดดจ้า',
    cloudy: 'เมฆมาก',
    rainy: 'ฝนตก',
    stormy: 'พายุ',
    snowy: 'หิมะตก',
    foggy: 'หมอกหนา',
    clear: 'ท้องฟ้าใส',
  };
  return descriptions[condition];
}
