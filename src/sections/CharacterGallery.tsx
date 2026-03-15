import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { MangaCard } from '@/components/manga/MangaCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Character {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  personality: string;
  likes: number;
  color: string;
}

const characters: Character[] = [
  {
    id: 1,
    name: 'ซากุระ',
    role: 'นางเอก',
    image: '/characters/hero-girl.png',
    description: 'สาวน้อยผู้ร่าเริงและเต็มไปด้วยพลังบวก เธอชอบช่วยเหลือผู้อื่นและมักจะยิ้มให้กับทุกคนเสมอ',
    personality: 'ร่าเริง, ใจดี, ซื่อสัตย์',
    likes: 128,
    color: '#e94560',
  },
  {
    id: 2,
    name: 'ไรโตะ',
    role: 'พระเอก',
    image: '/characters/cool-boy.png',
    description: 'หนุ่มเท่ที่ดูเย็นชาแต่จริงๆ แล้วใจดี เขาชอบช่วยเหลือผู้อื่นแบบไม่เปิดเผยตัว',
    personality: 'เท่, ใจดี, ลึกลับ',
    likes: 96,
    color: '#2196F3',
  },
  {
    id: 3,
    name: 'ลูน่า',
    role: 'หมอดู',
    image: '/characters/fortune-girl.png',
    description: 'หมอดูสาวลึกลับที่สามารถมองเห็นอนาคตได้ เธอชอบให้คำแนะนำที่เป็นประโยชน์',
    personality: 'ลึกลับ, ฉลาด, เมตตา',
    likes: 84,
    color: '#9C27B0',
  },
  {
    id: 4,
    name: 'ฮินาตะ',
    role: 'นักกีฬา',
    image: '/characters/sporty-girl.png',
    description: 'สาวน้อยนักกีฬาที่เต็มไปด้วยพลังงาน เธอไม่เคยยอมแพ้และมักจะสร้างแรงบันดาลใจให้ผู้อื่น',
    personality: 'กระตือรือร้น, ขยัน, มุ่งมั่น',
    likes: 72,
    color: '#FF9800',
  },
  {
    id: 5,
    name: 'ยูกิ',
    role: 'นักอ่าน',
    image: '/characters/shy-girl.png',
    description: 'สาวน้อยขี้อายที่รักการอ่านหนังสือ เธอมีโลกส่วนตัวที่สวยงามและเต็มไปด้วยจินตนาการ',
    personality: 'ขี้อาย, อ่อนโยน, ฉลาด',
    likes: 65,
    color: '#E0E0E0',
  },
];

export function CharacterGallery() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [likedCharacters, setLikedCharacters] = useState<Set<number>>(new Set());

  const handleLike = (e: React.MouseEvent, characterId: number) => {
    e.stopPropagation();
    setLikedCharacters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(characterId)) {
        newSet.delete(characterId);
      } else {
        newSet.add(characterId);
      }
      return newSet;
    });
  };

  return (
    <section className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-6"
      >
        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        <h2 className="text-xl font-bold text-white">ตัวละครทั้งหมด</h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {characters.map((character, index) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <MangaCard
              className="p-3 cursor-pointer h-full"
              onClick={() => setSelectedCharacter(character)}
            >
              <div className="relative">
                {/* Character Image */}
                <div 
                  className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-3"
                  style={{ background: `linear-gradient(135deg, ${character.color}20 0%, ${character.color}40 100%)` }}
                >
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Like button */}
                <button
                  onClick={(e) => handleLike(e, character.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform active:scale-90"
                >
                  <Heart 
                    className={`w-4 h-4 ${likedCharacters.has(character.id) ? 'text-[#e94560] fill-[#e94560]' : 'text-white'}`}
                  />
                </button>

                {/* Role badge */}
                <div 
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-black"
                  style={{ background: character.color }}
                >
                  {character.role}
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-bold text-white text-sm mb-1">{character.name}</h3>
                <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                  <Heart className="w-3 h-3 text-[#e94560]" />
                  <span>{character.likes + (likedCharacters.has(character.id) ? 1 : 0)}</span>
                </div>
              </div>
            </MangaCard>
          </motion.div>
        ))}
      </div>

      {/* Character Detail Dialog */}
      <Dialog open={!!selectedCharacter} onOpenChange={() => setSelectedCharacter(null)}>
        <DialogContent className="bg-[#1a1a2e] border-2 border-[#e94560] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-white">
              {selectedCharacter?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCharacter && (
            <div className="space-y-4">
              <div 
                className="w-full aspect-square rounded-xl overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${selectedCharacter.color}30 0%, ${selectedCharacter.color}50 100%)` }}
              >
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-black"
                    style={{ background: selectedCharacter.color }}
                  >
                    {selectedCharacter.role}
                  </span>
                  <span className="text-white/60 text-sm">{selectedCharacter.personality}</span>
                </div>

                <p className="text-white/80 text-sm leading-relaxed">
                  {selectedCharacter.description}
                </p>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <Heart className="w-5 h-5 text-[#e94560] fill-[#e94560]" />
                  <span className="text-white font-bold">
                    {selectedCharacter.likes + (likedCharacters.has(selectedCharacter.id) ? 1 : 0)} คนถูกใจ
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
