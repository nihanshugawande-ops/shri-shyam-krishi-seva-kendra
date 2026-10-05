import React, { useState } from 'react';
import { Menu, X, Shield, Phone, ShoppingBag, Globe, Clock, ShieldCheck } from 'lucide-react';
import { StoreSettings, Language } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  onOpenCart: () => void;
  cartCount: number;
  language: Language;
  onOpenLanguageModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onOpenCart,
  cartCount,
  language,
  onOpenLanguageModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHindi = language === 'hi';

  const navLinks = isHindi
    ? [
        { label: 'होम', href: '#home', emoji: '🏠', color: 'text-amber-300 group-hover:text-amber-200' },
        { label: 'दवाइयां', href: '#products', emoji: '💊', color: 'text-rose-400 group-hover:text-rose-300' },
        { label: 'AI डॉक्टर', href: '#ai-help', emoji: '🤖', color: 'text-cyan-400 group-hover:text-cyan-300' },
        { label: 'हेल्प सेंटर', href: '#help-center', emoji: '💬', color: 'text-emerald-400 group-hover:text-emerald-300' },
        { label: 'कौन सी दवाई डालें', href: '#medicine-finder', emoji: '🩺', color: 'text-orange-400 group-hover:text-orange-300' },
        { label: 'कृषि ज्ञान', href: '#knowledge', emoji: '🌾', color: 'text-sky-400 group-hover:text-sky-300' },
        { label: 'दुकान स्थिति', href: '#location', emoji: '📍', color: 'text-lime-400 group-hover:text-lime-300' },
      ]
    : [
        { label: 'Home', href: '#home', emoji: '🏠', color: 'text-amber-300' },
        { label: 'Medicines', href: '#products', emoji: '💊', color: 'text-rose-400' },
        { label: 'AI Doctor', href: '#ai-help', emoji: '🤖', color: 'text-cyan-400' },
        { label: 'Help Center', href: '#help-center', emoji: '💬', color: 'text-emerald-400' },
        { label: 'Medicine Guide', href: '#medicine-finder', emoji: '🩺', color: 'text-orange-400' },
        { label: 'Crop Advice', href: '#knowledge', emoji: '🌾', color: 'text-sky-400' },
        { label: 'Location', href: '#location', emoji: '📍', color: 'text-lime-400' },
      ];

  const shopTitle = isHindi ? settings.shopName : (settings.shopNameEn || settings.shopName);
  const hoursText = isHindi
    ? settings.businessHours || 'सुबह 07:00 बजे से रात 08:00 बजे तक (प्रतिदिन खुला)'
    : settings.businessHoursEn || '07:00 AM to 08:00 PM (Open All Days)';
  const phone = settings.officialPhone || '+91 81204 64749';

  return (
    <>
      {/* Top Status & Timing Strip */}
      <div className="bg-[#0b0c10] border-b border-zinc-800/80 px-4 py-1.5 text-center text-xs text-zinc-300 flex items-center justify-between gap-2 max-w-7xl mx-auto overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white">
            {isHindi ? 'दुकान समय:' : 'Hours:'}
          </span>
          <span className="text-zinc-300">{hoursText}</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-zinc-300 truncate max-w-xs">
              {settings.licenseNumber || 'अनुज्ञप्ति क्र. MP/AGRI-LIC-7892/2024'}
            </span>
          </div>

          <a
            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono font-bold"
          >
            <Phone className="w-3 h-3" />
            <span>{phone}</span>
          </a>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#12141a]/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Zone 1: Single text wordmark with subtle luxury accent */}
          <a
            href="#home"
            className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white hover:text-zinc-200 transition-colors whitespace-nowrap font-['Rozha_One',serif]"
          >
            {shopTitle}
          </a>

          {/* Zone 2: Luxury distinct navigation links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-zinc-300">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-zinc-800/80 transition-all text-zinc-300 hover:text-white"
              >
                <span className="text-sm select-none filter drop-shadow group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <span className={`transition-colors ${item.color}`}>
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Actions (Language, Cart, Call, Admin) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Trigger */}
            <button
              onClick={onOpenLanguageModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
              title="भाषा बदलें / Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isHindi ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all cursor-pointer active:scale-95"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{isHindi ? 'कार्ट' : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-black tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Call */}
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{phone}</span>
            </a>

            {/* Admin Action */}
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdminDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-all whitespace-nowrap cursor-pointer active:scale-95"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHindi ? 'डैशबोर्ड' : 'Dashboard'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                title="व्यवस्थापक लॉगिन"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isHindi ? 'एडमिन' : 'Admin'}</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-zinc-800 bg-[#14161f] px-4 pt-3 pb-6 space-y-1.5">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <span className="text-base">{item.emoji}</span>
                <span className={item.color}>{item.label}</span>
              </a>
            ))}

            <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLanguageModal();
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-zinc-300 bg-zinc-900 rounded-lg border border-zinc-800"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>भाषा बदलें (Change Language)</span>
                </span>
                <span className="font-bold text-white">{isHindi ? 'हिंदी' : 'English'}</span>
              </button>

              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-zinc-800 rounded-lg border border-zinc-700"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{phone} (कॉल करें)</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
