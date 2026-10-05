import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Poster, Language } from '../types';

interface PosterSliderProps {
  posters: Poster[];
  onSelectAction?: (link?: string) => void;
  language: Language;
}

export const PosterSlider: React.FC<PosterSliderProps> = ({ posters, onSelectAction, language }) => {
  const activePosters = posters.filter((p) => p.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHindi = language === 'hi';

  useEffect(() => {
    if (activePosters.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePosters.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activePosters.length, isHovered]);

  if (activePosters.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activePosters.length) % activePosters.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activePosters.length);
  };

  const currentPoster = activePosters[currentIndex];
  const title = isHindi ? currentPoster.title : (currentPoster.titleEn || currentPoster.title);
  const subtitle = isHindi ? currentPoster.subtitle : (currentPoster.subtitleEn || currentPoster.subtitle);
  const buttonText = isHindi ? currentPoster.buttonText : (currentPoster.buttonTextEn || currentPoster.buttonText);

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#16181f] shadow-2xl">
        {/* Banner Slide */}
        <div className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[320px] flex items-center p-6 sm:p-10 md:p-14 bg-gradient-to-r from-zinc-950 via-[#181a22] to-[#121316] transition-all duration-700">
          {currentPoster.image && (
            <img
              src={currentPoster.image}
              alt={title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
            />
          )}

          {/* Text and Actions */}
          <div className="relative z-10 max-w-2xl">
            <div className="text-xs uppercase font-semibold tracking-wider text-zinc-400 mb-2">
              {isHindi ? 'विशेष परामर्श एवं प्रचारक सूचना' : 'Featured Agriculture Advisory'}
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug font-['Rozha_One',serif]">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
              {subtitle}
            </p>

            {buttonText && (
              <div className="mt-6">
                <a
                  href={currentPoster.buttonLink || '#products'}
                  onClick={() => onSelectAction?.(currentPoster.buttonLink)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Navigation controls */}
        {activePosters.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {activePosters.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
