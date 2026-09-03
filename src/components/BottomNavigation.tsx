import React from 'react';
import { Home, Mail, Send, ShieldAlert, Users, Settings } from 'lucide-react';
import { AppSettings } from '../types';

interface BottomNavigationProps {
  activeScreen: string;
  onSelectScreen: (screen: string) => void;
  unreadCount: number;
  settings: AppSettings;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeScreen,
  onSelectScreen,
  unreadCount,
  settings,
}) => {
  const isTamil = settings.language === 'ta';

  const navItems = [
    { id: 'home', label: isTamil ? 'முகப்பு' : 'Home', icon: Home },
    { id: 'inbox', label: isTamil ? 'செய்திகள்' : 'Inbox', icon: Mail, badge: unreadCount },
    { id: 'send', label: isTamil ? 'அனுப்பு' : 'Send', icon: Send, highlight: true },
    { id: 'radar', label: isTamil ? 'ரேடார்' : 'Radar', icon: ShieldAlert },
    { id: 'contacts', label: isTamil ? 'குடும்பம்' : 'Family', icon: Users },
    { id: 'settings', label: isTamil ? 'அமைப்புகள்' : 'Settings', icon: Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-2 px-3"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => onSelectScreen(item.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-2.5 rounded-2xl transition-all ${
                item.highlight && !isActive
                  ? 'text-amber-700 font-bold'
                  : isActive
                  ? 'text-slate-950 font-black scale-105'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                    : item.highlight
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-current'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
