import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Cloud, Clock, Sparkles, RefreshCw, MapPin, Brain } from 'lucide-react';
import { useDynamicEventStore } from '@/store/events/dynamicEventStore';
import { EventCard } from '@/components/events/EventCard';
import { EventNotification } from '@/components/events/EventNotification';
import { AIStatus } from '@/components/AIStatus';
import { MangaCard } from '@/components/manga/MangaCard';
import { Button } from '@/components/ui/button';
import { VisualNovel } from '@/sections/story/VisualNovel';
import { getWeatherIcon, getWeatherDescription } from '@/services/weatherService';
import { getTimeIcon, getTimeDescription, formatCurrentTime, getTimeGreeting } from '@/services/timeService';
import { generateSpecialEvent, getBestProvider, isAnyAIAvailable } from '@/services/aiProviderManager';

export function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const { 
    activeEvents, 
    currentWeather, 
    initializeEvents, 
    checkForNewEvents, 
    updateWeather,
    completeEvent,
    dismissEvent,
  } = useDynamicEventStore();

  useEffect(() => {
    initializeEvents();
    
    // Check for new events every minute
    const interval = setInterval(() => {
      checkForNewEvents();
    }, 60000);

    return () => clearInterval(interval);
  }, [initializeEvents, checkForNewEvents]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await updateWeather();
    await checkForNewEvents();
    setIsRefreshing(false);
  };

  const handleGenerateAIEvent = async () => {
    setIsGeneratingAI(true);
    
    const characters = ['sakura', 'rito', 'luna', 'hinata', 'yuki'];
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    const eventTypes = ['weather', 'time', 'random'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const event = await generateSpecialEvent(randomType, randomChar);
    
    if (event) {
      // Add the generated event to the store
      const { addNotification } = useDynamicEventStore.getState();
      addNotification(`✨ AI สร้างเหตุการณ์: ${event.title}`);
    }
    
    setIsGeneratingAI(false);
  };

  const handleEventClick = (eventId: string) => {
    setSelectedEvent(eventId);
  };

  const handleEventComplete = () => {
    if (selectedEvent) {
      completeEvent(selectedEvent);
      setSelectedEvent(null);
    }
  };

  const availableEvents = activeEvents.filter(e => !e.isCompleted);
  const timeOfDay = getCurrentTimeOfDay();
  const hasAI = isAnyAIAvailable();
  const bestProvider = getBestProvider();

  // If an event is selected, show Visual Novel
  if (selectedEvent) {
    const event = activeEvents.find(e => e.id === selectedEvent);
    if (event) {
      return (
        <VisualNovel
          sceneId="scene_dynamic_event"
          onComplete={handleEventComplete}
          onExit={() => setSelectedEvent(null)}
        />
      );
    }
  }

  return (
    <section className="px-4 py-8 pb-24">
      <EventNotification />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#e94560]" />
          <h2 className="text-xl font-bold text-white">เหตุการณ์พิเศษ</h2>
        </div>
        <div className="flex gap-2">
          {hasAI && (
            <Button
              onClick={handleGenerateAIEvent}
              disabled={isGeneratingAI}
              variant="outline"
              className="border-2 border-purple-500/50 p-2"
            >
              <Brain className={`w-4 h-4 text-purple-400 ${isGeneratingAI ? 'animate-pulse' : ''}`} />
            </Button>
          )}
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-2 border-white/20 p-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </motion.div>

      {/* AI Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <AIStatus showDetails={false} />
      </motion.div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <MangaCard className="p-4">
          <div className="flex items-center justify-between">
            {/* Time */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{getTimeIcon(timeOfDay)}</span>
              </div>
              <div>
                <p className="text-white font-bold">{formatCurrentTime()}</p>
                <p className="text-white/60 text-sm">{getTimeDescription(timeOfDay)}</p>
              </div>
            </div>

            {/* Weather */}
            {currentWeather && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white font-bold">{currentWeather.temperature}°C</p>
                  <p className="text-white/60 text-sm">{getWeatherDescription(currentWeather.condition)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{getWeatherIcon(currentWeather.condition)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Greeting */}
          <p className="text-white/80 text-center mt-4 text-sm">
            {getTimeGreeting()}! วันนี้มีเหตุการณ์พิเศษรอคุณอยู่!
          </p>
        </MangaCard>
      </motion.div>

      {/* AI Generate Button (if available) */}
      {hasAI && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={handleGenerateAIEvent}
            disabled={isGeneratingAI}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-2 border-white/20"
          >
            <Brain className={`w-5 h-5 mr-2 ${isGeneratingAI ? 'animate-pulse' : ''}`} />
            {isGeneratingAI ? 'AI กำลังสร้างเหตุการณ์...' : 'สร้างเหตุการณ์ด้วย AI'}
          </Button>
          <p className="text-white/40 text-xs text-center mt-2">
            Powered by {bestProvider === 'kimi' ? 'Kimi AI' : bestProvider === 'openai' ? 'OpenAI' : 'Gemini'}
          </p>
        </motion.div>
      )}

      {/* Active Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            เหตุการณ์ที่กำลังดำเนินอยู่
          </h3>
          <span className="text-white/60 text-sm">{availableEvents.length} รายการ</span>
        </div>

        {availableEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🌟</div>
            <p className="text-white/60 mb-2">ยังไม่มีเหตุการณ์พิเศษตอนนี้</p>
            <p className="text-white/40 text-sm">กลับมาตรวจสอบอีกครั้งภายหลัง!</p>
            {hasAI && (
              <Button
                onClick={handleGenerateAIEvent}
                disabled={isGeneratingAI}
                className="mt-4 btn-manga"
              >
                <Brain className="w-4 h-4 mr-2" />
                สร้างเหตุการณ์ด้วย AI
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {availableEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard
                  event={event}
                  onClick={() => handleEventClick(event.id)}
                  onDismiss={() => dismissEvent(event.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#e94560]" />
          สถานะปัจจุบัน
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#16213e] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-white/60 text-xs">เวลา</span>
            </div>
            <p className="text-white font-bold">{getTimeDescription(timeOfDay)}</p>
            <p className="text-white/40 text-xs">{formatCurrentTime()}</p>
          </div>
          
          <div className="bg-[#16213e] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              <span className="text-white/60 text-xs">อากาศ</span>
            </div>
            <p className="text-white font-bold">
              {currentWeather ? getWeatherDescription(currentWeather.condition) : 'โหลด...'}
            </p>
            <p className="text-white/40 text-xs">
              {currentWeather ? `${currentWeather.temperature}°C` : '-'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI Status Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <AIStatus showDetails={true} />
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-[#e94560]/20 to-[#533483]/20 rounded-xl border border-dashed border-[#e94560]/50"
      >
        <p className="text-white/70 text-sm text-center">
          💡 <span className="font-bold">เคล็ดลับ:</span> เหตุการณ์จะเปลี่ยนไปตาม
          <span className="text-[#e94560]">เวลาจริง</span> และ 
          <span className="text-blue-400">สภาพอากาศ</span>!
          {hasAI && (
            <>
              <br />
              <span className="text-purple-400">AI จะสร้างเนื้อหาใหม่แบบไม่ซ้ำ!</span>
            </>
          )}
        </p>
      </motion.div>
    </section>
  );
}

// Helper function to get current time of day
function getCurrentTimeOfDay() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  if (hour >= 20 && hour < 24) return 'night';
  return 'midnight';
}
