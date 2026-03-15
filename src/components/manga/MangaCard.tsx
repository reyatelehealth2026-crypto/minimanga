import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MangaCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function MangaCard({ children, className = '', onClick, hoverEffect = true }: MangaCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`manga-panel ${className}`}
    >
      {children}
    </motion.div>
  );
}
