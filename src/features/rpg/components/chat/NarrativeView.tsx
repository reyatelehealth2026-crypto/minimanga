import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Loader2, User, Bot } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';
import type { VirtuosoHandle } from 'react-virtuoso';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
}

const TypewriterText = ({ text, onComplete }: TypewriterTextProps) => {
  const characters = Array.from(text);
  
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      onAnimationComplete={onComplete}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.015,
          },
        },
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export function NarrativeView() {
  const { chatHistory, isAiTyping, profile, choices, makeChoice } = useGameStore();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    virtuosoRef.current?.scrollToIndex({
      index: chatHistory.length - 1,
      behavior: 'smooth',
    });
  }, [chatHistory, isAiTyping, choices]);

  const MessageItem = ({ index }: { index: number }) => {
    const msg = chatHistory[index];
    const isLast = index === chatHistory.length - 1;
    const isSystem = msg.role === 'system';
    const isUser = msg.role === 'user';
    const isAi = msg.role === 'ai';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col mb-6 ${isUser ? 'items-end' : isSystem ? 'items-center' : 'items-start'}`}
      >
        {!isSystem && (
          <div className={`flex items-center gap-1.5 mb-1 text-[10px] font-bold uppercase tracking-widest ${isUser ? 'text-purple-400' : 'text-slate-500'}`}>
            {isUser ? <><User className="w-3 h-3"/> {profile.name}</> : <><Bot className="w-3 h-3"/> Game Master</>}
          </div>
        )}

        <div className={`
          max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isSystem 
            ? 'bg-blue-900/10 border border-blue-500/20 text-blue-300 text-center italic text-xs' 
            : isUser 
              ? 'bg-purple-600/20 border border-purple-500/30 text-purple-100 rounded-tr-none' 
              : 'bg-[#161821]/80 backdrop-blur-md border border-white/5 text-slate-200 rounded-tl-none shadow-xl'
          }
        `}>
          {isAi && isLast ? (
            <TypewriterText text={msg.content} />
          ) : (
            msg.content
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] pt-20">
      <Virtuoso
        ref={virtuosoRef}
        data={chatHistory}
        initialTopMostItemIndex={chatHistory.length - 1}
        className="flex-1 px-4 pb-10 scroll-smooth no-scrollbar"
        itemContent={(index) => <MessageItem index={index} />}
        components={{
          Footer: () => (
            <div className="pb-32">
              {isAiTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-slate-500 text-xs pl-2 mb-4"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Game Master กำลังแต่งแต้มโชคชะตา...</span>
                </motion.div>
              )}

              {choices.length > 0 && !isAiTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 pt-4"
                >
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mb-1">
                    โปรดเลือกเส้นทางของคุณ
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => makeChoice(choice)}
                        className="bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/30 text-purple-200 px-4 py-3 rounded-xl text-sm transition-all text-left active:scale-95"
                      >
                        <span className="font-bold block text-xs opacity-70 mb-0.5">{choice.description}</span>
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )
        }}
      />
    </div>
  );
}