import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WhiteCurtainIntroProps {
  onComplete: () => void;
  shopName?: string;
  tagline?: string;
}

export const WhiteCurtainIntro: React.FC<WhiteCurtainIntroProps> = ({
  onComplete,
  shopName = 'श्री श्याम कृषि सेवा केंद्र',
  tagline = 'कृषि एवं फसल सुरक्षा समाधान',
}) => {
  const [stage, setStage] = useState<'showing' | 'opening' | 'finished'>('showing');

  useEffect(() => {
    // Elegant theatrical timing: 2.2 seconds presentation, then curtains part
    const timer = setTimeout(() => {
      setStage('opening');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setStage('opening');
    setTimeout(() => {
      setStage('finished');
      onComplete();
    }, 400);
  };

  const handleAnimationEnd = () => {
    if (stage === 'opening') {
      setStage('finished');
      onComplete();
    }
  };

  if (stage === 'finished') return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden pointer-events-auto transition-opacity duration-700 ${
        stage === 'opening' ? 'pointer-events-none' : ''
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* Subtle Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-700 bg-white/95 hover:bg-white hover:text-black rounded-full border border-zinc-300 shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
      >
        <span>Skip Intro / सीधे देखें</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Left White Theatrical Curtain Panel */}
      <div
        onTransitionEnd={handleAnimationEnd}
        className={`absolute top-0 left-0 w-1/2 h-full bg-[#FFFFFF] border-r border-zinc-200 shadow-[25px_0_50px_rgba(0,0,0,0.18)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          stage === 'opening' ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(90deg, #F8F9FA 0%, #FFFFFF 85%, #E9ECEF 100%),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.015) 40px, rgba(0,0,0,0.015) 80px)
          `,
        }}
      >
        {/* Soft theatrical depth shadow at center split */}
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-400/35 to-transparent" />
      </div>

      {/* Right White Theatrical Curtain Panel */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-[#FFFFFF] border-l border-zinc-200 shadow-[-25px_0_50px_rgba(0,0,0,0.18)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          stage === 'opening' ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(270deg, #F8F9FA 0%, #FFFFFF 85%, #E9ECEF 100%),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.015) 40px, rgba(0,0,0,0.015) 80px)
          `,
        }}
      >
        {/* Soft theatrical depth shadow at center split */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-400/35 to-transparent" />
      </div>

      {/* Centered Theatrical Showroom Brand Seal & Typography */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 px-6 ${
          stage === 'opening' ? 'opacity-0 scale-95 -translate-y-3' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Luxury Obsidian-Gold Monogram Badge */}
        <div className="mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-950 text-white flex flex-col items-center justify-center shadow-2xl border-2 border-zinc-700/80">
          <Sparkles className="w-5 h-5 text-amber-300 mb-0.5" />
          <span className="text-base sm:text-lg font-extrabold tracking-tight font-['Rozha_One',serif]">श्याम</span>
        </div>

        {/* Shop Name in Hindi */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 text-center drop-shadow-sm font-['Rozha_One',serif] max-w-2xl leading-tight">
          {shopName}
        </h1>

        {/* Charcoal Accent Divider */}
        <div className="w-24 h-0.5 my-4 bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />

        {/* Tagline */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-600 font-semibold tracking-wide text-center max-w-lg">
          {tagline}
        </p>

        {/* Owner Credit */}
        <div className="mt-3 text-xs sm:text-sm text-zinc-500 font-medium">
          स्वामी — कार्तिक गावंडे (Kartick Gawande) · +91 81204 64749
        </div>

        {/* Theatrical entry indicator */}
        <div className="mt-8 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
          <span className="text-xs text-zinc-500 tracking-wider font-semibold uppercase">
            प्रीमियम डिजिटल स्टोर खुल रहा है...
          </span>
        </div>
      </div>
    </div>
  );
};
