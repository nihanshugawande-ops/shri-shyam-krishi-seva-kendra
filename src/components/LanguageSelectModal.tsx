import React from 'react';
import { Language } from '../types';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onSelect: (lang: Language) => void;
  currentLanguage: Language;
  onClose?: () => void;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onSelect,
  currentLanguage,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#181a20] border border-zinc-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto mb-5 text-zinc-300">
          <Globe className="w-7 h-7 text-zinc-200" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Rozha_One',serif]">
          भाषा चुनें / Choose Language
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-zinc-400">
          कृपया अपनी पसंदीदा भाषा का चयन करें
          <br />
          <span className="text-zinc-500">Please select your preferred browsing language</span>
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onSelect('hi')}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
              currentLanguage === 'hi'
                ? 'bg-zinc-800 border-zinc-500 text-white shadow-lg'
                : 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300 hover:border-zinc-500 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇮🇳</span>
              <div>
                <div className="text-base font-bold">हिंदी</div>
                <div className="text-[11px] text-zinc-400">Hindi</div>
              </div>
            </div>
            {currentLanguage === 'hi' && <Check className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            onClick={() => onSelect('en')}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
              currentLanguage === 'en'
                ? 'bg-zinc-800 border-zinc-500 text-white shadow-lg'
                : 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300 hover:border-zinc-500 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <div>
                <div className="text-base font-bold">English</div>
                <div className="text-[11px] text-zinc-400">अंग्रेजी</div>
              </div>
            </div>
            {currentLanguage === 'en' && <Check className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline cursor-pointer"
          >
            बंद करें / Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
