// Visual Novel Story Data
// ระบบเนื้อเรื่องแบบ Visual Novel

export interface DialogueChoice {
  id: string;
  text: string;
  affectionChange?: { characterId: string; amount: number };
  nextSceneId: string;
  condition?: { type: 'affection'; characterId: string; min: number };
}

export interface DialogueLine {
  id: string;
  characterId: string | null; // null = narrator
  text: string;
  emotion?: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'blush';
  choices?: DialogueChoice[];
  background?: string;
  music?: string;
  soundEffect?: string;
  unlockCharacter?: string; // ปลดล็อกตัวละครใหม่
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  background: string;
  dialogues: DialogueLine[];
  requiredCharacters?: string[]; // ต้องมีตัวละครนี้ถึงจะเล่นได้
  unlockCondition?: { type: 'chapter'; id: string } | { type: 'affection'; characterId: string; min: number };
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  scenes: string[]; // scene IDs
  isLocked: boolean;
  unlockCondition?: { type: 'completeChapter'; chapterId: string } | { type: 'affection'; characterId: string; min: number };
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  portrait: string; // รูปสำหรับ Visual Novel
  description: string;
  personality: string;
  likes: string[];
  dislikes: string[];
  unlockCondition: { type: 'start' } | { type: 'scene'; sceneId: string } | { type: 'affection'; characterId: string; min: number };
  isUnlocked: boolean;
  isSecret: boolean; // ตัวละครลับหรือไม่
}

export interface Location {
  id: string;
  name: string;
  description: string;
  background: string;
  characters: string[]; // character IDs ที่พบได้ที่นี่
  encounterChance: number; // โอกาสพบตัวละคร 0-100
  unlockCondition?: { type: 'chapter'; chapterId: string } | { type: 'character'; characterId: string };
}

// ==================== ตัวละครทั้งหมด ====================
export const characters: CharacterProfile[] = [
  {
    id: 'sakura',
    name: 'ซากุระ',
    role: 'นางเอก',
    image: '/characters/hero-girl.png',
    portrait: '/characters/hero-girl.png',
    description: 'สาวน้อยผู้ร่าเริงและเต็มไปด้วยพลังบวก เธอชอบช่วยเหลือผู้อื่นและมักจะยิ้มให้กับทุกคนเสมอ',
    personality: 'ร่าเริง, ใจดี, ซื่อสัตย์',
    likes: ['ขนมหวาน', 'ดอกไม้', 'เพื่อนๆ'],
    dislikes: ['ความ alone', 'ฝน', 'ความ unfair'],
    unlockCondition: { type: 'start' },
    isUnlocked: true,
    isSecret: false,
  },
  {
    id: 'rito',
    name: 'ไรโตะ',
    role: 'พระเอก',
    image: '/characters/cool-boy.png',
    portrait: '/characters/cool-boy.png',
    description: 'หนุ่มเท่ที่ดูเย็นชาแต่จริงๆ แล้วใจดี เขาชอบช่วยเหลือผู้อื่นแบบไม่เปิดเผยตัว',
    personality: 'เท่, ใจดี, ลึกลับ',
    likes: ['ดนตรี', 'กาแฟ', 'ความเงียบสงบ'],
    dislikes: ['ความวุ่นวาย', 'คนขี้โกง', 'ผักขม'],
    unlockCondition: { type: 'scene', sceneId: 'scene_rito_first_meet' },
    isUnlocked: false,
    isSecret: false,
  },
  {
    id: 'luna',
    name: 'ลูน่า',
    role: 'หมอดู',
    image: '/characters/fortune-girl.png',
    portrait: '/characters/fortune-girl.png',
    description: 'หมอดูสาวลึกลับที่สามารถมองเห็นอนาคตได้ เธอชอบให้คำแนะนำที่เป็นประโยชน์',
    personality: 'ลึกลับ, ฉลาด, เมตตา',
    likes: ['ลูกแก้ววิเศษ', 'ดวงดาว', 'ความลับ'],
    dislikes: ['ความโง่เขลา', 'การโกหก', 'แสงแดดจ้า'],
    unlockCondition: { type: 'affection', characterId: 'sakura', min: 20 },
    isUnlocked: false,
    isSecret: false,
  },
  {
    id: 'hinata',
    name: 'ฮินาตะ',
    role: 'นักกีฬา',
    image: '/characters/sporty-girl.png',
    portrait: '/characters/sporty-girl.png',
    description: 'สาวน้อยนักกีฬาที่เต็มไปด้วยพลังงาน เธอไม่เคยยอมแพ้และมักจะสร้างแรงบันดาลใจให้ผู้อื่น',
    personality: 'กระตือรือร้น, ขยัน, มุ่งมั่น',
    likes: ['กีฬา', 'การแข่งขัน', 'ชัยชนะ'],
    dislikes: ['การยอมแพ้', 'ความขี้เกียจ', 'อาหารมัน'],
    unlockCondition: { type: 'scene', sceneId: 'scene_hinata_sports' },
    isUnlocked: false,
    isSecret: false,
  },
  {
    id: 'yuki',
    name: 'ยูกิ',
    role: 'นักอ่าน',
    image: '/characters/shy-girl.png',
    portrait: '/characters/shy-girl.png',
    description: 'สาวน้อยขี้อายที่รักการอ่านหนังสือ เธอมีโลกส่วนตัวที่สวยงามและเต็มไปด้วยจินตนาการ',
    personality: 'ขี้อาย, อ่อนโยน, ฉลาด',
    likes: ['หนังสือ', 'ห้องสมุด', 'ฤดูหนาว'],
    dislikes: ['คนพูดเสียงดัง', 'ที่แออัด', 'การพูดในที่สาธารณะ'],
    unlockCondition: { type: 'scene', sceneId: 'scene_yuki_library' },
    isUnlocked: false,
    isSecret: false,
  },
  {
    id: 'mystery',
    name: '???',
    role: 'ตัวละครลับ',
    image: '/characters/fortune-girl.png',
    portrait: '/characters/fortune-girl.png',
    description: 'ตัวละครลึกลับที่ยังไม่มีใครรู้จัก...',
    personality: '???',
    likes: ['???'],
    dislikes: ['???'],
    unlockCondition: { type: 'affection', characterId: 'luna', min: 50 },
    isUnlocked: false,
    isSecret: true,
  },
];

// ==================== สถานที่ ====================
export const locations: Location[] = [
  {
    id: 'school',
    name: 'โรงเรียน',
    description: 'โรงเรียนมัธยมปลายที่เต็มไปด้วยความทรงจำ',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    characters: ['sakura', 'rito'],
    encounterChance: 60,
  },
  {
    id: 'library',
    name: 'ห้องสมุด',
    description: 'ห้องสมุดเงียบสงบที่เต็มไปด้วยหนังสือ',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    characters: ['yuki'],
    encounterChance: 80,
    unlockCondition: { type: 'chapter', chapterId: 'chapter_1' },
  },
  {
    id: 'gym',
    name: 'สนามกีฬา',
    description: 'สนามกีฬาที่เต็มไปด้วยพลังงาน',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    characters: ['hinata'],
    encounterChance: 70,
    unlockCondition: { type: 'chapter', chapterId: 'chapter_1' },
  },
  {
    id: 'shrine',
    name: 'ศาลเจ้า',
    description: 'ศาลเจ้าเก่าแก่ที่มีกลิ่นอายลึกลับ',
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    characters: ['luna'],
    encounterChance: 50,
    unlockCondition: { type: 'character', characterId: 'sakura' },
  },
  {
    id: 'secret_garden',
    name: 'สวนลับ',
    description: 'สวนที่ซ่อนอยู่ลึกในโรงเรียน...',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    characters: ['mystery'],
    encounterChance: 30,
    unlockCondition: { type: 'character', characterId: 'luna' },
  },
];

// ==================== ฉากเนื้อเรื่อง ====================
export const scenes: Record<string, Scene> = {
  'scene_prologue': {
    id: 'scene_prologue',
    title: 'บทนำ',
    description: 'จุดเริ่มต้นของเรื่องราว',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: null,
        text: 'วันนี้เป็นวันแรกของเทอมใหม่...',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      {
        id: 'd2',
        characterId: 'sakura',
        text: 'สวัสดี! ฉันชื่อซากุระ ยินดีที่ได้รู้จัก!',
        emotion: 'happy',
      },
      {
        id: 'd3',
        characterId: 'sakura',
        text: 'วันนี้อากาศดีจังเลยนะ ไปเที่ยวที่ไหนดี?',
        emotion: 'normal',
        choices: [
          {
            id: 'c1',
            text: 'ไปห้องสมุดกันไหม?',
            affectionChange: { characterId: 'sakura', amount: 5 },
            nextSceneId: 'scene_library_intro',
          },
          {
            id: 'c2',
            text: 'ไปสนามกีฬากันเถอะ',
            affectionChange: { characterId: 'sakura', amount: 3 },
            nextSceneId: 'scene_gym_intro',
          },
          {
            id: 'c3',
            text: 'อยู่ที่นี่ก็สบายดี',
            affectionChange: { characterId: 'sakura', amount: 2 },
            nextSceneId: 'scene_stay_school',
          },
        ],
      },
    ],
  },
  'scene_library_intro': {
    id: 'scene_library_intro',
    title: 'ห้องสมุด',
    description: 'พบกับยูกิเป็นครั้งแรก',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: null,
        text: 'คุณและซากุระเดินเข้ามาในห้องสมุด...',
      },
      {
        id: 'd2',
        characterId: 'sakura',
        text: 'โอ้! ดูเหมือนจะมีคนอยู่ตรงนั้น',
        emotion: 'surprised',
      },
      {
        id: 'd3',
        characterId: 'yuki',
        text: 'อ๊ะ... ข-ขอโทษค่ะ...',
        emotion: 'surprised',
        unlockCharacter: 'yuki',
      },
      {
        id: 'd4',
        characterId: 'yuki',
        text: 'ฉันชื่อยูกิค่ะ... ยินดีที่ได้รู้จัก...',
        emotion: 'blush',
      },
      {
        id: 'd5',
        characterId: 'sakura',
        text: 'ยินดีที่ได้รู้จักนะยูกิ! มาเป็นเพื่อนกันเถอะ!',
        emotion: 'happy',
      },
    ],
  },
  'scene_gym_intro': {
    id: 'scene_gym_intro',
    title: 'สนามกีฬา',
    description: 'พบกับฮินาตะเป็นครั้งแรก',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: null,
        text: 'เสียงตะโกนดังมาจากสนามเทนนิส...',
      },
      {
        id: 'd2',
        characterId: 'hinata',
        text: 'เอาล่ะ! อีกครั้ง! ฉันทำได้!',
        emotion: 'happy',
        unlockCharacter: 'hinata',
      },
      {
        id: 'd3',
        characterId: 'sakura',
        text: 'ว้าว! เธอเก่งจังเลย!',
        emotion: 'surprised',
      },
      {
        id: 'd4',
        characterId: 'hinata',
        text: 'อ๊ะ! มีคนมาดูด้วยเหรอ? ฉันชื่อฮินาตะ! มาเล่นด้วยกันไหม?',
        emotion: 'happy',
      },
    ],
  },
  'scene_stay_school': {
    id: 'scene_stay_school',
    title: 'ลานโรงเรียน',
    description: 'พบกับไรโตะ',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: null,
        text: 'ขณะที่คุณกำลังนั่งพัก...',
      },
      {
        id: 'd2',
        characterId: 'rito',
        text: '...',
        emotion: 'normal',
        unlockCharacter: 'rito',
      },
      {
        id: 'd3',
        characterId: 'sakura',
        text: 'อ๊ะ! นั่นไรโตะรึเปล่า?',
        emotion: 'surprised',
      },
      {
        id: 'd4',
        characterId: 'rito',
        text: '...สวัสดี',
        emotion: 'normal',
      },
    ],
  },
  'scene_rito_first_meet': {
    id: 'scene_rito_first_meet',
    title: 'พบไรโตะ',
    description: 'การพบกันครั้งแรกกับไรโตะ',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: 'rito',
        text: 'เธอคือคนใหม่สินะ',
        emotion: 'normal',
      },
      {
        id: 'd2',
        characterId: 'rito',
        text: 'ฉันชื่อไรโตะ อย่ามายุ่งกับฉันมากนักล่ะ',
        emotion: 'normal',
      },
    ],
  },
  'scene_hinata_sports': {
    id: 'scene_hinata_sports',
    title: 'ฝึกซ้อม',
    description: 'ซ้อมกีฬากับฮินาตะ',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: 'hinata',
        text: 'มาซ้อมด้วยกันไหม? จะได้แข็งแรง!',
        emotion: 'happy',
      },
    ],
  },
  'scene_yuki_library': {
    id: 'scene_yuki_library',
    title: 'ห้องสมุด',
    description: 'พบยูกิที่ห้องสมุด',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: 'yuki',
        text: 'อ๊ะ... ค-คุณมาอีกแล้วเหรอคะ?',
        emotion: 'blush',
      },
    ],
  },
  'scene_luna_shrine': {
    id: 'scene_luna_shrine',
    title: 'ศาลเจ้า',
    description: 'พบลูน่าที่ศาลเจ้า',
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: null,
        text: 'คุณรู้สึกถึงกลิ่นอายลึกลับ...',
      },
      {
        id: 'd2',
        characterId: 'luna',
        text: 'ฉันรอเธออยู่... ฉันเห็นเธอมาในความฝัน...',
        emotion: 'normal',
        unlockCharacter: 'luna',
      },
      {
        id: 'd3',
        characterId: 'luna',
        text: 'ฉันชื่อลูน่า เป็นหมอดู... อยากรู้อนาคตไหม?',
        emotion: 'happy',
      },
    ],
  },
  'scene_mystery_encounter': {
    id: 'scene_mystery_encounter',
    title: 'สวนลับ',
    description: 'พบตัวละครลับ',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: null,
        text: 'ที่สวนลับแห่งนี้... มีบางอย่างรอคุณอยู่',
      },
      {
        id: 'd2',
        characterId: 'mystery',
        text: 'สวัสดี... ฉันรอเธอมานานแล้ว',
        emotion: 'normal',
        unlockCharacter: 'mystery',
      },
    ],
  },
  'scene_dynamic_event': {
    id: 'scene_dynamic_event',
    title: 'เหตุการณ์พิเศษ',
    description: 'เหตุการณ์ที่เกิดขึ้นตามเวลาหรือสภาพอากาศ',
    background: 'linear-gradient(135deg, #e94560 0%, #533483 100%)',
    dialogues: [
      {
        id: 'd1',
        characterId: 'sakura',
        text: 'วันนี้มีอะไรพิเศษรออยู่นะ! ไปดูกันเถอะ!',
        emotion: 'happy',
      },
      {
        id: 'd2',
        characterId: 'sakura',
        text: 'เธออยากทำอะไรวันนี้?',
        emotion: 'normal',
        choices: [
          {
            id: 'c1',
            text: 'ไปเที่ยวเล่นกัน!',
            affectionChange: { characterId: 'sakura', amount: 5 },
            nextSceneId: 'scene_dynamic_event',
          },
          {
            id: 'c2',
            text: 'อยากพักผ่อน...',
            affectionChange: { characterId: 'sakura', amount: 2 },
            nextSceneId: 'scene_dynamic_event',
          },
        ],
      },
    ],
  },
};

// ==================== บท (Chapters) ====================
export const chapters: Chapter[] = [
  {
    id: 'chapter_prologue',
    title: 'บทนำ: จุดเริ่มต้น',
    description: 'วันแรกของเทอมใหม่',
    thumbnail: '/characters/hero-girl.png',
    scenes: ['scene_prologue'],
    isLocked: false,
  },
  {
    id: 'chapter_1',
    title: 'บทที่ 1: เพื่อนใหม่',
    description: 'พบกับเพื่อนใหม่ในโรงเรียน',
    thumbnail: '/characters/sporty-girl.png',
    scenes: ['scene_library_intro', 'scene_gym_intro', 'scene_stay_school'],
    isLocked: true,
    unlockCondition: { type: 'completeChapter', chapterId: 'chapter_prologue' },
  },
  {
    id: 'chapter_2',
    title: 'บทที่ 2: ความลับ',
    description: 'ศาลเจ้าลึกลับ',
    thumbnail: '/characters/fortune-girl.png',
    scenes: ['scene_luna_shrine'],
    isLocked: true,
    unlockCondition: { type: 'affection', characterId: 'sakura', min: 30 },
  },
  {
    id: 'chapter_secret',
    title: '???',
    description: 'ตัวละครลับ',
    thumbnail: '/characters/fortune-girl.png',
    scenes: ['scene_mystery_encounter'],
    isLocked: true,
    unlockCondition: { type: 'affection', characterId: 'luna', min: 50 },
  },
];

// ==================== ชื่อฉากที่ปลดล็อกตัวละคร ====================
export const characterUnlockScenes: Record<string, string> = {
  'rito': 'scene_rito_first_meet',
  'yuki': 'scene_library_intro',
  'hinata': 'scene_gym_intro',
  'luna': 'scene_luna_shrine',
  'mystery': 'scene_mystery_encounter',
};
