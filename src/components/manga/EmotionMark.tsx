import { motion } from 'framer-motion';

interface EmotionMarkProps {
  type: 'sweat' | 'exclamation' | 'heart' | 'sparkle' | 'anger';
  x: number;
  y: number;
}

export function EmotionMark({ type, x, y }: EmotionMarkProps) {
  const renderMark = () => {
    switch (type) {
      case 'sweat':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C10 2 6 8 6 12C6 15.314 7.686 18 10 18C12.314 18 14 15.314 14 12C14 8 10 2 10 2Z" fill="#4FC3F7" stroke="#000" strokeWidth="1.5"/>
          </svg>
        );
      case 'exclamation':
        return (
          <div className="flex flex-col items-center">
            <div className="w-1.5 h-6 bg-yellow-400 border-2 border-black rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-yellow-400 border-2 border-black rounded-full mt-0.5"></div>
          </div>
        );
      case 'heart':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#e94560" stroke="#000" strokeWidth="1.5"/>
          </svg>
        );
      case 'sparkle':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" fill="#FFD700" stroke="#000" strokeWidth="1"/>
          </svg>
        );
      case 'anger':
        return (
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-red-500 transform -rotate-12"></div>
            <div className="w-0.5 h-4 bg-red-500 transform rotate-12"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      {renderMark()}
    </motion.div>
  );
}
