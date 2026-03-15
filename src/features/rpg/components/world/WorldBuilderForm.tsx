import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Dices, Skull, Wand2, Sword, BookOpen, AlertCircle, Play, Sparkles } from 'lucide-react';

export function WorldBuilderForm() {
  const { setProfile, setWorldRules, completeWorldCreation } = useGameStore();
  const [step, setStep] = useState(1);

  // Local state for the form
  const [localProfile, setLocalProfile] = useState({
    name: '',
    class: 'Wanderer',
    description: ''
  });

  const [localRules, setLocalRules] = useState({
    worldName: '',
    theme: 'Dark Fantasy',
    chaosLevel: 50,
    magicLevel: 50,
    permaDeath: false
  });

  // Handle Input Changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setLocalProfile({ ...localProfile, [e.target.name]: e.target.value });
  };

  const handleRulesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setLocalRules({ ...localRules, [e.target.name]: value });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRules({ ...localRules, [e.target.name]: parseInt(e.target.value, 10) });
  };

  // Handle Submission
  const handleNextStep = () => {
    if (step === 1 && localProfile.name.trim() === '') {
      alert("กรุณาตั้งชื่อตัวละครของคุณ");
      return;
    }
    setStep(2);
  };

  const getAvatarPath = (className: string) => {
    switch(className) {
      case 'Knight': return '/avatars/knight.png';
      case 'Mage': return '/avatars/mage.png';
      case 'Rogue': return '/avatars/rogue.png';
      case 'Wanderer': return '/avatars/wanderer.png';
      default: return '/avatars/wanderer.png';
    }
  };

  const handleFinish = () => {
    if (localRules.worldName.trim() === '') {
      alert("กรุณาตั้งชื่อโลกใบใหม่ของคุณ");
      return;
    }
    
    // Save to Zustand with correct avatar
    setProfile({
      ...localProfile,
      avatarUrl: getAvatarPath(localProfile.class)
    });
    setWorldRules(localRules);
    completeWorldCreation();

    // 🤖 Trigger AI Game Master for the first time
    useGameStore.getState().processGameLogic('start');
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-200 flex flex-col justify-center px-6 pb-20 pt-10 relative overflow-hidden">
      
      {/* Dark Fantasy Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(123,44,191,0.4)_0%,rgba(0,0,0,0)_70%)]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        className="relative z-10 w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-16 h-16 mx-auto mb-4 bg-purple-900/30 border border-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(123,44,191,0.3)]"
          >
            <Dices className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">Manga Drama: Genesis</h1>
          <p className="text-slate-400 mt-2 text-sm">แท่นปฐมกาลแห่งผู้สร้าง</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-[#161821]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex justify-between mb-6 relative z-10">
            <div className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${step === 1 ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-500'}`}>
              1. ตัวละคร (Vessel)
            </div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${step === 2 ? 'bg-red-600/20 text-red-300 border border-red-500/30' : 'text-slate-500'}`}>
              2. โลก (The Realm)
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                variants={pageVariants} 
                initial="initial" animate="in" exit="out"
                transition={{ duration: 0.3 }}
                className="space-y-5 relative z-10"
              >
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 flex items-center gap-2"><BookOpen className="w-4 h-4"/> ขนานนามตัวละครของคุณ</label>
                  <input 
                    type="text" name="name"
                    placeholder="เช่น Arthur, Elara"
                    value={localProfile.name} onChange={handleProfileChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 flex items-center gap-2"><Sword className="w-4 h-4"/> คลาสอาชีพเริ่มต้น</label>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0">
                       <img 
                         src={getAvatarPath(localProfile.class)} 
                         alt="Class Preview" 
                         className="w-full h-full object-cover"
                         key={localProfile.class}
                       />
                    </div>
                    <div className="relative flex-1">
                      <select 
                        name="class" value={localProfile.class} onChange={handleProfileChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-purple-500 transition-all"
                      >
                        <option value="Wanderer">คนพเนจร (Wanderer)</option>
                        <option value="Knight">อัศวิน (Knight)</option>
                        <option value="Mage">ผู้ใช้เวทมนตร์ (Mage)</option>
                        <option value="Rogue">นักฆ่าเงา (Rogue)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 flex items-center gap-2"><Sparkles className="w-4 h-4"/> ลักษณะตัวละคร (Prompt สำหรับ AI)</label>
                  <div className="relative">
                    <textarea 
                      name="description"
                      placeholder="อธิบายรูปร่างหน้าตา เช่น ผมสีเงิน ตาสีแดง สวมเกราะเบา..."
                      value={localProfile.description} onChange={handleProfileChange}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none text-sm placeholder:text-slate-600"
                    />
                    <button 
                      onClick={() => alert("กำลังส่งคำขอให้ verzey ช่วยวาดรูปด้วย Nano Banana Pro... กรุณาบอกลักษณะตัวละครในแชทแล้วผมจะจัดการให้ครับ!")}
                      className="absolute bottom-3 right-3 bg-purple-600/50 hover:bg-purple-600 text-[10px] text-white px-2 py-1 rounded-md border border-purple-400/50 transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3"/> วาดด้วย AI
                    </button>
                  </div>
                  <p className="text-xs text-purple-400/70 mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3"/> AI จะนำข้อมูลนี้ไปวาดรูปประจำตัว (Avatar) ของคุณ
                  </p>
                </div>

                <button 
                  onClick={handleNextStep}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                  ถัดไป <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                variants={pageVariants} 
                initial="initial" animate="in" exit="out"
                transition={{ duration: 0.3 }}
                className="space-y-5 relative z-10"
              >
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">ชื่อโลกของคุณ (Realm Name)</label>
                  <input 
                    type="text" name="worldName"
                    placeholder="เช่น Eldoria, Neo-Tokyo"
                    value={localRules.worldName} onChange={handleRulesChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 flex justify-between">
                    <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-400"/> ความโกลาหล (Chaos Level)</span>
                    <span className="text-red-400 font-mono">{localRules.chaosLevel}%</span>
                  </label>
                  <input 
                    type="range" name="chaosLevel"
                    min="1" max="100"
                    value={localRules.chaosLevel} onChange={handleSliderChange}
                    className="w-full accent-red-500 bg-black/40 h-2 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 mt-1">ยิ่งสูง มอนสเตอร์และเหตุการณ์ไม่คาดฝันยิ่งดุร้าย</p>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 flex justify-between">
                    <span className="flex items-center gap-2"><Wand2 className="w-4 h-4 text-purple-400"/> พลังเวทมนตร์ (Magic Resonance)</span>
                    <span className="text-purple-400 font-mono">{localRules.magicLevel}%</span>
                  </label>
                  <input 
                    type="range" name="magicLevel"
                    min="1" max="100"
                    value={localRules.magicLevel} onChange={handleSliderChange}
                    className="w-full accent-purple-500 bg-black/40 h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-red-950/20 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skull className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-200">กฎแห่งความตาย (Perma-Death)</p>
                      <p className="text-[10px] text-red-400/70">ตายแล้วเกมจบทันที ลบเซฟทิ้ง</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="permaDeath" checked={localRules.permaDeath} onChange={handleRulesChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-black/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-4 py-3 bg-black/40 text-slate-300 rounded-xl hover:bg-black/60 transition-colors border border-white/5"
                  >
                    กลับ
                  </button>
                  <button 
                    onClick={handleFinish}
                    className="flex-1 bg-gradient-to-r from-[#7B2CBF] to-[#E63946] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(123,44,191,0.4)]"
                  >
                    <Play className="w-4 h-4" fill="currentColor" /> จุติโลกใบใหม่
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Restore Section */}
        <div className="mt-6 text-center">
           <button 
             onClick={() => {
                if (confirm("ต้องการเริ่มใหม่ทั้งหมดใช่ไหม?")) {
                  useGameStore.getState().resetGame();
                  window.location.reload();
                }
             }}
             className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
           >
             ล้างข้อมูลการเล่นเก่า (Reset Data)
           </button>
        </div>
      </motion.div>
    </div>
  );
}