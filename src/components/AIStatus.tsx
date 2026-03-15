import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { 
  getAvailableProviders, 
  getBestProvider, 
  getProviderDisplayName, 
  getProviderStyle,
  type AIProvider 
} from '@/services/aiProviderManager';
import { isAIServiceAvailable } from '@/services/aiService';
import { isGeminiAvailable } from '@/services/geminiService';
import { isKimiAvailable } from '@/services/kimiService';

interface AIStatusProps {
  showDetails?: boolean;
}

export function AIStatus({ showDetails = false }: AIStatusProps) {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [bestProvider, setBestProvider] = useState<AIProvider>('auto');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const available = getAvailableProviders();
    setProviders(available);
    setBestProvider(getBestProvider());
  }, []);

  const getProviderStatus = (provider: AIProvider) => {
    switch (provider) {
      case 'openai':
        return isAIServiceAvailable();
      case 'gemini':
        return isGeminiAvailable();
      case 'kimi':
        return isKimiAvailable();
      default:
        return false;
    }
  };

  const allProviders: AIProvider[] = ['kimi', 'openai', 'gemini'];

  if (!showDetails) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2"
      >
        <div className={`w-2 h-2 rounded-full ${providers.length > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className="text-xs text-white/60">
          {providers.length > 0 
            ? `AI: ${getProviderDisplayName(bestProvider)}` 
            : 'AI: Offline'}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#16213e] rounded-xl p-4 border border-white/10"
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">สถานะ AI</h4>
            <p className="text-white/60 text-xs">
              {providers.length > 0 
                ? `${providers.length} ระบบพร้อมใช้งาน` 
                : 'ใช้ระบบพื้นฐาน'}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <Sparkles className="w-4 h-4 text-white/40" />
        </motion.div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 space-y-2"
        >
          {allProviders.map((provider) => {
            const isAvailable = getProviderStatus(provider);
            const style = getProviderStyle(provider);
            
            return (
              <div 
                key={provider}
                className="flex items-center justify-between p-2 rounded-lg bg-black/20"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{style.icon}</span>
                  <span className="text-white text-sm">{getProviderDisplayName(provider)}</span>
                </div>
                {isAvailable ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
            );
          })}
          
          {providers.length > 0 && (
            <div className="mt-3 p-2 bg-green-500/10 rounded-lg border border-green-500/30">
              <p className="text-green-400 text-xs text-center">
                ✅ ระบบจะใช้ {getProviderDisplayName(bestProvider)} เป็นหลัก
              </p>
            </div>
          )}
          
          {providers.length === 0 && (
            <div className="mt-3 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-400 text-xs text-center">
                ⚠️ ไม่มี AI API ระบบจะใช้เนื้อหาพื้นฐาน
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
