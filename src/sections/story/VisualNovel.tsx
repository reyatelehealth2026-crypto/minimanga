import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, Heart, MessageCircle, ChevronRight, X, BookOpen } from 'lucide-react';
import { scenes, type DialogueChoice } from '@/data/storyData';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface VisualNovelProps {
  sceneId: string;
  onComplete: () => void;
  onExit: () => void;
}

// Inner component that handles a single scene
function VisualNovelScene({ 
  sceneId, 
  onComplete, 
  onExit, 
  onSceneChange 
}: VisualNovelProps & { onSceneChange: (newSceneId: string) => void }) {
  const scene = scenes[sceneId];
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUnlock, setShowUnlock] = useState<string | null>(null);
  
  const { 
    characters, 
    updateAffection, 
    completeScene, 
    setCurrentScene,
    unlockCharacter,
  } = useGameStore();

  const currentDialogue = scene?.dialogues[currentDialogueIndex];
  const currentCharacter = currentDialogue?.characterId 
    ? characters.find(c => c.id === currentDialogue.characterId)
    : null;

  // Typewriter effect
  useEffect(() => {
    if (!currentDialogue) return;
    
    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const text = currentDialogue.text;
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
        
        // Show choices if available
        if (currentDialogue.choices && currentDialogue.choices.length > 0) {
          setShowChoices(true);
        }
        
        // Check for character unlock
        if (currentDialogue.unlockCharacter) {
          setShowUnlock(currentDialogue.unlockCharacter);
          unlockCharacter(currentDialogue.unlockCharacter);
        }
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentDialogue, unlockCharacter]);

  // Set current scene when mounted
  useEffect(() => {
    setCurrentScene(sceneId);
  }, [sceneId, setCurrentScene]);

  const handleNext = useCallback(() => {
    if (isTyping) {
      // Skip typing
      setDisplayedText(currentDialogue?.text || '');
      setIsTyping(false);
      return;
    }

    if (showChoices) return;

    if (currentDialogueIndex < (scene?.dialogues.length || 0) - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      // Scene complete
      completeScene(sceneId);
      onComplete();
    }
  }, [isTyping, currentDialogue, currentDialogueIndex, scene, showChoices, completeScene, sceneId, onComplete]);

  const handleChoice = useCallback((choice: DialogueChoice) => {
    // Apply affection change
    if (choice.affectionChange) {
      updateAffection(choice.affectionChange.characterId, choice.affectionChange.amount);
    }
    
    setShowChoices(false);
    
    // Navigate to next scene if different
    if (choice.nextSceneId && choice.nextSceneId !== sceneId) {
      completeScene(sceneId);
      // Use the onSceneChange callback instead of window.location
      onSceneChange(choice.nextSceneId);
    } else if (currentDialogueIndex < (scene?.dialogues.length || 0) - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      completeScene(sceneId);
      onComplete();
    }
  }, [currentDialogueIndex, scene, sceneId, updateAffection, completeScene, onComplete, onSceneChange]);

  const handleSkip = () => {
    completeScene(sceneId);
    onComplete();
  };

  if (!scene) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1a1a2e]">
        <div className="text-center">
          <p className="text-white mb-4">ไม่พบฉากนี้</p>
          <Button onClick={onExit} variant="outline" className="border-2 border-white/20">
            <X className="w-4 h-4 mr-2" />
            กลับ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: currentDialogue?.background || scene.background }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-white/60" />
          <span className="text-white/80 text-sm">{scene.title}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSkip}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <SkipForward className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={onExit}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Character Display */}
      <div className="flex-1 relative flex items-end justify-center pb-32">
        <AnimatePresence mode="wait">
          {currentCharacter && (
            <motion.div
              key={currentCharacter.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={currentCharacter.portrait}
                alt={currentCharacter.name}
                className="h-96 object-contain drop-shadow-2xl"
              />
              
              {/* Emotion indicator */}
              {currentDialogue?.emotion && currentDialogue.emotion !== 'normal' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -right-4"
                >
                  {currentDialogue.emotion === 'happy' && <span className="text-4xl">✨</span>}
                  {currentDialogue.emotion === 'sad' && <span className="text-4xl">💧</span>}
                  {currentDialogue.emotion === 'angry' && <span className="text-4xl">💢</span>}
                  {currentDialogue.emotion === 'surprised' && <span className="text-4xl">😲</span>}
                  {currentDialogue.emotion === 'blush' && <span className="text-4xl">💕</span>}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dialogue Box */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-black/80 backdrop-blur-md border-2 border-[#e94560] rounded-2xl p-6 max-w-2xl mx-auto"
        >
          {/* Character Name */}
          {currentCharacter && (
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="px-3 py-1 rounded-full text-sm font-bold text-black"
                style={{ background: '#e94560' }}
              >
                {currentCharacter.name}
              </div>
            </div>
          )}
          
          {/* Dialogue Text */}
          <p className="text-white text-lg leading-relaxed min-h-[60px]">
            {displayedText}
            {isTyping && <span className="animate-pulse">▊</span>}
          </p>

          {/* Continue indicator */}
          {!isTyping && !showChoices && (
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex justify-end mt-2"
            >
              <ChevronRight className="w-6 h-6 text-[#e94560]" />
            </motion.div>
          )}
        </motion.div>

        {/* Choices */}
        <AnimatePresence>
          {showChoices && currentDialogue?.choices && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4 space-y-2 max-w-2xl mx-auto"
            >
              {currentDialogue.choices.map((choice, index) => (
                <Button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full btn-manga justify-start text-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{choice.text}</span>
                  {choice.affectionChange && (
                    <span className="ml-auto text-xs flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {choice.affectionChange.amount > 0 ? '+' : ''}{choice.affectionChange.amount}
                    </span>
                  )}
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click to continue overlay */}
      {!showChoices && (
        <div 
          className="absolute inset-0 z-10"
          onClick={handleNext}
          style={{ cursor: isTyping ? 'pointer' : 'default' }}
        />
      )}

      {/* Character Unlock Dialog */}
      <Dialog open={!!showUnlock} onOpenChange={() => setShowUnlock(null)}>
        <DialogContent className="bg-[#1a1a2e] border-2 border-[#e94560] max-w-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold gradient-text mb-2">
              ปลดล็อกตัวละครใหม่!
            </h3>
            {showUnlock && (
              <>
                <img
                  src={characters.find(c => c.id === showUnlock)?.portrait}
                  alt="New Character"
                  className="w-32 h-40 object-contain mx-auto my-4"
                />
                <p className="text-white font-bold text-lg">
                  {characters.find(c => c.id === showUnlock)?.name}
                </p>
                <p className="text-white/60 text-sm mt-1">
                  {characters.find(c => c.id === showUnlock)?.role}
                </p>
              </>
            )}
            <Button 
              onClick={() => setShowUnlock(null)}
              className="mt-6 btn-manga"
            >
              ยอดเยี่ยม!
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main wrapper component that handles scene transitions
export function VisualNovel({ sceneId, onComplete, onExit }: VisualNovelProps) {
  const [currentSceneId, setCurrentSceneId] = useState(sceneId);

  const handleSceneChange = useCallback((newSceneId: string) => {
    setCurrentSceneId(newSceneId);
  }, []);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <VisualNovelScene
      key={currentSceneId}
      sceneId={currentSceneId}
      onComplete={handleComplete}
      onExit={onExit}
      onSceneChange={handleSceneChange}
    />
  );
}
