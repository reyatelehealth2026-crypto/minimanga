import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { useDynamicEventStore } from '@/store/events/dynamicEventStore';
import { Sparkles, Loader2 } from 'lucide-react';

// Lazy loading the sections to improve initial load time (Code Splitting)
const HeroSection = lazy(() => import('@/sections/HeroSection').then(module => ({ default: module.HeroSection })));
const MiniGames = lazy(() => import('@/sections/MiniGames').then(module => ({ default: module.MiniGames })));
const StoryMode = lazy(() => import('@/sections/story/StoryMode').then(module => ({ default: module.StoryMode })));
const CharacterCollection = lazy(() => import('@/sections/story/CharacterCollection').then(module => ({ default: module.CharacterCollection })));
const CharacterGallery = lazy(() => import('@/sections/CharacterGallery').then(module => ({ default: module.CharacterGallery })));
const EventsPage = lazy(() => import('@/sections/EventsPage').then(module => ({ default: module.EventsPage })));
const RewardsSection = lazy(() => import('@/sections/RewardsSection').then(module => ({ default: module.RewardsSection })));

// New RPG Module (Sprint 1)
const RpgAppModule = lazy(() => import('@/features/rpg/RpgAppModule').then(module => ({ default: module.RpgAppModule })));

// Loading screen for Initial App Load
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#16213e] z-50 flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 1, repeat: Infinity }}
        className="relative"
      >
        <img
          src="/characters/hero-girl.png"
          alt="Loading"
          className="w-40 h-52 object-contain"
          onError={(e) => {
             // Fallback if image doesn't exist
             e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Sparkle effects */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        ))}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold gradient-text mt-6"
      >
        Manga Drama World
      </motion.h1>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="h-1 bg-gradient-to-r from-[#e94560] to-[#533483] rounded-full mt-4"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/60 text-sm mt-4"
      >
        กำลังโหลดโลกแห่งมังงะ...
      </motion.p>
    </motion.div>
  );
}

// Fallback loader during Lazy module fetching
function FallbackLoader() {
  return (
    <div className="flex justify-center items-center h-64 w-full">
      <Loader2 className="w-8 h-8 animate-spin text-[#e94560]" />
    </div>
  );
}

// Page Views Wrappers
const ViewWrapper = ({ children, padding = false }: { children: React.ReactNode, padding?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
    className={padding ? "pt-8" : ""}
  >
    {children}
  </motion.div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { initializeEvents, hasUncompletedEvents } = useDynamicEventStore();

  // Initialize events when app loads
  useEffect(() => {
    if (!isLoading) {
      initializeEvents();
    }
  }, [isLoading, initializeEvents]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen pb-20">
          {/* Background stars */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content with Routing & Suspense */}
          <main className="relative z-10 max-w-md mx-auto">
            <AnimatePresence mode="wait">
              <Suspense fallback={<FallbackLoader />}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                    <ViewWrapper>
                      <HeroSection />
                      <MiniGames />
                    </ViewWrapper>
                  } />
                  <Route path="/story" element={
                    <ViewWrapper padding>
                      <StoryMode />
                    </ViewWrapper>
                  } />
                  <Route path="/explore" element={
                    <ViewWrapper>
                      <RpgAppModule />
                    </ViewWrapper>
                  } />
                  <Route path="/collection" element={
                    <ViewWrapper padding>
                      <CharacterCollection />
                    </ViewWrapper>
                  } />
                  <Route path="/events" element={
                    <ViewWrapper padding>
                      <EventsPage />
                    </ViewWrapper>
                  } />
                  <Route path="/characters" element={
                    <ViewWrapper padding>
                      <CharacterGallery />
                    </ViewWrapper>
                  } />
                  <Route path="/games" element={
                    <ViewWrapper padding>
                      <MiniGames />
                    </ViewWrapper>
                  } />
                  <Route path="/rewards" element={
                    <ViewWrapper padding>
                      <RewardsSection />
                    </ViewWrapper>
                  } />
                  {/* Fallback route */}
                  <Route path="*" element={
                    <ViewWrapper>
                      <HeroSection />
                      <MiniGames />
                    </ViewWrapper>
                  } />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>

          {/* Bottom Navigation */}
          <BottomNav hasEventNotification={hasUncompletedEvents()} />
        </div>
      )}
    </>
  );
}

export default App;