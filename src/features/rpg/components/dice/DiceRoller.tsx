import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Dices, Sparkles } from 'lucide-react';

export function DiceRoller() {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const { addMessage, processGameLogic, pendingChoice } = useGameStore();

  const handleRoll = () => {
    if (isRolling) return;
    if (!pendingChoice) {
      alert("กรุณาเลือกเส้นทางก่อนทอยเต๋าครับ!");
      return;
    }

    setIsRolling(true);
    setResult(null);

    // Simulate 3D roll duration
    setTimeout(() => {
      const finalValue = Math.floor(Math.random() * 20) + 1;
      setResult(finalValue);
      setIsRolling(false);

      // Add to chat history
      addMessage({
        role: 'system',
        content: `🎲 คุณทอยเต๋าได้แต้ม: ${finalValue} (${finalValue >= 15 ? 'Critical Success!' : finalValue >= 7 ? 'Success' : 'Fail'})`
      });

      // 🤖 Trigger AI Game Master to respond to the roll
      processGameLogic('dice_roll', finalValue);
    }, 1500);
  };

  return (
    <div className={`fixed bottom-24 left-0 right-0 z-30 px-4 transition-all duration-500 ${pendingChoice ? 'scale-110 opacity-100' : 'scale-90 opacity-50 pointer-events-none'}`}>
      <div className="max-w-md mx-auto flex justify-center">
        <div className="relative group">
          
          {/* Roll Button / Display */}
          <motion.button
            onClick={handleRoll}
            disabled={isRolling || !pendingChoice}
            whileTap={{ scale: 0.9 }}
            className={`
              relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden
              bg-gradient-to-br from-[#161821] to-[#090A0F] border border-white/10
              shadow-[0_0_20px_rgba(123,44,191,0.3)] group-hover:border-purple-500/50 transition-colors
              ${pendingChoice ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#090A0F] animate-pulse' : ''}
            `}
          >
            {/* Background Glow */}
            <AnimatePresence>
              {(isRolling || result) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 opacity-20 ${
                    result && result >= 15 ? 'bg-blue-400' : result && result <= 5 ? 'bg-red-500' : 'bg-purple-500'
                  }`}
                />
              )}
            </AnimatePresence>

            {/* Content */}
            <AnimatePresence mode="wait">
              {isRolling ? (
                <motion.div
                  key="rolling"
                  animate={{ 
                    rotateX: [0, 360, 720], 
                    rotateY: [0, 180, 540],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Dices className="w-8 h-8 text-purple-400" />
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-2xl font-black font-mono ${
                    result >= 15 ? 'text-blue-400' : result <= 5 ? 'text-red-500' : 'text-white'
                  }`}
                >
                  {result}
                </motion.div>
              ) : (
                <motion.div key="idle" className="flex flex-col items-center">
                  <Dices className="w-6 h-6 text-slate-500 group-hover:text-purple-400" />
                  <span className="text-[8px] text-slate-600 font-bold uppercase mt-1">Roll</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sparkle effect on Critical */}
            {result && result >= 15 && (
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial="initial" animate="animate"
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.button>

          {/* Label Tooltip */}
          {!isRolling && !result && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              ทอยเต๋า D20 เพื่อตัดสินโชค
            </div>
          )}
        </div>
      </div>
    </div>
  );
}