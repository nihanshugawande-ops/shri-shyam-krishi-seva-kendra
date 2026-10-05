import React from 'react';
import { ArrowDown, BookOpen, MapPin, ShieldCheck, Clock, Phone, Sparkles, Zap, Award, CheckCircle2 } from 'lucide-react';
import { StoreSettings, Language } from '../types';

interface HeroProps {
  settings: StoreSettings;
  onExploreProducts: () => void;
  onExploreKnowledge: () => void;
  onContactClick: () => void;
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreProducts,
  onExploreKnowledge,
  onContactClick,
  language,
}) => {
  const isHindi = language === 'hi';

  const heading = isHindi ? settings.shopName : settings.shopNameEn || settings.shopName;
  const subheading = isHindi ? settings.heroSubheading : settings.heroSubheadingEn || settings.heroSubheading;
  const ownerName = isHindi ? settings.ownerName : settings.ownerNameEn || settings.ownerName;
  const hours = isHindi
    ? settings.businessHours || 'सुबह 07:00 बजे से रात 08:00 बजे तक (प्रतिदिन खुला)'
    : settings.businessHoursEn || '07:00 AM to 08:00 PM (Open All Days)';
  const license = settings.licenseNumber || 'अधिकृत कृषि रसायन एवं बीज विक्रय अनुज्ञप्ति क्र. MP/AGRI-LIC-7892/2024';

  return (
    <section id="home" className="relative min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden bg-gradient-to-b from-[#061911] via-[#0a2318] to-[#081824]">
      {/* Ultra-Luxury Ambient Multi-Layered Atmosphere with Green, Royal Blue, Warm Brown, and Sky Blue */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dominant Emerald Green mesh spotlight */}
        <div className="absolute -top-32 left-1/4 w-[850px] h-[500px] bg-gradient-to-b from-emerald-500/20 via-teal-700/10 to-transparent rounded-full blur-[140px] opacity-90" />
        {/* Royal Sapphire Blue spotlight */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[550px] bg-gradient-to-br from-blue-600/15 via-indigo-900/10 to-transparent rounded-full blur-[140px]" />
        {/* Warm Earthy Brown / Bronze glow */}
        <div className="absolute bottom-10 left-10 w-[500px] h-[450px] bg-amber-700/15 rounded-full blur-[130px]" />
        {/* Luminous Sky Blue ambient hint */}
        <div className="absolute -bottom-10 right-1/3 w-[450px] h-[400px] bg-sky-500/10 rounded-full blur-[120px]" />

        {/* Sophisticated fine architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Deep rich bottom blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#071911]/40 to-[#071911]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Badges, CTAs */}
          <div className="lg:col-span-7">
            {/* Top Luxury Kicker Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-zinc-900/95 via-zinc-800/90 to-zinc-900/95 border border-amber-500/30 text-amber-200 text-xs font-semibold shadow-[0_4px_20px_rgba(217,119,6,0.15)] backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="tracking-wide">
                  {isHindi ? 'शासकीय अनुज्ञप्ति क्र. MP/AGRI-LIC-7892/2024' : 'Authorized License MP/AGRI-LIC-7892/2024'}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isHindi ? 'सुबह 7 से रात 8 (प्रतिदिन खुला)' : '7 AM - 8 PM Daily'}</span>
              </div>
            </div>

            {/* Monumental Store Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-['Rozha_One',serif] drop-shadow-2xl">
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                {heading}
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 sm:mt-5 text-base sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-2xl drop-shadow">
              {subheading}
            </p>

            {/* Enterprise Owner Credential Bar */}
            <div className="mt-5 inline-flex flex-wrap items-center gap-3 p-2.5 px-4 rounded-2xl bg-[#12141c]/90 border border-zinc-800 shadow-xl text-xs sm:text-sm text-zinc-300 backdrop-blur-md">
              <span className="text-zinc-500 uppercase tracking-wider text-[11px] font-semibold">
                {isHindi ? 'प्रतिष्ठान स्वामी:' : 'Enterprise Owner:'}
              </span>
              <span className="font-bold text-white text-sm sm:text-base">
                {ownerName}
              </span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <a
                href={`tel:${(settings.officialPhone || '+918120464749').replace(/[^0-9+]/g, '')}`}
                className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.officialPhone || '+91 81204 64749'}</span>
              </a>
            </div>

            {/* Action Buttons with distinct luxury colors */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              {/* Primary: Browse & Order (Emerald & Gold) */}
              <button
                onClick={onExploreProducts}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-[0_8px_25px_rgba(16,185,129,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer border border-emerald-400/40"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{isHindi ? 'दवाइयाँ देखें व खरीदें' : 'Browse Medicines & Order'}</span>
              </button>

              {/* AI Doctor (Cyan/Violet) */}
              <a
                href="#ai-help"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-cyan-200 hover:text-white bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 hover:from-cyan-900/90 hover:to-indigo-900/90 rounded-xl border border-cyan-500/40 shadow-[0_4px_20px_rgba(6,182,212,0.25)] transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>{isHindi ? 'AI फसल डॉक्टर' : 'AI Crop Doctor'}</span>
              </a>

              {/* Medicine Finder (Sunset Orange) */}
              <a
                href="#medicine-finder"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-orange-200 hover:text-white bg-gradient-to-r from-orange-950/80 to-amber-950/80 hover:from-orange-900/90 hover:to-amber-900/90 rounded-xl border border-orange-500/40 shadow-[0_4px_20px_rgba(249,115,22,0.25)] transition-all active:scale-95 cursor-pointer"
              >
                <span>🩺</span>
                <span>{isHindi ? 'कौन सी दवाई डालें?' : 'Medicine Guide'}</span>
              </a>

              {/* Help Center (Emerald) */}
              <a
                href="#help-center"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-emerald-200 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/70 rounded-xl border border-emerald-600/40 transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{isHindi ? 'हेल्प सेंटर' : 'Help Center'}</span>
              </a>
            </div>

            {/* Micro Trust Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% प्रामाणिक बिलिंग</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>तत्काल UPI पेमेंट (PhonePe / GPay)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>निःशुल्क विशेषज्ञ परामर्श</span>
              </div>
            </div>
          </div>

          {/* Right Column: Luxury Showcase Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0e291c] via-[#0b1e2c] to-[#071711] border border-emerald-500/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(16,185,129,0.3)] backdrop-blur-xl">
              {/* Luxury Card Top Badge */}
              <div className="flex items-center justify-between pb-5 border-b border-emerald-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">
                      प्रमाणित कृषि केंद्र
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      श्री श्याम कृषि सेवा केंद्र
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-[10px] font-extrabold text-emerald-300 font-mono tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  VERIFIED
                </div>
              </div>

              {/* Showcase Highlights List */}
              <div className="py-5 space-y-3.5 text-xs text-zinc-200">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#091b14]/80 border border-emerald-700/40 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-xs">अधिकृत शासकीय अनुज्ञप्ति</div>
                    <div className="text-emerald-200/80 text-[11px] mt-0.5 leading-snug">
                      {license}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#091e2b]/80 border border-sky-700/40 shadow-sm">
                  <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-xs">दुकान समय (प्रतिदिन खुला)</div>
                    <div className="text-sky-300 text-[11px] font-semibold mt-0.5">
                      {hours}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#241307]/80 border border-amber-700/40 shadow-sm">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-xs">ऑनलाइन UPI एवं डिजिटल ऑर्डर</div>
                    <div className="text-amber-200/80 text-[11px] mt-0.5">
                      PhonePe, Google Pay, Paytm अथवा नकद भुगतान
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Call & WhatsApp Strip */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                <a
                  href={`tel:${(settings.officialPhone || '+918120464749').replace(/[^0-9+]/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>कॉल करें</span>
                </a>

                <a
                  href={`https://wa.me/${(settings.whatsapp || settings.officialPhone || '+918120464749').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white transition-colors"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
