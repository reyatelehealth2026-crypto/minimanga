import { motion } from 'framer-motion';

interface SpeechBubbleProps {
  text: string;
  isVisible: boolean;
  position?: 'top' | 'bottom';
}

export function SpeechBubble({ text, isVisible, position = 'top' }: SpeechBubbleProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: position === 'top' ? 20 : -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className={`absolute ${position === 'top' ? '-top-20' : '-bottom-24'} left-1/2 -translate-x-1/2 z-20 w-48`}
    >
      <div className="speech-bubble text-sm text-center">
        {text}
      </div>
    </motion.div>
  );
}
