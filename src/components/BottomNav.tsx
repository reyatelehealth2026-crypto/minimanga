import { motion } from 'framer-motion';
import { Home, BookOpen, Compass, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavProps {
  hasEventNotification?: boolean;
}

const navItems = [
  { id: 'home', path: '/', label: 'หน้าหลัก', icon: Home, showBadge: true },
  { id: 'story', path: '/story', label: 'เนื้อเรื่อง', icon: BookOpen },
  { id: 'explore', path: '/explore', label: 'สำรวจ', icon: Compass },
  { id: 'collection', path: '/collection', label: 'คอลเลกชัน', icon: Users },
];

export function BottomNav({ hasEventNotification = false }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // ตรวจสอบว่า path ปัจจุบันตรงกับเมนูไหน
  const getActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath === '/') return 'home';
    const activeItem = navItems.find(item => currentPath.startsWith(item.path) && item.id !== 'home');
    return activeItem ? activeItem.id : 'home';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bottom-nav z-50">
      <div className="max-w-md mx-auto flex justify-around items-center py-2 px-4 overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const showBadge = item.showBadge && hasEventNotification && !isActive;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center py-2 px-4 rounded-xl transition-colors flex-1 cursor-pointer ${
                isActive ? 'text-[#e94560]' : 'text-white/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#e94560]/20 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Notification badge */}
              {showBadge && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1/4 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f0f23]"
                />
              )}
              
              <motion.div
                animate={isActive ? { y: -2 } : { y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="relative"
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              </motion.div>
              
              <span className={`text-[11px] mt-1 whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1.5 h-1.5 bg-[#e94560] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-[#0f0f23]" />
    </nav>
  );
}
