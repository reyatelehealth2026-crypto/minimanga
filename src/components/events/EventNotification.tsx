import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Sparkles, Cloud, Sun, Gift } from 'lucide-react';
import { useDynamicEventStore } from '@/store/events/dynamicEventStore';

export function EventNotification() {
  const { pendingNotifications, clearNotifications } = useDynamicEventStore();
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);

  useEffect(() => {
    if (pendingNotifications.length > 0 && !currentNotification) {
      setCurrentNotification(pendingNotifications[0]);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setCurrentNotification(null);
        clearNotifications();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [pendingNotifications, currentNotification, clearNotifications]);

  const getIcon = (message: string) => {
    if (message.includes('เหตุการณ์พิเศษ')) return <Sparkles className="w-5 h-5 text-yellow-400" />;
    if (message.includes('อากาศ')) return <Cloud className="w-5 h-5 text-blue-400" />;
    if (message.includes('เวลา')) return <Sun className="w-5 h-5 text-orange-400" />;
    if (message.includes('เทศกาล')) return <Gift className="w-5 h-5 text-pink-400" />;
    return <Bell className="w-5 h-5 text-[#e94560]" />;
  };

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50 w-[90%] max-w-md"
        >
          <div className="bg-[#1a1a2e]/95 backdrop-blur-lg border-2 border-[#e94560] rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#e94560]/20 rounded-full flex items-center justify-center flex-shrink-0">
                {getIcon(currentNotification)}
              </div>
              <p className="text-white text-sm flex-1">{currentNotification}</p>
              <button
                onClick={() => setCurrentNotification(null)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
