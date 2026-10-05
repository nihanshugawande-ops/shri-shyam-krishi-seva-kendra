import React from 'react';
import { Store, ShieldCheck, HeartHandshake, Award, Clock, FileText, Mail, Phone } from 'lucide-react';
import { StoreSettings, Language } from '../types';

interface AboutSectionProps {
  settings: StoreSettings;
  language: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, language }) => {
  const isHindi = language === 'hi';
  const shopName = isHindi ? settings.shopName : (settings.shopNameEn || settings.shopName);
  const ownerName = isHindi ? settings.ownerName : (settings.ownerNameEn || settings.ownerName);
  const aboutText = isHindi ? settings.aboutText : (settings.aboutTextEn || settings.aboutText);
  const hoursText = isHindi
    ? settings.businessHours || 'सुबह 07:00 बजे से रात 08:00 बजे तक (प्रतिदिन खुला)'
    : settings.businessHoursEn || '07:00 AM to 08:00 PM (Open All Days)';
  const licenseText = settings.licenseNumber || 'अधिकृत कृषि रसायन एवं बीज विक्रय अनुज्ञप्ति क्र. MP/AGRI-LIC-7892/2024';

  return (
    <section id="about" className="py-14 md:py-20 bg-gradient-to-b from-[#07131d] via-[#14231b] to-[#0b1c15] border-t border-emerald-500/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#132c20] via-[#0e241a] to-[#091b13] border border-emerald-500/40 p-8 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200 mb-6 shadow">
                <Store className="w-7 h-7 text-emerald-400" />
              </div>

              <div className="text-xs uppercase font-semibold text-emerald-400 tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHindi ? 'अधिकृत प्रतिष्ठान परिचय' : 'Authorized Enterprise Profile'}</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 font-['Rozha_One',serif]">
                {shopName}
              </h3>

              <div className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <span>{isHindi ? 'स्वामी — ' : 'Owner — '}</span>
                <span className="text-white font-bold text-base">{ownerName}</span>
                <span className="text-emerald-400 text-xs font-mono font-normal">
                  ({settings.officialPhone || '+91 81204 64749'})
                </span>
              </div>

              {/* Shop Hours badge */}
              <div className="mb-6 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{isHindi ? 'दुकान का समय' : 'Store Hours'}</div>
                  <div className="font-semibold text-white mt-0.5">{hoursText}</div>
                </div>
              </div>

              {/* Official License Feature Card */}
              <div className="mb-6 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80">
                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                      {isHindi ? 'शासकीय अनुज्ञप्ति (Shop License)' : 'Government License'}
                    </div>
                    <div className="text-xs text-zinc-300 font-medium mt-1 leading-snug">
                      {licenseText}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{isHindi ? 'कृषि विभाग द्वारा प्रमाणित एवं अधिकृत' : 'Certified & Approved by Dept of Agriculture'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {isHindi
                      ? 'लाइसेंस प्राप्त एवं अधिकृत कृषि रसायन व बीज विक्रेता'
                      : 'Licensed & Certified Agricultural Chemical Retailer'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {isHindi
                      ? 'मानक कंपनियों के प्रामाणिक कीटनाशक, फफूंदनाशक व बीज'
                      : 'Authentic Branded Insecticides, Fungicides & Seeds'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {isHindi
                      ? 'किसान भाइयों के साथ निरंतर संवाद एवं निष्पक्ष सलाह'
                      : 'Dedicated Agronomic Guidance for Farmers'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Narrative */}
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              {isHindi ? 'हमारे बारे में' : 'About Us'}
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight font-['Rozha_One',serif]">
              {isHindi
                ? 'किसानों की समृद्धि और फसल सुरक्षा के लिए समर्पित'
                : 'Dedicated to Farmer Prosperity and Comprehensive Crop Protection'}
            </h2>

            <p className="mt-5 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {aboutText}
            </p>

            <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {isHindi
                ? 'हमारा मुख्य उद्देश्य किसान भाइयों को सही समय पर सही रासायनिक एवं जैविक समाधान उपलब्ध कराना है, ताकि फसल की लागत कम हो और पैदावार में वृद्धि हो सके। हम सभी उत्पाद सीधे अधिकृत निर्माताओं एवं वितरकों से प्राप्त करते हैं।'
                : 'Our primary mission is to deliver authentic, timely crop-care inputs to minimize cultivation costs and maximize harvest yield. Every product is sourced through genuine authorized distribution channels.'}
            </p>

            {/* Core Values */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#161822] border border-zinc-800">
                <div className="text-sm font-semibold text-white mb-1">
                  {isHindi ? 'सही पहचान, सही दवाई' : 'Accurate Diagnosis, Right Input'}
                </div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  {isHindi
                    ? 'फसल की बीमारी या कीट का वास्तविक लक्षण समझकर ही उपयुक्त दवा अनुशंसित की जाती है।'
                    : 'We assess symptoms thoroughly before recommending tailored, label-compliant crop care.'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161822] border border-zinc-800">
                <div className="text-sm font-semibold text-white mb-1">
                  {isHindi ? 'सुरक्षित छिड़काव मार्गदर्शन' : 'Safe Spray Guidelines'}
                </div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  {isHindi
                    ? 'पानी की उपयुक्त मात्रा, नोजल का प्रकार और मौसम के अनुसार छिड़काव की सही सलाह।'
                    : 'We guide on proper water dilution, nozzle calibration, and weather safety considerations.'}
                </div>
              </div>
            </div>

            {/* Co-Founder & Tech Partner Card as requested */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-zinc-900 via-[#181a24] to-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-zinc-400 uppercase font-semibold tracking-wider">
                  {isHindi ? 'वेबसाइट निर्माण एवं तकनीकी सह-संस्थापक' : 'Website Development & Tech Partner'}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {settings.developerName || 'Nexa'}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <a
                    href={`mailto:${settings.developerEmail || 'nexa.com.in21@gmail.com'}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {settings.developerEmail || 'nexa.com.in21@gmail.com'}
                  </a>
                </div>
              </div>

              <a
                href={`mailto:${settings.developerEmail || 'nexa.com.in21@gmail.com'}`}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
              >
                <span>{isHindi ? 'डेवलपर से संपर्क' : 'Contact Developer'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
