import React, { useState, useEffect } from 'react';
import {
  Home,
  Pill,
  Bot,
  Headphones,
  Stethoscope,
  BookOpen,
  MapPin,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Language } from '../types';

interface LuxuryIconNavProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
  isSticky?: boolean;
}

export interface NavIconItem {
  id: string;
  labelHi: string;
  labelEn: string;
  subHi: string;
  subEn: string;
  badgeHi: string;
  badgeEn: string;
  icon: React.ElementType;
  emoji: string;
  colorScheme: {
    bgGradient: string;
    border: string;
    hoverBorder: string;
    iconBoxBg: string;
    iconColor: string;
    glow: string;
    textColor: string;
    badgeStyle: string;
    activeRing: string;
    accentBar: string;
    spotlight: string;
  };
}

export const NAV_ICONS: NavIconItem[] = [
  {
    id: 'home',
    labelHi: 'होम स्क्रीन',
    labelEn: 'Home Screen',
    subHi: 'मुख्य पृष्ठ व टॉप व्यू',
    subEn: 'Top View & Welcome',
    badgeHi: 'रॉयल होम',
    badgeEn: 'VIP Home',
    icon: Home,
    emoji: '🏠',
    colorScheme: {
      bgGradient: 'from-amber-500/20 via-amber-950/60 to-[#0e0f14]',
      border: 'border-amber-500/50',
      hoverBorder: 'hover:border-amber-400',
      iconBoxBg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-black shadow-[0_0_22px_rgba(245,158,11,0.55)]',
      iconColor: 'text-zinc-950',
      glow: 'shadow-[0_0_35px_rgba(245,158,11,0.3)]',
      textColor: 'text-amber-200',
      badgeStyle: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black',
      activeRing: 'ring-2 ring-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]',
      accentBar: 'bg-gradient-to-r from-amber-400 to-yellow-300',
      spotlight: 'bg-amber-500/25',
    },
  },
  {
    id: 'products',
    labelHi: 'कृषि दवाइयां',
    labelEn: 'All Medicines',
    subHi: 'कीटनाशक, खरपतवारनाशक, खाद',
    subEn: 'Pesticides, Weedicides, Seeds',
    badgeHi: '100% असली दवाइयां',
    badgeEn: 'Original Medicines',
    icon: Pill,
    emoji: '💊',
    colorScheme: {
      bgGradient: 'from-rose-500/20 via-rose-950/60 to-[#0e0f14]',
      border: 'border-rose-500/50',
      hoverBorder: 'hover:border-rose-400',
      iconBoxBg: 'bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white shadow-[0_0_22px_rgba(244,63,94,0.55)]',
      iconColor: 'text-white',
      glow: 'shadow-[0_0_35px_rgba(244,63,94,0.3)]',
      textColor: 'text-rose-200',
      badgeStyle: 'bg-gradient-to-r from-rose-500 to-red-500 text-white font-black',
      activeRing: 'ring-2 ring-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.5)]',
      accentBar: 'bg-gradient-to-r from-rose-400 to-red-300',
      spotlight: 'bg-rose-500/25',
    },
  },
  {
    id: 'ai-help',
    labelHi: 'AI फसल डॉक्टर',
    labelEn: 'AI Crop Doctor',
    subHi: 'फोटो से तुरंत रोग पहचान व पर्ची',
    subEn: 'Instant Leaf Diagnosis',
    badgeHi: '24/7 AI डॉक्टर',
    badgeEn: 'Live AI Doctor',
    icon: Bot,
    emoji: '🤖',
    colorScheme: {
      bgGradient: 'from-cyan-500/20 via-indigo-950/60 to-[#0e0f14]',
      border: 'border-cyan-400/50',
      hoverBorder: 'hover:border-cyan-300',
      iconBoxBg: 'bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 text-black shadow-[0_0_22px_rgba(6,182,212,0.6)]',
      iconColor: 'text-zinc-950',
      glow: 'shadow-[0_0_35px_rgba(6,182,212,0.35)]',
      textColor: 'text-cyan-200',
      badgeStyle: 'bg-gradient-to-r from-cyan-400 to-teal-400 text-zinc-950 font-black',
      activeRing: 'ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.55)]',
      accentBar: 'bg-gradient-to-r from-cyan-400 to-teal-300',
      spotlight: 'bg-cyan-500/25',
    },
  },
  {
    id: 'help-center',
    labelHi: 'हेल्प सेंटर',
    labelEn: 'Help Center',
    subHi: 'सीधे कॉल व व्हाट्सएप सहायता',
    subEn: 'Direct Phone & WhatsApp',
    badgeHi: 'तुरंत सहायता',
    badgeEn: 'Direct Helpline',
    icon: Headphones,
    emoji: '💬',
    colorScheme: {
      bgGradient: 'from-emerald-500/20 via-emerald-950/60 to-[#0e0f14]',
      border: 'border-emerald-500/50',
      hoverBorder: 'hover:border-emerald-400',
      iconBoxBg: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-black shadow-[0_0_22px_rgba(16,185,129,0.55)]',
      iconColor: 'text-zinc-950',
      glow: 'shadow-[0_0_35px_rgba(16,185,129,0.3)]',
      textColor: 'text-emerald-200',
      badgeStyle: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-zinc-950 font-black',
      activeRing: 'ring-2 ring-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]',
      accentBar: 'bg-gradient-to-r from-emerald-400 to-teal-300',
      spotlight: 'bg-emerald-500/25',
    },
  },
  {
    id: 'medicine-finder',
    labelHi: 'कौन सी दवाई डालें?',
    labelEn: 'Which Medicine To Apply',
    subHi: 'फसल व रोग अनुसार सही डोज गाइड',
    subEn: 'Dosage & Weedicide Guide',
    badgeHi: 'रोग व मात्रा गाइड',
    badgeEn: 'Dosage Guide',
    icon: Stethoscope,
    emoji: '🩺',
    colorScheme: {
      bgGradient: 'from-orange-500/20 via-orange-950/60 to-[#0e0f14]',
      border: 'border-orange-500/50',
      hoverBorder: 'hover:border-orange-400',
      iconBoxBg: 'bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 text-black shadow-[0_0_22px_rgba(249,115,22,0.55)]',
      iconColor: 'text-zinc-950',
      glow: 'shadow-[0_0_35px_rgba(249,115,22,0.3)]',
      textColor: 'text-orange-200',
      badgeStyle: 'bg-gradient-to-r from-orange-500 to-amber-400 text-zinc-950 font-black',
      activeRing: 'ring-2 ring-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)]',
      accentBar: 'bg-gradient-to-r from-orange-400 to-amber-300',
      spotlight: 'bg-orange-500/25',
    },
  },
  {
    id: 'knowledge',
    labelHi: 'कृषि ज्ञान व सलाह',
    labelEn: 'Crop Knowledge',
    subHi: 'फसल सुरक्षा लेख व बुवाई टिप्स',
    subEn: 'Agronomy Advice & Guides',
    badgeHi: 'फसल सलाह',
    badgeEn: 'Field Library',
    icon: BookOpen,
    emoji: '🌾',
    colorScheme: {
      bgGradient: 'from-sky-500/20 via-blue-950/60 to-[#0e0f14]',
      border: 'border-sky-500/50',
      hoverBorder: 'hover:border-sky-400',
      iconBoxBg: 'bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-black shadow-[0_0_22px_rgba(14,165,233,0.55)]',
      iconColor: 'text-zinc-950',
      glow: 'shadow-[0_0_35px_rgba(14,165,233,0.3)]',
      textColor: 'text-sky-200',
      badgeStyle: 'bg-gradient-to-r from-sky-400 to-blue-400 text-zinc-950 font-black',
      activeRing: 'ring-2 ring-sky-400 shadow-[0_0_30px_rgba(14,165,233,0.5)]',
      accentBar: 'bg-gradient-to-r from-sky-400 to-blue-300',
      spotlight: 'bg-sky-500/25',
    },
  },
  {
    id: 'location',
    labelHi: 'दुकान स्थिति व पता',
    labelEn: 'Shop Location & GPS',
    subHi: 'लाइव दुकान रास्ता, समय व लाइसेंस',
    subEn: 'GPS Map & Business Hours',
    badgeHi: 'दुकान का पता',
    badgeEn: 'GPS Directions',
    icon: MapPin,
    emoji: '📍',
    colorScheme: {
      bgGradient: 'from-lime-500/20 via-lime-950/60 to-[#0e0f14]',
      border: 'border-lime-500/50',
      hoverBorder: 'hover:border-lime-400',
      iconBoxBg: 'bg-gradient-to-br from-lime-400 via-lime-500 to-emerald-600 text-black shadow-[0_0_22px_rgba(132,204,22,0.55)]',
      iconColor: 'text-zinc-950',
      glow: 'shadow-[0_0_35px_rgba(132,204,22,0.3)]',
      textColor: 'text-lime-200',
      badgeStyle: 'bg-gradient-to-r from-lime-400 to-emerald-400 text-zinc-950 font-black',
      activeRing: 'ring-2 ring-lime-400 shadow-[0_0_30px_rgba(132,204,22,0.5)]',
      accentBar: 'bg-gradient-to-r from-lime-400 to-emerald-300',
      spotlight: 'bg-lime-500/25',
    },
  },
];

export const LuxuryIconNav: React.FC<LuxuryIconNavProps> = ({
  language,
  onNavigate,
  activeSection = 'home',
  isSticky = false,
}) => {
  const isHindi = language === 'hi';
  const [currentActive, setCurrentActive] = useState(activeSection);

  useEffect(() => {
    setCurrentActive(activeSection);
  }, [activeSection]);

  const handleClick = (id: string) => {
    setCurrentActive(id);
    onNavigate(id);
  };

  // Sticky Floating Luxury Bar Mode (sticks as user scrolls down the website)
  if (isSticky) {
    return (
      <div className="w-full bg-[#0a0c12]/95 backdrop-blur-2xl border-b border-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.8)] py-2 sm:py-2.5 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
            <span className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-700/80 text-[11px] font-bold text-zinc-300 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{isHindi ? 'लग्जरी नेविगेशन:' : 'Luxury Rail:'}</span>
            </span>

            {NAV_ICONS.map((item) => {
              const Icon = item.icon;
              const isActive = currentActive === item.id;
              const cs = item.colorScheme;

              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`group relative flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 active:scale-95 ${
                    isActive
                      ? `bg-gradient-to-r ${cs.bgGradient} ${cs.border} ${cs.activeRing}`
                      : `bg-[#131622]/90 hover:bg-[#181c2d] border-zinc-800/80 ${cs.hoverBorder}`
                  }`}
                >
                  {/* Glowing 3D Icon Box */}
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${cs.iconBoxBg}`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${cs.iconColor}`} />
                  </div>

                  {/* Label */}
                  <div className="text-left">
                    <div
                      className={`text-xs sm:text-xs font-bold transition-colors ${
                        isActive ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                      }`}
                    >
                      {isHindi ? item.labelHi : item.labelEn}
                    </div>
                  </div>

                  {/* Tiny Status Dot */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // In-Flow Luxury Showcase Section (Directly beneath Hero/Slider)
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-[#08090e] via-[#0f121d] to-[#08090e] border-y border-zinc-800/80 relative overflow-hidden">
      {/* Dynamic Multi-color ambient background spotlights */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 left-10 w-80 h-40 bg-amber-500/15 blur-3xl rounded-full" />
        <div className="absolute top-0 left-1/3 w-80 h-40 bg-rose-500/15 blur-3xl rounded-full" />
        <div className="absolute top-0 left-2/3 w-80 h-40 bg-cyan-500/15 blur-3xl rounded-full" />
        <div className="absolute top-0 right-10 w-80 h-40 bg-emerald-500/15 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Ribbon with Luxury Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-[11px] font-bold text-zinc-300 mb-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{isHindi ? '⭐ लग्जरी स्क्रॉल पोर्टल — संपूर्ण कृषि सेवाएं' : '⭐ Luxury Portal — Complete Krishi Services'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-['Rozha_One',serif]">
              {isHindi ? 'हर सुविधा के लिए अलग-अलग विशेष रंग व आइकन्स' : 'Distinct Vibrant Categories & Quick Navigation'}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 px-3 py-1.5 rounded-xl border border-zinc-800 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHindi ? 'किसी भी आइकन पर क्लिक करें और सीधे पहुंचें' : 'Click any icon to jump down directly'}</span>
          </div>
        </div>

        {/* 7 Distinct Vibrant Luxury Icon Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {NAV_ICONS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentActive === item.id;
            const cs = item.colorScheme;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`group relative p-3.5 sm:p-4 rounded-3xl border transition-all duration-300 text-left flex flex-col justify-between cursor-pointer active:scale-95 ${
                  isActive
                    ? `bg-gradient-to-b ${cs.bgGradient} ${cs.border} ${cs.glow} scale-[1.03] ${cs.activeRing}`
                    : `bg-gradient-to-b from-[#131624] via-[#10131e] to-[#0c0d14] hover:bg-[#181c2f] border-zinc-800/90 ${cs.hoverBorder} hover:shadow-2xl hover:-translate-y-1`
                }`}
              >
                {/* Subtle internal colorful glow */}
                <div
                  className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 opacity-20 group-hover:opacity-60 ${cs.spotlight}`}
                />

                {/* Top Row: 3D Glossy Icon Box + Emoji */}
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${cs.iconBoxBg}`}
                  >
                    <Icon className={`w-6 h-6 ${cs.iconColor}`} />
                  </div>
                  <span className="text-xl sm:text-2xl select-none filter drop-shadow group-hover:scale-125 transition-transform">
                    {item.emoji}
                  </span>
                </div>

                {/* Badge Tag */}
                <div className="mb-2 relative z-10">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider ${cs.badgeStyle}`}
                  >
                    {isHindi ? item.badgeHi : item.badgeEn}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="relative z-10 mb-2">
                  <div
                    className={`text-sm sm:text-base font-extrabold tracking-tight transition-colors line-clamp-1 ${
                      isActive ? 'text-white' : 'text-zinc-100 group-hover:text-white'
                    }`}
                  >
                    {isHindi ? item.labelHi : item.labelEn}
                  </div>
                  <div className={`text-[11px] sm:text-xs font-medium leading-snug line-clamp-2 mt-0.5 ${cs.textColor}`}>
                    {isHindi ? item.subHi : item.subEn}
                  </div>
                </div>

                {/* Bottom Bar: Action Indicator & Colored Line */}
                <div className="relative z-10 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                  <span className="font-semibold">{isHindi ? 'खोलें' : 'Explore'}</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[11px] font-mono text-zinc-500">#{idx + 1}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Dynamic Bottom Accent Line */}
                <div
                  className={`mt-2 h-1 w-full rounded-full transition-all duration-300 ${
                    isActive ? cs.accentBar : 'bg-transparent group-hover:bg-zinc-700/60'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
