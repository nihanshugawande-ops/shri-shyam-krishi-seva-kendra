import React, { useEffect, useRef } from 'react';
import {
  Home,
  Pill,
  Bot,
  Headphones,
  Stethoscope,
  BookOpen,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';

interface AppBottomNavProps {
  language: Language;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

interface BottomNavItem {
  id: string;
  labelHi: string;
  labelEn: string;
  shortLabelHi: string;
  shortLabelEn: string;
  icon: React.ElementType;
  emoji: string;
  activeClasses: string;
  iconBg: string;
  indicatorColor: string;
}

export const APP_BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    id: 'home',
    labelHi: 'होम स्क्रीन',
    labelEn: 'Home',
    shortLabelHi: 'होम',
    shortLabelEn: 'Home',
    icon: Home,
    emoji: '🏠',
    // Warm Earthy Brown / Bronze Gold
    activeClasses: 'bg-gradient-to-t from-amber-900/60 to-amber-700/30 text-amber-200 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    iconBg: 'bg-gradient-to-br from-amber-600 to-yellow-600 text-black',
    indicatorColor: 'bg-amber-400',
  },
  {
    id: 'products',
    labelHi: 'दवाइयां',
    labelEn: 'Medicines',
    shortLabelHi: 'दवाइयां',
    shortLabelEn: 'Meds',
    icon: Pill,
    emoji: '💊',
    // Royal Ruby / Crimson Red
    activeClasses: 'bg-gradient-to-t from-rose-900/60 to-red-700/30 text-rose-200 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white',
    indicatorColor: 'bg-rose-400',
  },
  {
    id: 'ai-help',
    labelHi: 'AI डॉक्टर',
    labelEn: 'AI Doctor',
    shortLabelHi: 'AI डॉक्टर',
    shortLabelEn: 'AI',
    icon: Bot,
    emoji: '🤖',
    // Luminous Sky Blue & Cyan
    activeClasses: 'bg-gradient-to-t from-sky-900/60 to-cyan-700/30 text-sky-200 border-sky-400/60 shadow-[0_0_20px_rgba(14,165,233,0.5)]',
    iconBg: 'bg-gradient-to-br from-sky-400 to-cyan-500 text-black',
    indicatorColor: 'bg-sky-300',
  },
  {
    id: 'help-center',
    labelHi: 'हेल्प सेंटर',
    labelEn: 'Help Desk',
    shortLabelHi: 'हेल्प',
    shortLabelEn: 'Help',
    icon: Headphones,
    emoji: '💬',
    // Lush Emerald Agri-Green (Dominant)
    activeClasses: 'bg-gradient-to-t from-emerald-950/70 to-emerald-700/30 text-emerald-200 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-black',
    indicatorColor: 'bg-emerald-400',
  },
  {
    id: 'medicine-finder',
    labelHi: 'कौन सी दवाई डालें',
    labelEn: 'Medicine Guide',
    shortLabelHi: 'दवाई गाइड',
    shortLabelEn: 'Guide',
    icon: Stethoscope,
    emoji: '🩺',
    // Sunset Fire Orange & Amber
    activeClasses: 'bg-gradient-to-t from-orange-950/60 to-amber-700/30 text-orange-200 border-orange-400/60 shadow-[0_0_20px_rgba(249,115,22,0.4)]',
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500 text-black',
    indicatorColor: 'bg-orange-400',
  },
  {
    id: 'knowledge',
    labelHi: 'कृषि ज्ञान',
    labelEn: 'Crop Knowledge',
    shortLabelHi: 'कृषि ज्ञान',
    shortLabelEn: 'Advice',
    icon: BookOpen,
    emoji: '🌾',
    // Deep Royal Sapphire Blue
    activeClasses: 'bg-gradient-to-t from-blue-950/70 to-indigo-700/30 text-blue-200 border-blue-400/60 shadow-[0_0_20px_rgba(37,99,235,0.45)]',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
    indicatorColor: 'bg-blue-400',
  },
  {
    id: 'location',
    labelHi: 'दुकान स्थिति',
    labelEn: 'Location',
    shortLabelHi: 'दुकान',
    shortLabelEn: 'Shop',
    icon: MapPin,
    emoji: '📍',
    // Citron Lime
    activeClasses: 'bg-gradient-to-t from-lime-950/60 to-emerald-700/30 text-lime-200 border-lime-400/60 shadow-[0_0_20px_rgba(132,204,22,0.4)]',
    iconBg: 'bg-gradient-to-br from-lime-400 to-emerald-500 text-black',
    indicatorColor: 'bg-lime-400',
  },
];

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  language,
  activeSection,
  onNavigate,
}) => {
  const isHindi = language === 'hi';
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active item into view on mobile
  useEffect(() => {
    if (navContainerRef.current) {
      const activeEl = navContainerRef.current.querySelector(
        `[data-nav-id="${activeSection}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeSection]);

  return (
    <nav
      aria-label="Mobile App Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-50 pointer-events-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Luxury multi-color glowing top border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-emerald-400 via-sky-400 via-rose-500 to-blue-500 opacity-90 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />

      {/* Main Glassmorphism Bottom Dock (Rich Botanical Emerald-Navy Tone) */}
      <div className="bg-[#091512]/95 backdrop-blur-2xl border-t border-emerald-500/25 shadow-[0_-8px_30px_rgba(0,0,0,0.85)]">
        <div className="max-w-4xl mx-auto px-2 py-1.5 sm:py-2">
          <div
            ref={navContainerRef}
            className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-none snap-x"
          >
            {APP_BOTTOM_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  data-nav-id={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`group relative flex-1 min-w-[58px] sm:min-w-[76px] py-1.5 px-1 sm:px-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border cursor-pointer active:scale-90 snap-center ${
                    isActive
                      ? `${item.activeClasses} scale-[1.04]`
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  {/* Active glowing indicator pill */}
                  {isActive && (
                    <span
                      className={`absolute -top-1 w-5 h-1 rounded-full ${item.indicatorColor} shadow-[0_0_8px_currentColor] animate-pulse`}
                    />
                  )}

                  {/* Icon Box with rich 3D styling */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-sm ${
                      isActive
                        ? item.iconBg
                        : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-1 text-[10px] sm:text-[11px] font-bold tracking-tight truncate max-w-[68px] sm:max-w-[76px] ${
                      isActive ? 'text-white drop-shadow' : 'text-zinc-400'
                    }`}
                  >
                    {isHindi ? item.shortLabelHi : item.shortLabelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
