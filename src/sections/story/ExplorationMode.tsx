import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Footprints, Sparkles, Users, Lock, X, Search, Compass } from 'lucide-react';
import { locations, characterUnlockScenes } from '@/data/storyData';
import { useGameStore } from '@/store/gameStore';
import { MangaCard } from '@/components/manga/MangaCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { VisualNovel } from './VisualNovel';

interface EncounterResult {
  found: boolean;
  characterId?: string;
  message: string;
}

export function ExplorationMode() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [encounter, setEncounter] = useState<EncounterResult | null>(null);
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [explorationCount, setExplorationCount] = useState(0);
  
  const { characters: gameCharacters } = useGameStore();

  const availableLocations = locations.filter(loc => {
    if (!loc.unlockCondition) return true;
    
    const char = gameCharacters.find(c => 
      loc.unlockCondition?.type === 'character' && c.id === loc.unlockCondition.characterId
    );
    const chapterUnlocked = loc.unlockCondition?.type === 'chapter';
    
    return char?.isUnlocked || chapterUnlocked;
  });

  const handleExplore = () => {
    if (!selectedLocation) return;
    
    setIsExploring(true);
    setExplorationCount(prev => prev + 1);
    
    const location = locations.find(l => l.id === selectedLocation);
    if (!location) return;

    // Simulate exploration delay
    setTimeout(() => {
      const roll = Math.random() * 100;
      
      if (roll <= location.encounterChance) {
        // Found a character!
        const availableChars = location.characters.filter(charId => {
          const char = gameCharacters.find(c => c.id === charId);
          return char && !char.isUnlocked;
        });
        
        if (availableChars.length > 0) {
          const foundCharId = availableChars[Math.floor(Math.random() * availableChars.length)];
          const foundChar = gameCharacters.find(c => c.id === foundCharId);
          
          setEncounter({
            found: true,
            characterId: foundCharId,
            message: `คุณพบกับ ${foundChar?.name}!`,
          });
        } else {
          setEncounter({
            found: false,
            message: 'คุณพบสิ่งของที่น่าสนใจ แต่ไม่มีใครอยู่ที่นี่',
          });
        }
      } else {
        setEncounter({
          found: false,
          message: 'คุณสำรวจรอบๆ แต่ไม่พบอะไรเป็นพิเศษ...',
        });
      }
      
      setIsExploring(false);
    }, 2000);
  };

  const handleMeetCharacter = () => {
    if (encounter?.characterId) {
      const sceneId = characterUnlockScenes[encounter.characterId];
      if (sceneId) {
        setActiveScene(sceneId);
      }
    }
    setEncounter(null);
  };

  const handleSceneComplete = () => {
    setActiveScene(null);
    setEncounter(null);
    setSelectedLocation(null);
  };

  if (activeScene) {
    return (
      <VisualNovel
        sceneId={activeScene}
        onComplete={handleSceneComplete}
        onExit={handleSceneComplete}
      />
    );
  }

  return (
    <section className="px-4 py-8 pb-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <Compass className="w-6 h-6 text-[#e94560]" />
        <h2 className="text-xl font-bold text-white">สำรวจ</h2>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <MangaCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#e94560] to-[#533483] rounded-xl flex items-center justify-center">
                <Footprints className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">จำนวนการสำรวจ</h3>
                <p className="text-white/60 text-sm">{explorationCount} ครั้ง</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-[#e94560]" />
                <span className="text-white font-bold">
                  {gameCharacters.filter(c => c.isUnlocked).length}
                </span>
                <span className="text-white/40">/</span>
                <span className="text-white/40">{gameCharacters.length}</span>
              </div>
              <p className="text-xs text-white/40">ตัวละครที่พบ</p>
            </div>
          </div>
        </MangaCard>
      </motion.div>

      {/* Location Selection */}
      {!selectedLocation ? (
        <div className="space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#e94560]" />
            เลือกสถานที่
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {locations.map((location, index) => {
              const isLocked = !availableLocations.find(l => l.id === location.id);
              const availableChars = location.characters.filter(charId => {
                const char = gameCharacters.find(c => c.id === charId);
                return char && !char.isUnlocked;
              });
              
              return (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MangaCard
                    className={`p-3 h-full ${isLocked ? 'opacity-50' : 'cursor-pointer'}`}
                    onClick={() => !isLocked && setSelectedLocation(location.id)}
                    hoverEffect={!isLocked}
                  >
                    <div 
                      className="h-24 rounded-lg mb-3 flex items-center justify-center"
                      style={{ background: location.background }}
                    >
                      {isLocked ? (
                        <Lock className="w-8 h-8 text-white/50" />
                      ) : (
                        <Search className="w-8 h-8 text-white/80" />
                      )}
                    </div>
                    
                    <h4 className="font-bold text-white text-sm mb-1">{location.name}</h4>
                    <p className="text-white/60 text-xs line-clamp-2">{location.description}</p>
                    
                    {!isLocked && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-[#e94560]">
                          {location.encounterChance}% พบตัวละคร
                        </span>
                        {availableChars.length > 0 && (
                          <span className="text-xs bg-[#e94560]/20 text-[#e94560] px-2 py-0.5 rounded-full">
                            {availableChars.length} คน
                          </span>
                        )}
                      </div>
                    )}
                  </MangaCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Exploration View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedLocation(null)}
              className="border-2 border-white/20"
            >
              <X className="w-4 h-4 mr-1" />
              ย้อนกลับ
            </Button>
            
            <span className="text-white font-bold">
              {locations.find(l => l.id === selectedLocation)?.name}
            </span>
          </div>

          <motion.div
            className="h-64 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{ background: locations.find(l => l.id === selectedLocation)?.background }}
          >
            {/* Animated background elements */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
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
            
            {isExploring ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-16 h-16 text-white" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <Footprints className="w-16 h-16 text-white/80 mx-auto mb-4" />
                <p className="text-white font-bold">พร้อมสำรวจ?</p>
              </motion.div>
            )}
          </motion.div>

          {!isExploring && !encounter && (
            <Button
              onClick={handleExplore}
              className="w-full btn-manga py-6 text-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              เริ่มสำรวจ!
            </Button>
          )}
        </motion.div>
      )}

      {/* Encounter Dialog */}
      <Dialog open={!!encounter} onOpenChange={() => setEncounter(null)}>
        <DialogContent className="bg-[#1a1a2e] border-2 border-[#e94560] max-w-sm">
          <AnimatePresence>
            {encounter && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6"
              >
                {encounter.found && encounter.characterId ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="text-6xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <h3 className="text-2xl font-bold gradient-text mb-2">
                      พบตัวละคร!
                    </h3>
                    <img
                      src={gameCharacters.find(c => c.id === encounter.characterId)?.portrait}
                      alt="Character"
                      className="w-32 h-40 object-contain mx-auto my-4"
                    />
                    <p className="text-white font-bold text-lg">
                      {gameCharacters.find(c => c.id === encounter.characterId)?.name}
                    </p>
                    <p className="text-white/60 text-sm mb-4">
                      {gameCharacters.find(c => c.id === encounter.characterId)?.role}
                    </p>
                    <Button onClick={handleMeetCharacter} className="btn-manga">
                      ทักทาย
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      สำรวจเสร็จสิ้น
                    </h3>
                    <p className="text-white/60 mb-4">{encounter.message}</p>
                    <Button 
                      onClick={() => setEncounter(null)} 
                      variant="outline"
                      className="border-2 border-white/20"
                    >
                      สำรวจต่อ
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
}
