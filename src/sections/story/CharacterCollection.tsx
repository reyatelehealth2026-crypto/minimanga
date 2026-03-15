import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, Lock, Star, Info, Gift, Search, X } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { MangaCard } from '@/components/manga/MangaCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

export function CharacterCollection() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const { characters: gameCharacters, getAffection, getAffectionLevel } = useGameStore();

  const filteredCharacters = gameCharacters.filter(char => {
    if (filter === 'unlocked') return char.isUnlocked;
    if (filter === 'locked') return !char.isUnlocked;
    return true;
  });

  const unlockedCount = gameCharacters.filter(c => c.isUnlocked).length;
  const totalCount = gameCharacters.length;
  const secretCount = gameCharacters.filter(c => c.isSecret && !c.isUnlocked).length;

  const selectedCharData = gameCharacters.find(c => c.id === selectedCharacter);
  const affection = selectedCharData ? getAffection(selectedCharData.id) : 0;
  const affectionLevel = selectedCharData ? getAffectionLevel(selectedCharData.id) : 1;

  const getAffectionTitle = (level: number) => {
    if (level >= 10) return 'คู่รัก';
    if (level >= 8) return 'สนิทสนม';
    if (level >= 6) return 'เพื่อนซี้';
    if (level >= 4) return 'เพื่อน';
    if (level >= 2) return 'รู้จัก';
    return 'คนแปลกหน้า';
  };

  const getAffectionColor = (level: number) => {
    if (level >= 10) return '#FF1493';
    if (level >= 8) return '#e94560';
    if (level >= 6) return '#FF6B6B';
    if (level >= 4) return '#FFA500';
    if (level >= 2) return '#FFD700';
    return '#808080';
  };

  return (
    <section className="px-4 py-8 pb-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <Users className="w-6 h-6 text-[#e94560]" />
        <h2 className="text-xl font-bold text-white">คอลเลกชันตัวละคร</h2>
      </motion.div>

      {/* Collection Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <MangaCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-white">ความคืบหน้า</h3>
              <p className="text-white/60 text-sm">
                {unlockedCount} / {totalCount} ตัวละคร
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text">
                {Math.round((unlockedCount / totalCount) * 100)}%
              </div>
            </div>
          </div>
          
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#e94560] to-[#533483]"
            />
          </div>
          
          {secretCount > 0 && (
            <p className="text-white/40 text-xs mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              ยังมีตัวละครลับอีก {secretCount} ตัว
            </p>
          )}
        </MangaCard>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-4"
      >
        {(['all', 'unlocked', 'locked'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f
                ? 'bg-[#e94560] text-white'
                : 'bg-[#16213e] text-white/60 hover:bg-[#16213e]/80'
            }`}
          >
            {f === 'all' && 'ทั้งหมด'}
            {f === 'unlocked' && 'ที่พบแล้ว'}
            {f === 'locked' && 'ที่ยังไม่พบ'}
          </button>
        ))}
      </motion.div>

      {/* Character Grid */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredCharacters.map((character, index) => (
            <motion.div
              key={character.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
            >
              <MangaCard
                className={`p-3 cursor-pointer ${!character.isUnlocked ? 'opacity-60' : ''}`}
                onClick={() => character.isUnlocked && setSelectedCharacter(character.id)}
                hoverEffect={character.isUnlocked}
              >
                <div 
                  className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative"
                  style={{ 
                    background: character.isUnlocked 
                      ? 'linear-gradient(135deg, #e9456020 0%, #53348340 100%)'
                      : 'linear-gradient(135deg, #333 0%, #222 100%)'
                  }}
                >
                  {character.isUnlocked ? (
                    <img
                      src={character.portrait}
                      alt={character.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                  
                  {/* Affection indicator */}
                  {character.isUnlocked && !character.isSecret && (
                    <div 
                      className="absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: getAffectionColor(getAffectionLevel(character.id)) }}
                    >
                      {getAffectionLevel(character.id)}
                    </div>
                  )}
                  
                  {/* Secret badge */}
                  {character.isSecret && character.isUnlocked && (
                    <div className="absolute top-1 left-1 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                      ลับ
                    </div>
                  )}
                </div>
                
                <p className="text-white text-xs font-bold text-center truncate">
                  {character.isUnlocked ? character.name : '???'}
                </p>
                <p className="text-white/40 text-xs text-center">
                  {character.isUnlocked ? character.role : '???'}
                </p>
              </MangaCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-[#16213e]/50 rounded-xl border border-dashed border-white/20"
      >
        <p className="text-white/60 text-sm text-center">
          <Search className="w-4 h-4 inline mr-1" />
          ไปที่โหมด "สำรวจ" เพื่อพบตัวละครใหม่
          <br />
          <Heart className="w-4 h-4 inline mr-1 text-[#e94560]" />
          เล่นเนื้อเรื่องและเลือกตัวเลือกที่ถูกใจเพื่อเพิ่มความสัมพันธ์
        </p>
      </motion.div>

      {/* Character Detail Dialog */}
      <Dialog open={!!selectedCharacter} onOpenChange={() => setSelectedCharacter(null)}>
        <DialogContent className="bg-[#1a1a2e] border-2 border-[#e94560] max-w-sm max-h-[80vh] overflow-y-auto">
          {selectedCharData && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-white">
                  {selectedCharData.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Portrait */}
                <div 
                  className="w-full aspect-square rounded-xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #e9456030 0%, #53348350 100%)' }}
                >
                  <img
                    src={selectedCharData.portrait}
                    alt={selectedCharData.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Basic Info */}
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-sm font-bold text-black bg-[#e94560]">
                    {selectedCharData.role}
                  </span>
                  {selectedCharData.isSecret && (
                    <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-purple-500">
                      ตัวละครลับ
                    </span>
                  )}
                </div>

                {/* Affection Section */}
                {!selectedCharData.isSecret && (
                  <div className="bg-[#16213e] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">ความสัมพันธ์</span>
                      <span 
                        className="font-bold"
                        style={{ color: getAffectionColor(affectionLevel) }}
                      >
                        {getAffectionTitle(affectionLevel)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-[#e94560]" />
                      <span className="text-white font-bold">Lv. {affectionLevel}</span>
                      <span className="text-white/40 text-sm">({affection}/100)</span>
                    </div>
                    
                    <Progress 
                      value={affection} 
                      className="h-2"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-white/60 text-sm mb-2 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    ประวัติ
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {selectedCharData.description}
                  </p>
                </div>

                {/* Personality */}
                <div>
                  <h4 className="text-white/60 text-sm mb-2">บุคลิก</h4>
                  <p className="text-white/80 text-sm">{selectedCharData.personality}</p>
                </div>

                {/* Likes/Dislikes */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-green-400 text-sm mb-2 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      ชอบ
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCharData.likes.map((like, i) => (
                        <span key={i} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          {like}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-red-400 text-sm mb-2 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      ไม่ชอบ
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCharData.dislikes.map((dislike, i) => (
                        <span key={i} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                          {dislike}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rewards hint */}
                {affectionLevel >= 5 && (
                  <div className="bg-gradient-to-r from-[#e94560]/20 to-[#533483]/20 rounded-xl p-3 flex items-center gap-3">
                    <Gift className="w-8 h-8 text-[#e94560]" />
                    <div>
                      <p className="text-white font-bold text-sm">รางวัลพิเศษ!</p>
                      <p className="text-white/60 text-xs">ความสัมพันธ์ระดับสูงปลดล็อกเนื้อเรื่องพิเศษ</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
