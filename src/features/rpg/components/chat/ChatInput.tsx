import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { SendHorizontal } from 'lucide-react';

export function ChatInput() {
  const [text, setText] = useState('');
  const { addMessage, processGameLogic, isAiTyping } = useGameStore();

  const handleSend = () => {
    if (text.trim() === '' || isAiTyping) return;

    // 1. Add User message
    addMessage({
      role: 'user',
      content: text
    });

    // 2. Clear input
    setText('');

    // 3. Trigger AI Logic (in Sprint 3 we can pass this text to real API)
    processGameLogic('chat');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 z-30">
      <div className="max-w-md mx-auto">
        <div className="bg-[#161821]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1 flex items-center shadow-2xl focus-within:border-purple-500/50 transition-colors">
          <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isAiTyping ? "Game Master กำลังพูด..." : "พิมพ์คำสั่งหรือตอบโต้..."} 
            disabled={isAiTyping}
            className="flex-1 bg-transparent border-none px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            disabled={isAiTyping || text.trim() === ''}
            className={`w-10 h-10 rounded-xl flex items-center justify-center mr-1 transition-all ${
              text.trim() !== '' && !isAiTyping ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-600'
            }`}
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}