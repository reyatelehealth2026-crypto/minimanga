import { useGameStore } from './store/useGameStore';
import { WorldBuilderForm } from './components/world/WorldBuilderForm';
import { StatBar } from './components/ui/StatBar';
import { NarrativeView } from './components/chat/NarrativeView';
import { ChatInput } from './components/chat/ChatInput';
import { DiceRoller } from './components/dice/DiceRoller';
import { motion, AnimatePresence } from 'framer-motion';

export function RpgAppModule() {
  const { isWorldCreated, currentLocationImage } = useGameStore();

  return (
    <div className="min-h-screen bg-[#090A0F] relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!isWorldCreated ? (
          <motion.div
            key="world-builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorldBuilderForm />
          </motion.div>
        ) : (
          <motion.div
            key="game-hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            {/* Background Image / Effects for Game Hub */}
            <div className="fixed inset-0 pointer-events-none z-0">
               {currentLocationImage ? (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 0.3 }} 
                   className="absolute inset-0 bg-cover bg-center"
                   style={{ backgroundImage: `url(${currentLocationImage})` }}
                 />
               ) : (
                 <>
                   <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-900/10 to-transparent" />
                   <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-red-900/10 to-transparent" />
                 </>
               )}
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10">
              <StatBar />
              <NarrativeView />
              <DiceRoller />
              <ChatInput />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}