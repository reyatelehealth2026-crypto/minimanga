// Time Service - Real-time Events based on actual time
import { format, getHours, isWeekend, getDay } from 'date-fns';

export type TimeOfDay = 
  | 'dawn'      // 05:00 - 06:59
  | 'morning'   // 07:00 - 11:59
  | 'noon'      // 12:00 - 13:59
  | 'afternoon' // 14:00 - 16:59
  | 'evening'   // 17:00 - 19:59
  | 'night'     // 20:00 - 23:59
  | 'midnight'; // 00:00 - 04:59

export type DayOfWeek = 
  | 'sunday' 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday';

export interface TimeEvent {
  id: string;
  title: string;
  description: string;
  timeOfDay: TimeOfDay;
  availableCharacters: string[];
  specialDialogue: string;
  rewards: string[];
  background: string;
  condition?: {
    minAffection?: number;
    specificCharacter?: string;
  };
}

export interface HolidayEvent {
  id: string;
  name: string;
  date: string; // MM-DD format
  title: string;
  description: string;
  availableCharacters: string[];
  specialScene: string;
  rewards: string[];
  background: string;
}

// Get current time of day
export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = getHours(new Date());
  
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  if (hour >= 20 && hour < 24) return 'night';
  return 'midnight';
}

// Get current day of week
export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[getDay(new Date())];
}

// Check if today is weekend
export function isTodayWeekend(): boolean {
  return isWeekend(new Date());
}

// Time-based events
export const timeEvents: Record<TimeOfDay, TimeEvent[]> = {
  dawn: [
    {
      id: 'dawn_jog',
      title: 'วิ่งยามเช้า',
      description: 'อากาศเย็นสบาย มีคนกำลังวิ่งอยู่...',
      timeOfDay: 'dawn',
      availableCharacters: ['hinata'],
      specialDialogue: 'เช้านี้อากาศดีจัง! มาวิ่งด้วยกันไหม?',
      rewards: ['morning_energy', 'health_point'],
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    },
  ],
  morning: [
    {
      id: 'morning_greeting',
      title: 'ทักทายยามเช้า',
      description: 'อรุณสวัสดิ์! ตัวละครมาทักทายคุณ...',
      timeOfDay: 'morning',
      availableCharacters: ['sakura', 'hinata'],
      specialDialogue: 'อรุณสวัสดิ์! วันนี้ตื่นเช้าจัง!',
      rewards: ['morning_greeting', 'daily_boost'],
      background: 'linear-gradient(135deg, #87CEEB 0%, #FFD700 100%)',
    },
    {
      id: 'morning_sleepy',
      title: 'คนง่วงนอน',
      description: 'มีคนยังง่วงนอนอยู่...',
      timeOfDay: 'morning',
      availableCharacters: ['yuki', 'rito'],
      specialDialogue: 'อืมม... อีก 5 นาที...',
      rewards: ['sleepy_moment'],
      background: 'linear-gradient(135deg, #B0C4DE 0%, #D3D3D3 100%)',
    },
  ],
  noon: [
    {
      id: 'noon_lunch',
      title: 'ข้าวเที่ยงด้วยกัน',
      description: 'เที่ยงแล้ว! ใครสักคนชวนไปกินข้าว...',
      timeOfDay: 'noon',
      availableCharacters: ['sakura', 'hinata', 'rito'],
      specialDialogue: 'หิวแล้ว! ไปกินข้าวเที่ยงกัน!',
      rewards: ['lunch_date', 'energy_recovery'],
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    },
  ],
  afternoon: [
    {
      id: 'afternoon_study',
      title: 'ช่วงบ่ายในห้องสมุด',
      description: 'บรรยากาศเงียบสงบในห้องสมุด...',
      timeOfDay: 'afternoon',
      availableCharacters: ['yuki', 'luna'],
      specialDialogue: 'ช่วงบ่ายเงียบดีนะ... มาอ่านหนังสือด้วยกันไหม?',
      rewards: ['knowledge_point', 'quiet_time'],
      background: 'linear-gradient(135deg, #DDA0DD 0%, #98FB98 100%)',
    },
    {
      id: 'afternoon_snack',
      title: 'ขนมบ่าย',
      description: 'ใครบางคนกำลังกินขนม...',
      timeOfDay: 'afternoon',
      availableCharacters: ['sakura'],
      specialDialogue: 'ขนมอร่อยจัง! อยากลองไหม?',
      rewards: ['sweet_treat', 'sakura_happiness'],
      background: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
    },
  ],
  evening: [
    {
      id: 'evening_sunset',
      title: 'พระอาทิตย์ตก',
      description: 'พระอาทิตย์กำลังตกดิน วิวสวยมาก...',
      timeOfDay: 'evening',
      availableCharacters: ['sakura', 'rito', 'luna'],
      specialDialogue: 'พระอาทิตย์ตกสวยจัง... อยากอยู่แบบนี้ไปนานๆ',
      rewards: ['sunset_photo', 'romantic_point'],
      background: 'linear-gradient(135deg, #FF6347 0%, #FFD700 100%)',
    },
    {
      id: 'evening_walk',
      title: 'เดินเล่นยามเย็น',
      description: 'อากาศเย็นสบาย เหมาะกับการเดินเล่น...',
      timeOfDay: 'evening',
      availableCharacters: ['hinata', 'yuki'],
      specialDialogue: 'อากาศดีจัง ไปเดินเล่นกันไหม?',
      rewards: ['evening_stroll', 'relaxation'],
      background: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
    },
  ],
  night: [
    {
      id: 'night_stars',
      title: 'ดูดาวกลางคืน',
      description: 'คืนนี้ท้องฟ้าใส เห็นดาวชัดมาก...',
      timeOfDay: 'night',
      availableCharacters: ['luna', 'yuki', 'rito'],
      specialDialogue: 'ดาวเยอะจัง... อยากดูด้วยกันไปนานๆ',
      rewards: ['stargazing_memory', 'luna_wisdom'],
      background: 'linear-gradient(135deg, #191970 0%, #483D8B 100%)',
    },
    {
      id: 'night_goodnight',
      title: 'ฝันดีนะ',
      description: 'ก่อนนอน มีคนมาบอกฝันดี...',
      timeOfDay: 'night',
      availableCharacters: ['sakura', 'yuki'],
      specialDialogue: 'ฝันดีนะ! พรุ่งนี้เจอกัน!',
      rewards: ['goodnight_kiss', 'sleep_well'],
      background: 'linear-gradient(135deg, #4B0082 0%, #8B008B 100%)',
    },
  ],
  midnight: [
    {
      id: 'midnight_secret',
      title: 'เที่ยงคืนลึกลับ',
      description: 'เที่ยงคืนแล้ว... มีบางอย่างแปลกเกิดขึ้น...',
      timeOfDay: 'midnight',
      availableCharacters: ['luna', 'mystery'],
      specialDialogue: 'เธอมาที่นี่ตอนนี้ได้ยังไง? ดวงจันทร์เต็มดวงคืนนี้... พิเศษมาก',
      rewards: ['midnight_secret', 'mystery_clue', 'luna_affection'],
      background: 'linear-gradient(135deg, #000000 0%, #4B0082 100%)',
      condition: {
        minAffection: 30,
      },
    },
    {
      id: 'midnight_insomnia',
      title: 'นอนไม่หลับ',
      description: 'คุณนอนไม่หลับ และได้ยินเสียงประหลาด...',
      timeOfDay: 'midnight',
      availableCharacters: ['rito', 'yuki'],
      specialDialogue: '...เธอก็นอนไม่หลับเหรอ?',
      rewards: ['late_night_talk', 'deeper_connection'],
      background: 'linear-gradient(135deg, #2F4F4F 0%, #000000 100%)',
    },
  ],
};

// Holiday events (Thai + International)
export const holidayEvents: HolidayEvent[] = [
  {
    id: 'valentine',
    name: 'Valentine\'s Day',
    date: '02-14',
    title: 'วาเลนไทน์พิเศษ',
    description: 'วันแห่งความรัก! มีคนเตรียมเซอร์ไพรส์ไว้ให้คุณ...',
    availableCharacters: ['sakura', 'yuki', 'hinata'],
    specialScene: 'valentine_confession',
    rewards: ['valentine_chocolate', 'love_letter', 'special_cg'],
    background: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)',
  },
  {
    id: 'white_day',
    name: 'White Day',
    date: '03-14',
    title: 'ไวท์เดย์',
    description: 'ตอบแทนความรู้สึกวันนี้...',
    availableCharacters: ['rito'],
    specialScene: 'white_day_gift',
    rewards: ['white_day_gift', 'rito_rare_dialogue'],
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F8FF 100%)',
  },
  {
    id: 'halloween',
    name: 'Halloween',
    date: '10-31',
    title: 'ฮาโลวีนสยองขวัญ',
    description: 'วันฮาโลวีน! ทุกคนแต่งตัวแฟนซี...',
    availableCharacters: ['sakura', 'hinata', 'luna', 'mystery'],
    specialScene: 'halloween_party',
    rewards: ['halloween_costume', 'trick_or_treat', 'spooky_cg'],
    background: 'linear-gradient(135deg, #FF8C00 0%, #800080 100%)',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    date: '12-25',
    title: 'คริสต์มาสอันหนาวเหน็บ',
    description: 'คริสต์มาสนี้ ใครจะอยู่เคียงข้างคุณ...',
    availableCharacters: ['sakura', 'yuki', 'rito', 'luna'],
    specialScene: 'christmas_eve',
    rewards: ['christmas_gift', 'snow_scene', 'romantic_cg'],
    background: 'linear-gradient(135deg, #228B22 0%, #DC143C 100%)',
  },
  {
    id: 'new_year',
    name: 'New Year',
    date: '01-01',
    title: 'ความหวังปีใหม่',
    description: 'ปีใหม่แล้ว! มาอธิษฐานด้วยกัน...',
    availableCharacters: ['sakura', 'hinata', 'yuki', 'rito', 'luna'],
    specialScene: 'new_year_shrine',
    rewards: ['new_year_blessing', 'fortune_slip', 'group_cg'],
    background: 'linear-gradient(135deg, #FFD700 0%, #FF6347 100%)',
  },
  {
    id: 'songkran',
    name: 'Songkran',
    date: '04-13',
    title: 'สงกรานต์สาดน้ำ',
    description: 'สงกรานต์นี้สนุกแน่! เตรียมตัวให้เปียก!',
    availableCharacters: ['sakura', 'hinata'],
    specialScene: 'songkran_water_fight',
    rewards: ['water_gun', 'wet_clothes_cg', 'summer_memory'],
    background: 'linear-gradient(135deg, #00BFFF 0%, #87CEEB 100%)',
  },
  {
    id: 'loy_krathong',
    name: 'Loy Krathong',
    date: '11-15',
    title: 'ลอยกระทง',
    description: 'คืนวันเพ็ญ มาลอยกระทงด้วยกัน...',
    availableCharacters: ['sakura', 'luna', 'yuki'],
    specialScene: 'loy_krathong_night',
    rewards: ['krathong', 'moonlight_cg', 'wish_come_true'],
    background: 'linear-gradient(135deg, #FFD700 0%, #191970 100%)',
  },
];

// Get current time event
export function getCurrentTimeEvent(): TimeEvent | null {
  const timeOfDay = getCurrentTimeOfDay();
  const events = timeEvents[timeOfDay];
  
  if (!events || events.length === 0) return null;
  
  // Return random event for this time
  return events[Math.floor(Math.random() * events.length)];
}

// Check for holiday event
export function getHolidayEvent(): HolidayEvent | null {
  const today = format(new Date(), 'MM-dd');
  return holidayEvents.find(h => h.date === today) || null;
}

// Get time icon
export function getTimeIcon(timeOfDay: TimeOfDay): string {
  const icons: Record<TimeOfDay, string> = {
    dawn: '🌅',
    morning: '☀️',
    noon: '🌤️',
    afternoon: '⛅',
    evening: '🌇',
    night: '🌙',
    midnight: '🌌',
  };
  return icons[timeOfDay];
}

// Get time description in Thai
export function getTimeDescription(timeOfDay: TimeOfDay): string {
  const descriptions: Record<TimeOfDay, string> = {
    dawn: 'ยามเช้ามืด',
    morning: 'เช้า',
    noon: 'เที่ยง',
    afternoon: 'บ่าย',
    evening: 'เย็น',
    night: 'กลางคืน',
    midnight: 'เที่ยงคืน',
  };
  return descriptions[timeOfDay];
}

// Format current time for display
export function formatCurrentTime(): string {
  return format(new Date(), 'HH:mm');
}

// Get greeting based on time
export function getTimeGreeting(): string {
  const hour = getHours(new Date());
  
  if (hour >= 5 && hour < 12) return 'สวัสดีตอนเช้า';
  if (hour >= 12 && hour < 14) return 'สวัสดีตอนเที่ยง';
  if (hour >= 14 && hour < 18) return 'สวัสดีตอนบ่าย';
  if (hour >= 18 && hour < 22) return 'สวัสดีตอนเย็น';
  return 'ราตรีสวัสดิ์';
}
