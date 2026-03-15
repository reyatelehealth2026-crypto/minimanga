import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Sparkles, RefreshCw, Dices, Trophy } from 'lucide-react';
import { MangaCard } from '@/components/manga/MangaCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Game 1: Tap the Character
function TapGame({ onClose }: { onClose: () => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [target, setTarget] = useState({ x: 50, y: 50, visible: true });
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      if (score > highScore) setHighScore(score);
    }
  }, [timeLeft, gameOver, score, highScore]);

  const moveTarget = useCallback(() => {
    setTarget({
      x: Math.random() * 70 + 15,
      y: Math.random() * 60 + 20,
      visible: true,
    });
  }, []);

  const handleTap = () => {
    setScore(score + 1);
    setTarget({ ...target, visible: false });
    setTimeout(moveTarget, 200);
  };

  const restart = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    moveTarget();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <span className="text-sm text-white/60">คะแนน:</span>
          <span className="text-2xl font-bold text-[#e94560] ml-2">{score}</span>
        </div>
        <div className="text-white">
          <span className="text-sm text-white/60">เวลา:</span>
          <span className="text-2xl font-bold text-yellow-400 ml-2">{timeLeft}</span>
        </div>
      </div>

      {!gameOver ? (
        <div className="relative h-64 bg-gradient-to-b from-[#16213e] to-[#1a1a2e] rounded-xl border-2 border-[#e94560] overflow-hidden">
          <AnimatePresence>
            {target.visible && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute cursor-pointer"
                style={{ left: `${target.x}%`, top: `${target.y}%` }}
                onClick={handleTap}
              >
                <img
                  src="/characters/hero-girl.png"
                  alt="Target"
                  className="w-20 h-24 object-contain drop-shadow-lg"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="h-64 bg-gradient-to-b from-[#16213e] to-[#1a1a2e] rounded-xl border-2 border-[#e94560] flex flex-col items-center justify-center">
          <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">เกมจบ!</h3>
          <p className="text-white/60 mb-2">คะแนนที่ได้: {score}</p>
          {score === highScore && score > 0 && (
            <p className="text-[#e94560] font-bold text-sm mb-4">🏆 สถิติใหม่!</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={restart} className="flex-1 btn-manga">
          <RefreshCw className="w-4 h-4 mr-2" />
          เล่นอีกครั้ง
        </Button>
        <Button onClick={onClose} variant="outline" className="border-2 border-white/20">
          ปิด
        </Button>
      </div>
    </div>
  );
}

// Game 2: Fortune Teller
function FortuneGame({ onClose }: { onClose: () => void }) {
  const fortunes = [
    { level: 'super', text: 'ดวงซุปเปอร์เฮง! วันนี้เป็นวันของคุณ', color: '#FFD700', icon: '⭐' },
    { level: 'good', text: 'ดวงดี! มีโชคด้านการเงิน', color: '#4CAF50', icon: '💰' },
    { level: 'love', text: 'ดวงความรักพุ่งแรง! ระวังหัวใจละลาย', color: '#e94560', icon: '💕' },
    { level: 'normal', text: 'ดวงปกติ แต่ก็มีความสุขได้', color: '#2196F3', icon: '😊' },
    { level: 'caution', text: 'ดวงระวัง! อย่าประมาท', color: '#FF9800', icon: '⚠️' },
    { level: 'bad', text: 'ดวงแย่... แต่พรุ่งนี้จะดีขึ้น!', color: '#9E9E9E', icon: '🌧️' },
  ];

  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<typeof fortunes[0] | null>(null);

  const shake = () => {
    setIsShaking(true);
    setResult(null);
    setTimeout(() => {
      setResult(fortunes[Math.floor(Math.random() * fortunes.length)]);
      setIsShaking(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">ดูดวงประจำวัน</h3>
        <p className="text-white/60 text-sm">เขย่าลูกแก้วเพื่อทำนายดวง</p>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        <motion.div
          animate={isShaking ? {
            x: [-10, 10, -10, 10, 0],
            rotate: [-5, 5, -5, 5, 0],
          } : {}}
          transition={{ duration: 0.5, repeat: isShaking ? 3 : 0 }}
          className="relative"
        >
          <img
            src="/characters/fortune-girl.png"
            alt="Fortune Teller"
            className="w-32 h-40 object-contain"
          />
          
          {/* Crystal ball glow */}
          <motion.div
            animate={{
              boxShadow: isShaking 
                ? ['0 0 20px #9C27B0', '0 0 40px #E91E63', '0 0 20px #9C27B0']
                : '0 0 20px #9C27B0',
            }}
            transition={{ duration: 0.5, repeat: isShaking ? Infinity : 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-radial from-purple-400/50 to-transparent"
          />
        </motion.div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 rounded-xl border-2"
          style={{ borderColor: result.color, background: `${result.color}20` }}
        >
          <div className="text-4xl mb-2">{result.icon}</div>
          <p className="font-bold" style={{ color: result.color }}>{result.text}</p>
        </motion.div>
      )}

      <Button 
        onClick={shake} 
        disabled={isShaking}
        className="w-full btn-manga"
      >
        <Dices className="w-4 h-4 mr-2" />
        {isShaking ? 'กำลังทำนาย...' : 'เขย่าลูกแก้ว'}
      </Button>

      <Button onClick={onClose} variant="outline" className="w-full border-2 border-white/20">
        ปิด
      </Button>
    </div>
  );
}

// Game 3: Character Quiz
function QuizGame({ onClose }: { onClose: () => void }) {
  const questions = [
    {
      question: 'ตัวละครไหนชอบเล่นกีฬา?',
      options: ['ซากุระ', 'ฮินาตะ', 'ยูกิ', 'ลูน่า'],
      correct: 1,
      image: '/characters/sporty-girl.png',
    },
    {
      question: 'ใครเป็นหมอดู?',
      options: ['ไรโตะ', 'ซากุระ', 'ลูน่า', 'ฮินาตะ'],
      correct: 2,
      image: '/characters/fortune-girl.png',
    },
    {
      question: 'ตัวละครไหนขี้อาย?',
      options: ['ยูกิ', 'ฮินาตะ', 'ซากุระ', 'ไรโตะ'],
      correct: 0,
      image: '/characters/shy-girl.png',
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    setSelected(index);
    if (index === questions[currentQ].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const restart = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelected(null);
  };

  if (showResult) {
    return (
      <div className="space-y-4 text-center">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto" />
        <h3 className="text-2xl font-bold text-white">เสร็จสิ้น!</h3>
        <p className="text-white/60">
          คุณตอบถูก {score} จาก {questions.length} ข้อ
        </p>
        <div className="text-4xl font-bold gradient-text">
          {score === questions.length ? 'สมบูรณ์แบบ! 🎉' : score >= 2 ? 'เก่งมาก! 👏' : 'ลองใหม่นะ 💪'}
        </div>
        <div className="flex gap-2">
          <Button onClick={restart} className="flex-1 btn-manga">
            <RefreshCw className="w-4 h-4 mr-2" />
            เล่นอีกครั้ง
          </Button>
          <Button onClick={onClose} variant="outline" className="border-2 border-white/20">
            ปิด
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-white/60 text-sm">คำถาม {currentQ + 1}/{questions.length}</span>
        <span className="text-[#e94560] font-bold">คะแนน: {score}</span>
      </div>

      <div className="text-center">
        <img
          src={questions[currentQ].image}
          alt="Question"
          className="w-24 h-32 object-contain mx-auto mb-4"
        />
        <h3 className="text-lg font-bold text-white mb-4">{questions[currentQ].question}</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {questions[currentQ].options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={selected !== null}
            className={`h-auto py-3 px-4 text-sm ${
              selected === null
                ? 'bg-[#16213e] border-2 border-[#e94560]/50 hover:bg-[#e94560]/20'
                : selected === index
                ? index === questions[currentQ].correct
                  ? 'bg-green-500 border-2 border-green-400'
                  : 'bg-red-500 border-2 border-red-400'
                : index === questions[currentQ].correct
                ? 'bg-green-500 border-2 border-green-400'
                : 'bg-[#16213e] border-2 border-white/20'
            }`}
            variant="outline"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function MiniGames() {
  const [activeGame, setActiveGame] = useState<'tap' | 'fortune' | 'quiz' | null>(null);

  const games = [
    {
      id: 'tap' as const,
      title: 'จับตัวละคร',
      description: 'กดตัวละครให้ทันเวลา!',
      icon: <Gamepad2 className="w-8 h-8 text-[#e94560]" />,
      color: '#e94560',
    },
    {
      id: 'fortune' as const,
      title: 'ดูดวงวันนี้',
      description: 'ทำนายดวงชะตาของคุณ',
      icon: <Sparkles className="w-8 h-8 text-[#9C27B0]" />,
      color: '#9C27B0',
    },
    {
      id: 'quiz' as const,
      title: 'ทายตัวละคร',
      description: 'ทดสอบความรู้เกี่ยวกับตัวละคร',
      icon: <Dices className="w-8 h-8 text-[#2196F3]" />,
      color: '#2196F3',
    },
  ];

  return (
    <section className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-6"
      >
        <Gamepad2 className="w-6 h-6 text-[#e94560]" />
        <h2 className="text-xl font-bold text-white">มินิเกมส์</h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <MangaCard
              className="p-4 cursor-pointer"
              onClick={() => setActiveGame(game.id)}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: `${game.color}30` }}
                >
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{game.title}</h3>
                  <p className="text-white/60 text-sm">{game.description}</p>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: game.color }}
                >
                  <span className="text-black font-bold text-sm">▶</span>
                </div>
              </div>
            </MangaCard>
          </motion.div>
        ))}
      </div>

      {/* Game Dialogs */}
      <Dialog open={activeGame === 'tap'} onOpenChange={() => setActiveGame(null)}>
        <DialogContent className="bg-[#1a1a2e] border-2 border-[#e94560] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-white">จับตัวละคร</DialogTitle>
          </DialogHeader>
          <TapGame onClose={() => setActiveGame(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={activeGame === 'fortune'} onOpenChange={() => setActiveGame(null)}>
        <DialogContent className="bg-[#1a1a2e] border-2 border-[#9C27B0] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-white">ดูดวงวันนี้</DialogTitle>
          </DialogHeader>
          <FortuneGame onClose={() => setActiveGame(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={activeGame === 'quiz'} onOpenChange={() => setActiveGame(null)}>
        <DialogContent className="bg-[#1a1a2e] border-2 border-[#2196F3] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-white">ทายตัวละคร</DialogTitle>
          </DialogHeader>
          <QuizGame onClose={() => setActiveGame(null)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
