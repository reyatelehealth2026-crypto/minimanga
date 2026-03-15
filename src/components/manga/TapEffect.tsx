import { motion } from 'framer-motion';

interface TapEffectProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export function TapEffect({ x, y, onComplete }: TapEffectProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="absolute pointer-events-none z-50"
      style={{ left: x - 25, top: y - 25 }}
    >
      <div className="w-12 h-12 rounded-full border-4 border-[#e94560] bg-[#e94560]/20"></div>
    </motion.div>
  );
}
