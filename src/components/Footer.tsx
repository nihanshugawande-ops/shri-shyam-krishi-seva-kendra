import React from 'react';
import { StoreSettings, Language } from '../types';
import { ShieldCheck, Clock, Phone, MessageCircle, Mail, Sparkles, Code2 } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdminLogin: () => void;
  onReplayIntro?: () => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdminLogin,
  onReplayIntro,
  language,
}) => {
  const currentYear = new Date().getFullYear();
  const isHindi = language === 'hi';

  const shopName = isHindi ? settings.shopName : (settings.shopNameEn || settings.shopName);
  const ownerName = isHindi ? settings.ownerName : (settings.ownerNameEn || settings.ownerName);
  const hoursText = isHindi
    ? settings.businessHours || 'सुबह 07:00 बजे से रात 08:00 बजे तक (प्रतिदिन खुला)'
    : settings.businessHoursEn || '07:00 AM to 08:00 PM (Open All Days)';
  const licenseText = settings.licenseNumber || 'अधिकृत कृषि रसायन एवं बीज विक्रय अनुज्ञप्ति क्र. MP/AGRI-LIC-7892/2024';

  const cleanPhone = (settings.officialPhone || '+918120464749').replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (settings.whatsapp || settings.officialPhone || '+918120464749').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#0b0c10] text-zinc-400 border-t border-zinc-800/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand & Owner Information */}
          <div className="md:col-span-5">
            <h3 className="text-xl font-bold text-white tracking-tight font-['Rozha_One',serif]">
              {shopName}
            </h3>
            <p className="text-sm text-zinc-300 mt-1 font-semibold flex items-center gap-2">
              <span>{isHindi ? 'प्रतिष्ठान स्वामी — ' : 'Enterprise Owner — '}</span>
              <span className="text-white">{ownerName}</span>
            </p>

            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
              {isHindi
                ? 'किसानों के लिए भरोसेमंद कृषि एवं फसल सुरक्षा समाधान। प्रमाणित कीटनाशक, फफूंदनाशक, खरपतवारनाशक एवं उन्नत फसल पोषण उत्पाद।'
                : 'Reliable crop protection, certified fertilizers, hybrid seeds, and professional agronomic guidance for farming communities.'}
            </p>

            {/* Official Contact Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings.officialPhone || '+91 81204 64749'}</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.whatsapp || settings.officialPhone || '+91 81204 64749'}</span>
              </a>
            </div>

            {/* Shop Govt License Badge */}
            <div className="mt-4 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 max-w-md">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isHindi ? 'शासकीय अनुज्ञप्ति (Govt License)' : 'Authorized Govt License'}</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 leading-snug">
                {licenseText}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">
              {isHindi ? 'त्वरित नेविगेशन' : 'Quick Navigation'}
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  {isHindi ? 'होम पेज (Home)' : 'Home'}
                </a>
              </li>
              <li>
                <a href="#featured" className="hover:text-white transition-colors">
                  {isHindi ? 'प्रमुख उत्पाद (Featured Products)' : 'Featured Products'}
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  {isHindi ? 'कृषि दवाइयाँ व श्रेणियां (Catalog)' : 'Products Catalog'}
                </a>
              </li>
              <li>
                <a href="#knowledge" className="hover:text-white transition-colors">
                  {isHindi ? 'कृषि ज्ञान केंद्र (Knowledge)' : 'Knowledge Center'}
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">
                  {isHindi ? 'दुकान का स्थान व नेविगेशन (Location)' : 'Shop Location & GPS'}
                </a>
              </li>
              {onReplayIntro && (
                <li className="pt-2">
                  <button
                    onClick={onReplayIntro}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isHindi ? 'व्हाइट कर्टेन इंट्रो पुनः देखें' : 'Replay White Curtain Intro'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Store Info & Admin Access */}
          <div className="md:col-span-4">
            <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-4">
              {isHindi ? 'दुकान समय एवं पोर्टल' : 'Operating Hours & Portal'}
            </div>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-zinc-500 text-[11px] uppercase tracking-wider">{isHindi ? 'कार्य समय:' : 'Store Hours:'}</div>
                  <div className="text-white font-medium">{hoursText}</div>
                </div>
              </li>
              <li className="text-zinc-400">
                <span className="text-zinc-500 text-[11px] block uppercase tracking-wider">{isHindi ? 'पता:' : 'Address:'}</span>
                <span className="text-zinc-300">{settings.address || 'कृषि उपज मंडी मुख्य द्वार के पास, बस स्टैंड रोड'}</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdminLogin}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white border border-zinc-800 transition-colors font-medium cursor-pointer"
                >
                  {isHindi ? '🔐 व्यवस्थापक पोर्टल (Admin Portal)' : '🔐 Admin Portal'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Co-Founder & Web Development Credits Section (Prominently Highlighted as requested) */}
        <div className="pt-6 pb-6 border-t border-zinc-800/80 bg-zinc-950/40 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-zinc-400 uppercase font-semibold tracking-wider">
                {isHindi ? 'वेबसाइट निर्माण एवं तकनीकी सह-संस्थापक (Co-Founder & Web Partner)' : 'Website Crafted & Tech Co-Founder'}
              </div>
              <div className="text-sm font-bold text-white">
                {settings.developerName || 'Nexa'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${settings.developerEmail || 'nexa.com.in21@gmail.com'}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow cursor-pointer active:scale-95"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.developerEmail || 'nexa.com.in21@gmail.com'}</span>
            </a>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {currentYear} {shopName} · {isHindi ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>{isHindi ? 'अधिकृत अनुज्ञप्ति क्र. MP/AGRI-LIC-7892/2024' : 'License: MP/AGRI-LIC-7892/2024'}</span>
            <span>·</span>
            <span>{isHindi ? 'समय: सुबह 7 बजे से रात 8 बजे तक' : 'Hours: 7 AM - 8 PM'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
