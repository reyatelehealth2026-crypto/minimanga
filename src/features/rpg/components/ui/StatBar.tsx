import { useGameStore } from '../../store/useGameStore';
import { motion } from 'framer-motion';
import { Heart, Droplets, Shield, Sword, Skull } from 'lucide-react';

export function StatBar() {
  const { profile, stats, worldRules } = useGameStore();

  const hpPercentage = (stats.hp.current / stats.hp.max) * 100;
  const manaPercentage = (stats.mana.current / stats.mana.max) * 100;

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#090A0F] to-transparent pt-safe pb-4 px-4"
    >
      <div className="max-w-md mx-auto bg-[#161821]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-lg flex items-center gap-3">
        
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#7B2CBF] bg-black shrink-0">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + profile.name + '&background=7B2CBF&color=fff' }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#E63946] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black">
            Lv.{stats.level}
          </div>
        </div>

        {/* Info & Bars */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <h3 className="text-sm font-bold text-white truncate max-w-[120px]">{profile.name}</h3>
            <span className="text-[10px] text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/30">
              {profile.class}
            </span>
          </div>

          <div className="space-y-1.5">
            {/* HP Bar */}
            <div className="relative h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-[#E63946]"
                initial={{ width: 0 }}
                animate={{ width: `${hpPercentage}%` }}
                transition={{ duration: 0.5, type: 'spring' }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                <Heart className="w-2.5 h-2.5 text-white/80" fill="currentColor" />
                <span className="text-[8px] font-mono text-white/90 font-bold leading-none">{stats.hp.current}/{stats.hp.max}</span>
              </div>
            </div>

            {/* Mana Bar */}
            <div className="relative h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-[#00B4D8]"
                initial={{ width: 0 }}
                animate={{ width: `${manaPercentage}%` }}
                transition={{ duration: 0.5, type: 'spring' }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                <Droplets className="w-2 h-2 text-white/80" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* World Icon/Info */}
        <div className="shrink-0 flex flex-col items-center justify-center border-l border-white/10 pl-3">
          <div className="text-[9px] text-slate-400 mb-0.5">{worldRules.worldName}</div>
          <div className="flex gap-1 text-slate-300">
             {worldRules.permaDeath ? <Skull className="w-3.5 h-3.5 text-red-500" /> : <Shield className="w-3.5 h-3.5" />}
             {worldRules.chaosLevel > 70 && <Sword className="w-3.5 h-3.5 text-orange-400" />}
          </div>
        </div>

      </div>
    </motion.div>
  );
}