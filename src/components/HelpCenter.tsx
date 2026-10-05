import React, { useState } from 'react';
import {
  Headphones,
  PhoneCall,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Send,
  HelpCircle,
  Truck,
  MapPin,
  Award,
  ChevronDown,
} from 'lucide-react';
import { StoreSettings, Language } from '../types';

interface HelpCenterProps {
  settings: StoreSettings;
  language: Language;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ settings, language }) => {
  const isHindi = language === 'hi';
  const cleanPhone = (settings.officialPhone || '+918120464749').replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (settings.whatsapp || settings.officialPhone || '918120464749').replace(
    /[^0-9]/g,
    ''
  );

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [farmerName, setFarmerName] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [farmerQuery, setFarmerQuery] = useState('');

  const faqs = isHindi
    ? [
        {
          q: 'क्या दुकान पर सभी ब्रांडेड कंपनियों (Bayer, Syngenta, FMC, UPL) की असली दवाइयाँ मिलती हैं?',
          a: 'हाँ! श्री श्याम कृषि सेवा केंद्र सरकार द्वारा अधिकृत व प्रमाणित कृषि रसायन विक्रेता है। यहाँ शत-प्रतिशत मूल (Original GST बिल सहित) बीज, खाद व कीटनाशक मिलते हैं।',
        },
        {
          q: 'क्या दुकान पर आने से पहले फोन या व्हाट्सएप पर दवाई का स्टॉक पूछ सकते हैं?',
          a: 'बिल्कुल! आप सीधे 81204-64749 पर कॉल या व्हाट्सएप करके किसी भी दवाई (जैसे 2,4-D, नैटिवो, कोराजन) का रेट व उपलब्धता जान सकते हैं।',
        },
        {
          q: 'फसल में रोग या खरपतवार का नाम नहीं पता, तो क्या करें?',
          a: 'आप हमारी वेबसाइट के AI फसल डॉक्टर में फोटो अपलोड कर सकते हैं, या सीधे व्हाट्सएप पर पौधे/पत्ती की फोटो भेजकर स्वामी कार्तिक गावंडे जी से निःशुल्क परामर्श ले सकते हैं।',
        },
        {
          q: 'दुकान किस समय खुली रहती है?',
          a: settings.businessHours || 'दुकान प्रतिदिन सुबह 07:00 बजे से रात्रि 08:00 बजे तक खुली रहती है (रविवार को भी खुली रहती है)।',
        },
        {
          q: 'क्या घर या खेत तक दवाई मंगवाने की सुविधा उपलब्ध है?',
          a: 'हाँ, निकटवर्ती गांवों एवं खेतों में तत्काल डिलीवरी हेतु आप वेबसाइट पर कार्ट में आर्डर दें या सीधे व्हाट्सएप पर अपनी सूची भेजें।',
        },
      ]
    : [
        {
          q: 'Are all medicines 100% genuine from top brands like Bayer, FMC, Syngenta?',
          a: 'Yes! Shree Shyam Krishi Seva Kendra is an authorized government-licensed dealer providing original products with valid GST bills.',
        },
        {
          q: 'Can I check medicine stock via call or WhatsApp before visiting?',
          a: 'Yes! Call or message +91 81204 64749 anytime to verify stock and pricing for any crop solution.',
        },
        {
          q: 'What if I do not know the exact weed or disease name?',
          a: 'Upload a leaf photo to our AI Crop Doctor or send it directly on WhatsApp for instant identification and correct dosage recommendation.',
        },
        {
          q: 'What are the store hours?',
          a: settings.businessHoursEn || 'Open every day from 07:00 AM to 08:00 PM (including Sundays).',
        },
      ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerQuery.trim()) return;

    const message = `🌾 *श्री श्याम कृषि सेवा केंद्र - किसान सहायता पूछताछ*\n\n👤 *किसान का नाम:* ${farmerName || 'सम्मानित किसान'}\n📍 *गांव/स्थान:* ${farmerVillage || 'अस्पष्ट'}\n❓ *समस्या/प्रश्न:* ${farmerQuery}\n\nकृपया मार्गदर्शन एवं दवाई की जानकारी दें।`;
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    setFarmerQuery('');
  };

  return (
    <section
      id="help-center"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#080d0a] via-[#0d1612] to-[#080d0a] border-t border-emerald-900/50 relative overflow-hidden"
    >
      {/* Vivid Emerald Luxury Ambient Spheres */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-teal-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header with Vivid Emerald Theme */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-[0_0_25px_rgba(16,185,129,0.25)] mb-3">
            <Headphones className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{isHindi ? '💬 24×7 किसान हेल्प सेंटर (Customer Support)' : '💬 24x7 Farmer Help Desk'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Rozha_One',serif]">
            {isHindi ? 'सीधा संपर्क एवं किसान सहायता केंद्र' : 'Direct Helpline & Farmer Support'}
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? 'फसल में कोई भी रोग, कीड़ा, खरपतवार हो या सही दवाई व खाद की सलाह चाहिए — हमारे कृषि विशेषज्ञ स्वामी कार्तिक गावंडे जी से तुरंत फोन या व्हाट्सएप पर बात करें।'
              : 'Direct helpline for crop disease advisory, medicine availability, quick doorstep delivery, and authentic government license verification.'}
          </p>
        </div>

        {/* 3 Prominent Quick Action Cards with Luxury Emerald Glow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
          {/* Card 1: Direct Phone Helpline */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-emerald-950/40 via-[#0e1713] to-[#0a100d] border border-emerald-500/30 hover:border-emerald-400 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-1">
                {isHindi ? 'तत्काल फोन हेल्पलाइन' : 'Direct Phone Helpline'}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {settings.officialPhone || '+91 81204 64749'}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                {isHindi
                  ? 'दुकानदार स्वामी कार्तिक गावंडे जी से सीधे फोन पर बात करके फसल रोग एवं दवाई की सही सलाह लें।'
                  : 'Speak directly with owner Kartick Gawande for agronomist consultation and instant assistance.'}
              </p>
            </div>
            <a
              href={`tel:${cleanPhone}`}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{isHindi ? 'अभी कॉल करें (Call Now)' : 'Call Now'}</span>
            </a>
          </div>

          {/* Card 2: 1-Click WhatsApp Support */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-teal-950/40 via-[#0e1713] to-[#0a100d] border border-teal-500/30 hover:border-teal-400 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-900/60 border border-teal-500/40 flex items-center justify-center text-teal-300 mb-4 shadow-[0_0_20px_rgba(20,184,166,0.2)] group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-bold text-teal-400 tracking-wider mb-1">
                {isHindi ? 'व्हाट्सएप चैट व फोटो भेजें' : 'WhatsApp Chat & Photo'}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {settings.whatsapp || settings.officialPhone || '+91 81204 64749'}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                {isHindi
                  ? 'खेत से पत्ती, खरपतवार या कीड़े की फोटो व्हाट्सएप पर भेजें और 5 मिनट में सटीक दवाई की जानकारी पाएं।'
                  : 'Send crop leaf photos directly on WhatsApp for instant technical advice and dosage formulas.'}
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('नमस्ते श्री श्याम कृषि सेवा केंद्र, मुझे अपनी फसल के लिए दवाई परामर्श व जानकारी चाहिए।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-black" />
              <span>{isHindi ? 'व्हाट्सएप पर पूछें (WhatsApp)' : 'Chat on WhatsApp'}</span>
            </a>
          </div>

          {/* Card 3: Store Timing & Physical Verification */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-amber-950/30 via-[#0e1713] to-[#0a100d] border border-amber-500/30 hover:border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-1">
                {isHindi ? 'दुकान समय व अनुज्ञप्ति' : 'Store Hours & License'}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {isHindi ? 'प्रतिदिन प्रातः 07:00 से 08:00 रात्रि' : '07:00 AM - 08:00 PM Daily'}
              </h3>
              <div className="text-xs text-zinc-300 space-y-1 mb-4">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold text-white">
                    {settings.licenseNumber || 'अधिकृत कृषि रसायन अनुज्ञप्ति'}
                  </span>
                </div>
                <div className="text-zinc-400 text-[11px]">
                  {isHindi ? 'स्वामी: कार्तिक गावंडे' : 'Owner: Kartick Gawande'}
                </div>
              </div>
            </div>
            <a
              href="#location"
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-zinc-700 active:scale-95 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{isHindi ? 'दुकान का रास्ता देखें (GPS Map)' : 'View Shop Map'}</span>
            </a>
          </div>
        </div>

        {/* 2 Columns: Quick WhatsApp Query Form & FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Query Box */}
          <div className="lg:col-span-5 rounded-3xl p-6 bg-[#0f1813] border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-base font-bold text-white">
                {isHindi ? 'सीधे व्हाट्सएप पर प्रश्न भेजें' : 'Send WhatsApp Question'}
              </h4>
            </div>

            <p className="text-xs text-zinc-300 mb-5 leading-relaxed">
              {isHindi
                ? 'नीचे अपनी फसल व समस्या लिखें। बटन दबाते ही यह विवरण सीधे दुकानदार के व्हाट्सएप पर खुल जाएगा।'
                : 'Write your crop query below to open a formatted consultation on WhatsApp immediately.'}
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {isHindi ? 'आपका नाम (Farmer Name)' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder={isHindi ? 'उदा. रामेश्वर पटेल' : 'e.g. Rameshwar Patel'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {isHindi ? 'गांव / क्षेत्र (Village / Area)' : 'Village / Location'}
                </label>
                <input
                  type="text"
                  value={farmerVillage}
                  onChange={(e) => setFarmerVillage(e.target.value)}
                  placeholder={isHindi ? 'उदा. ग्राम बड़ोदिया' : 'e.g. Badodiya Village'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  {isHindi ? 'फसल की समस्या या दवाई का नाम (Crop Problem / Query)' : 'Problem or Medicine Name'}
                </label>
                <textarea
                  rows={3}
                  value={farmerQuery}
                  onChange={(e) => setFarmerQuery(e.target.value)}
                  placeholder={
                    isHindi
                      ? 'उदा. गेहूं में बथुआ और चौड़ी पत्ती खरपतवार हैं, 2,4-D का सही डोज बताएं या गेहूं में पीलापन आ रहा है...'
                      : 'e.g. Broadleaf weeds in wheat, need 2,4-D dosage and price...'
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isHindi ? 'व्हाट्सएप पर भेजें (Send on WhatsApp)' : 'Send to Shop WhatsApp'}</span>
              </button>
            </form>
          </div>

          {/* Frequently Asked Questions */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <h4 className="text-base font-bold text-white">
                {isHindi ? 'अक्सर पूछे जाने वाले सवाल (Farmer FAQs)' : 'Frequently Asked Questions'}
              </h4>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#0f1713] border border-emerald-900/40 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-white hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-[11px] text-emerald-400 shrink-0">
                          {idx + 1}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-zinc-300 border-t border-emerald-950/60 leading-relaxed bg-[#0b120e]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
