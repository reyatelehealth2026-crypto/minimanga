import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lock, CheckCircle, ChevronRight, Heart, Star } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { MangaCard } from '@/components/manga/MangaCard';
import { Button } from '@/components/ui/button';
import { VisualNovel } from './VisualNovel';

export function StoryMode() {
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const { chapters: gameChapters, progress, getAffection, characters } = useGameStore();

  const handleStartScene = (sceneId: string) => {
    setActiveScene(sceneId);
  };

  const handleSceneComplete = () => {
    setActiveScene(null);
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
        <BookOpen className="w-6 h-6 text-[#e94560]" />
        <h2 className="text-xl font-bold text-white">โหมดเนื้อเรื่อง</h2>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <MangaCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white mb-1">ความคืบหน้า</h3>
              <p className="text-white/60 text-sm">
                บทที่เสร็จแล้ว: {progress.completedChapters.length} / {gameChapters.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text">
                {Math.round((progress.completedChapters.length / gameChapters.length) * 100)}%
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress.completedChapters.length / gameChapters.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#e94560] to-[#533483]"
            />
          </div>
        </MangaCard>
      </motion.div>

      {/* Affection Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#e94560]" />
          ความสัมพันธ์
        </h3>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {characters.filter(c => c.isUnlocked).map((char) => {
            const affection = getAffection(char.id);
            const level = Math.floor(affection / 10) + 1;
            
            return (
              <motion.div
                key={char.id}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 bg-[#16213e] border-2 border-[#e94560]/50 rounded-xl p-3 min-w-[100px]"
              >
                <img
                  src={char.portrait}
                  alt={char.name}
                  className="w-12 h-16 object-contain mx-auto mb-2"
                />
                <p className="text-white text-xs text-center font-bold">{char.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Heart className="w-3 h-3 text-[#e94560]" />
                  <span className="text-[#e94560] text-xs font-bold">Lv.{level}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Chapters List */}
      <div className="space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          เลือกบท
        </h3>
        
        {gameChapters.map((chapter, index) => {
          const isCompleted = progress.completedChapters.includes(chapter.id);
          const isLocked = chapter.isLocked;
          const firstSceneId = chapter.scenes[0];
          
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MangaCard 
                className={`p-4 ${isLocked ? 'opacity-60' : ''}`}
                hoverEffect={!isLocked}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-[#e94560]/30 to-[#533483]/30 flex-shrink-0">
                    <img
                      src={chapter.thumbnail}
                      alt={chapter.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isCompleted && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {isLocked && (
                        <Lock className="w-4 h-4 text-white/40" />
                      )}
                      <h4 className="font-bold text-white">{chapter.title}</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-2">{chapter.description}</p>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>{chapter.scenes.length} ฉาก</span>
                      {chapter.unlockCondition && isLocked && (
                        <span className="text-[#e94560]">
                          (ต้องปลดล็อกก่อน)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action */}
                  {!isLocked && (
                    <Button
                      onClick={() => handleStartScene(firstSceneId)}
                      className="btn-manga flex-shrink-0"
                    >
                      {isCompleted ? 'เล่นอีกครั้ง' : 'เริ่ม'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </MangaCard>
            </motion.div>
          );
        })}
      </div>

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-[#16213e]/50 rounded-xl border border-dashed border-white/20"
      >
        <p className="text-white/60 text-sm text-center">
          💡 เลือกตัวเลือกต่างๆ ในเนื้อเรื่องเพื่อเพิ่มความสัมพันธ์กับตัวละคร
          <br />
          และปลดล็อกตัวละครใหม่!
        </p>
      </motion.div>
    </section>
  );
}
