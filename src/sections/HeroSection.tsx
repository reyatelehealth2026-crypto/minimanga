import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { SpeechBubble } from '@/components/manga/SpeechBubble';
import { EmotionMark } from '@/components/manga/EmotionMark';

const greetings = [
  'ยินดีต้อนรับสู่ Manga World! ✨',
  'วันนี้เป็นยังไงบ้าง? 💕',
  'มาเล่นด้วยกันเถอะ! 🎮',
  'คิดถึงจัง~ 💖',
];

interface Emotion {
  id: number;
  type: 'heart' | 'sparkle';
  x: number;
  y: number;
}

export function HeroSection() {
  const [showBubble, setShowBubble] = useState(false);
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 3000);
    }, 5000);

    const greetingInterval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(greetingInterval);
    };
  }, []);

  const handleCharacterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickCount((prev) => prev + 1);
    
    // Add heart
    const newHeart = { id: Date.now(), x: x + Math.random() * 40 - 20, y: y - 50 };
    setHearts((prev) => [...prev, newHeart]);

    // Add emotion mark randomly
    if (Math.random() > 0.5) {
      const emotionType: 'heart' | 'sparkle' = Math.random() > 0.5 ? 'heart' : 'sparkle';
      const newEmotion: Emotion = { 
        id: Date.now() + 1, 
        type: emotionType,
        x: Math.random() * 200 + 50, 
        y: Math.random() * 100 
      };
      setEmotions((prev) => [...prev, newEmotion]);

      setTimeout(() => {
        setEmotions((prev) => prev.filter((e) => e.id !== newEmotion.id));
      }, 1500);
    }

    // Remove heart after animation
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);
  };

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 pt-8 pb-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 z-10"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Manga Drama World
        </h1>
        <p className="text-white/70 text-sm">โลกแห่งตัวละครมังงะสุดคิวท์</p>
      </motion.div>

      {/* Main Character */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        <div 
          className="relative cursor-pointer"
          onClick={handleCharacterClick}
        >
          {/* Speech Bubble */}
          <SpeechBubble 
            text={greetings[currentGreeting]} 
            isVisible={showBubble}
            position="top"
          />

          {/* Emotion marks */}
          <AnimatePresence>
            {emotions.map((emotion) => (
              <EmotionMark
                key={emotion.id}
                type={emotion.type}
                x={emotion.x}
                y={emotion.y}
              />
            ))}
          </AnimatePresence>

          {/* Character Image */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <img
              src="/characters/hero-girl.png"
              alt="Hero Girl"
              className="w-64 h-80 object-contain drop-shadow-2xl"
            />
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-[#e94560]/20 to-transparent rounded-full blur-3xl -z-10"></div>
          </motion.div>

          {/* Floating hearts */}
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -60, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute pointer-events-none"
                style={{ left: heart.x, top: heart.y }}
              >
                <Heart className="w-6 h-6 text-[#e94560] fill-[#e94560]" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Click counter badge */}
          {clickCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-[#e94560] text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-black"
            >
              {clickCount} ❤️
            </motion.div>
          )}
        </div>

        {/* Sparkle decorations */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-4 -left-8"
        >
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-4 -right-8"
        >
          <Sparkles className="w-6 h-6 text-pink-400" />
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 mt-6 z-10"
      >
        <div className="bg-[#16213e]/80 border-2 border-[#e94560] rounded-xl px-4 py-2 text-center">
          <div className="text-xl font-bold text-[#e94560]">{clickCount}</div>
          <div className="text-xs text-white/60">หัวใจที่ได้รับ</div>
        </div>
        <div className="bg-[#16213e]/80 border-2 border-[#533483] rounded-xl px-4 py-2 text-center">
          <div className="text-xl font-bold text-[#533483]">5</div>
          <div className="text-xs text-white/60">ตัวละคร</div>
        </div>
      </motion.div>
    </section>
  );
}
