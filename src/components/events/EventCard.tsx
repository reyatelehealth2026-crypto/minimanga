import { motion } from 'framer-motion';
import { Clock, Cloud, Gift, Sparkles, ChevronRight, X } from 'lucide-react';
import type { ActiveEvent } from '@/store/events/dynamicEventStore';
import { MangaCard } from '@/components/manga/MangaCard';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  event: ActiveEvent;
  onClick: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

export function EventCard({ event, onClick, onDismiss, compact = false }: EventCardProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case 'weather':
        return <Cloud className="w-5 h-5 text-blue-400" />;
      case 'time':
        return <Clock className="w-5 h-5 text-orange-400" />;
      case 'holiday':
        return <Gift className="w-5 h-5 text-pink-400" />;
      case 'ai_generated':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'weather':
        return 'เหตุการณ์อากาศ';
      case 'time':
        return 'เหตุการณ์ตามเวลา';
      case 'holiday':
        return 'เทศกาลพิเศษ';
      case 'ai_generated':
        return 'เหตุการณ์พิเศษ';
      default:
        return 'เหตุการณ์';
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const diff = event.expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}ชม.`;
    return `${minutes}น.`;
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="cursor-pointer"
      >
        <div 
          className="p-3 rounded-xl border-2 border-[#e94560]/50 bg-black/40 backdrop-blur-sm"
          style={{ background: event.background }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              {getEventIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{event.title}</p>
              <p className="text-white/60 text-xs">{getTimeRemaining()}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/60" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <MangaCard className="overflow-hidden">
      {/* Header with background */}
      <div 
        className="h-24 relative"
        style={{ background: event.background }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1">
            {getEventIcon()}
            <span className="text-white text-xs">{getEventTypeLabel()}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-white text-xs">{getTimeRemaining()}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
        <p className="text-white/70 text-sm mb-4">{event.description}</p>

        {/* Character preview */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-[#16213e] rounded-xl">
          <img
            src={`/characters/${event.characterId === 'sakura' ? 'hero-girl' : 
                  event.characterId === 'rito' ? 'cool-boy' :
                  event.characterId === 'luna' ? 'fortune-girl' :
                  event.characterId === 'hinata' ? 'sporty-girl' :
                  event.characterId === 'yuki' ? 'shy-girl' : 'hero-girl'}.png`}
            alt="Character"
            className="w-12 h-16 object-contain"
          />
          <div>
            <p className="text-white text-sm font-bold">
              {event.characterId === 'sakura' ? 'ซากุระ' :
               event.characterId === 'rito' ? 'ไรโตะ' :
               event.characterId === 'luna' ? 'ลูน่า' :
               event.characterId === 'hinata' ? 'ฮินาตะ' :
               event.characterId === 'yuki' ? 'ยูกิ' : '???'} รออยู่!
            </p>
            <p className="text-white/60 text-xs">แตะเพื่อเริ่มเหตุการณ์</p>
          </div>
        </div>

        {/* Rewards preview */}
        {event.rewards.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.rewards.map((reward, i) => (
              <span 
                key={i}
                className="text-xs bg-[#e94560]/20 text-[#e94560] px-2 py-1 rounded-full"
              >
                🎁 {reward}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={onClick} className="flex-1 btn-manga">
            เริ่มเหตุการณ์
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          {onDismiss && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              variant="outline"
              className="border-2 border-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </MangaCard>
  );
}
