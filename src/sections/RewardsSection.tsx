import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star, Clock, Check, Sparkles } from 'lucide-react';
import { MangaCard } from '@/components/manga/MangaCard';
import { Button } from '@/components/ui/button';

interface Reward {
  id: number;
  name: string;
  description: string;
  icon: string;
  claimed: boolean;
  type: 'daily' | 'special';
}

export function RewardsSection() {
  const [rewards, setRewards] = useState<Reward[]>([
    { id: 1, name: 'รางวัลประจำวัน', description: 'เปิดรับรางวัลทุกวัน!', icon: '🎁', claimed: false, type: 'daily' },
    { id: 2, name: 'หัวใจ x10', description: 'สะสมหัวใจให้ตัวละคร', icon: '❤️', claimed: false, type: 'daily' },
    { id: 3, name: 'สติกเกอร์พิเศษ', description: 'สติกเกอร์ลิมิเต็ด', icon: '⭐', claimed: true, type: 'special' },
    { id: 4, name: 'วอลเปเปอร์', description: 'วอลเปเปอร์ตัวละคร', icon: '🖼️', claimed: false, type: 'special' },
  ]);

  const [timeLeft, setTimeLeft] = useState('');
  const [showClaimAnimation, setShowClaimAnimation] = useState<number | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}ชม. ${minutes}น.`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const claimReward = (id: number) => {
    setShowClaimAnimation(id);
    setTimeout(() => {
      setRewards(rewards.map(r => r.id === id ? { ...r, claimed: true } : r));
      setShowClaimAnimation(null);
    }, 1500);
  };

  return (
    <section className="px-4 py-8 pb-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-6"
      >
        <Gift className="w-6 h-6 text-[#e94560]" />
        <h2 className="text-xl font-bold text-white">รางวัลประจำวัน</h2>
      </motion.div>

      {/* Daily reward timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <MangaCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#e94560] to-[#533483] rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">รางวัลถัดไป</h3>
                <p className="text-white/60 text-sm">อีก {timeLeft}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text">5</div>
              <div className="text-xs text-white/60">วันต่อเนื่อง</div>
            </div>
          </div>
        </MangaCard>
      </motion.div>

      {/* Rewards grid */}
      <div className="grid grid-cols-2 gap-4">
        {rewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <MangaCard className={`p-4 ${reward.claimed ? 'opacity-60' : ''}`}>
              <div className="text-center">
                <div className="text-4xl mb-2">{reward.icon}</div>
                <h3 className="font-bold text-white text-sm mb-1">{reward.name}</h3>
                <p className="text-white/60 text-xs mb-3">{reward.description}</p>

                <AnimatePresence>
                  {showClaimAnimation === reward.id ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center justify-center gap-2 text-[#e94560]"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span className="font-bold">รับแล้ว!</span>
                    </motion.div>
                  ) : (
                    <Button
                      onClick={() => !reward.claimed && claimReward(reward.id)}
                      disabled={reward.claimed}
                      className={`w-full ${
                        reward.claimed
                          ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                          : 'btn-manga'
                      }`}
                      variant={reward.claimed ? 'outline' : 'default'}
                    >
                      {reward.claimed ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          รับแล้ว
                        </>
                      ) : (
                        'รับรางวัล'
                      )}
                    </Button>
                  )}
                </AnimatePresence>
              </div>
            </MangaCard>
          </motion.div>
        ))}
      </div>

      {/* Streak calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-6"
      >
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ปฏิทินล็อกอิน
        </h3>
        
        <div className="flex justify-between gap-2">
          {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((day, index) => (
            <motion.div
              key={day}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center ${
                index < 5
                  ? 'bg-gradient-to-br from-[#e94560] to-[#533483]'
                  : 'bg-[#16213e] border-2 border-white/20'
              }`}
            >
              <span className="text-xs text-white/60">{day}</span>
              {index < 5 && (
                <Check className="w-4 h-4 text-white" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
