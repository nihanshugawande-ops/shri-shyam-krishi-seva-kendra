import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  Compass,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { StoreSettings, Language } from '../types';
import { api } from '../services/api';

interface LocationSectionProps {
  settings: StoreSettings;
  language: Language;
  onUpdateSettings?: (newSettings: StoreSettings) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  settings,
  language,
  onUpdateSettings,
}) => {
  const isHindi = language === 'hi';
  const [distanceText, setDistanceText] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [savingLocation, setSavingLocation] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  const cleanPhone = (settings.officialPhone || '+918120464749').replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (settings.whatsapp || settings.officialPhone || '+918120464749').replace(
    /[^0-9]/g,
    ''
  );

  const shopTitle = isHindi ? settings.shopName : (settings.shopNameEn || settings.shopName);
  const ownerTitle = isHindi ? settings.ownerName : (settings.ownerNameEn || settings.ownerName);
  const hoursTitle = isHindi
    ? settings.businessHours || 'सुबह 07:00 बजे से रात 08:00 बजे तक (प्रतिदिन खुला)'
    : settings.businessHoursEn || '07:00 AM to 08:00 PM (Open All Days)';

  const shopLat = settings.latitude || 23.0215;
  const shopLng = settings.longitude || 76.7214;

  // Address assembly
  const fullAddress = [
    settings.address || 'कृषि उपज मंडी मुख्य द्वार के पास, बस स्टैंड रोड',
    settings.village && `${isHindi ? 'गांव' : 'Village'}: ${settings.village}`,
    settings.tehsil && `${isHindi ? 'तहसील' : 'Tehsil'}: ${settings.tehsil}`,
    settings.district && `${isHindi ? 'जिला' : 'Dist'}: ${settings.district}`,
    settings.state || 'मध्य प्रदेश',
    settings.pincode && `PIN: ${settings.pincode}`,
  ]
    .filter(Boolean)
    .join(', ');

  // Open directions in Google Maps
  const handleOpenDirections = () => {
    if (userCoords) {
      // Turn-by-turn route from user's current GPS to shop GPS
      const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${shopLat},${shopLng}`;
      window.open(routeUrl, '_blank');
    } else if (settings.googleMapsUrl && settings.googleMapsUrl.startsWith('http')) {
      window.open(settings.googleMapsUrl, '_blank');
    } else {
      const navUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${settings.shopName}, ${shopLat},${shopLng}`
      )}`;
      window.open(navUrl, '_blank');
    }
  };

  // Detect Real Geolocation
  const handleGetRealLocation = () => {
    if (!navigator.geolocation) {
      setLocError(
        isHindi
          ? 'आपके ब्राउज़र में GPS स्थान सेवा समर्थित नहीं है।'
          : 'GPS geolocation is not supported in this browser.'
      );
      return;
    }

    setLocating(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        setUserCoords({ lat, lng, accuracy });

        // Calculate distance using Haversine formula
        const R = 6371; // Earth radius in km
        const dLat = ((shopLat - lat) * Math.PI) / 180;
        const dLon = ((shopLng - lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat * Math.PI) / 180) *
            Math.cos((shopLat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        if (d < 1) {
          setDistanceText(
            isHindi
              ? `आपकी वर्तमान स्थिति से दूरी: लगभग ${(d * 1000).toFixed(0)} मीटर (सटीकता: ±${accuracy} मी)`
              : `Distance from your location: approx ${(d * 1000).toFixed(0)} meters (Accuracy: ±${accuracy}m)`
          );
        } else {
          setDistanceText(
            isHindi
              ? `आपकी वर्तमान स्थिति से दूरी: लगभग ${d.toFixed(1)} किमी (सटीकता: ±${accuracy} मी)`
              : `Distance from your location: approx ${d.toFixed(1)} km (Accuracy: ±${accuracy}m)`
          );
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setLocError(
            isHindi
              ? 'स्थान अनुमति अस्वीकृत (Permission Denied)। कृपया ब्राउज़र/फोन में GPS लोकेशन ऑन करें।'
              : 'Location permission denied. Please allow location access in your device settings.'
          );
        } else if (err.code === 2) {
          setLocError(
            isHindi
              ? 'GPS सिग्नल अनुपलब्ध है। कृपया डिवाइस का लोकेशन ऑन करें।'
              : 'GPS position unavailable. Please enable device GPS.'
          );
        } else {
          setLocError(
            isHindi
              ? 'स्थान प्राप्त करने में अधिक समय लगा। कृपया पुनः प्रयास करें।'
              : 'Location request timed out. Please try again.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Set detected location as official shop location
  const handleSetCurrentLocationAsShop = async () => {
    if (!userCoords) return;

    setSavingLocation(true);
    try {
      const newMapsUrl = `https://www.google.com/maps?q=${userCoords.lat},${userCoords.lng}`;
      const updated = await api.updateSettings({
        ...settings,
        latitude: userCoords.lat,
        longitude: userCoords.lng,
        googleMapsUrl: newMapsUrl,
      });

      if (onUpdateSettings) {
        onUpdateSettings(updated);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      console.error('Failed to update shop location:', e);
      alert(isHindi ? 'लोकेशन अपडेट करने में त्रुटि हुई।' : 'Failed to update shop location.');
    } finally {
      setSavingLocation(false);
    }
  };

  const handleCopyCoords = () => {
    const text = `${shopLat}, ${shopLng}`;
    navigator.clipboard?.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `नमस्ते श्री श्याम कृषि सेवा केंद्र (स्वामी: कार्तिक गावंडे जी), मुझे दुकान के पते, समय (सुबह 7 से रात 8) एवं फसल दवाइयों के बारे में जानकारी चाहिए।`
    );
    window.open(`https://wa.me/${cleanWhatsapp}?text=${text}`, '_blank');
  };

  return (
    <section id="location" className="py-14 md:py-20 bg-gradient-to-b from-[#0b1c15] via-[#092218] to-[#06140e] border-t border-lime-500/40 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 mb-3 shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHindi ? 'दुकान स्थिति, समय एवं संपर्क सूत्र' : 'Store Location, Hours & Contact'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-['Rozha_One',serif]">
            {isHindi ? 'दुकान का वास्तविक स्थान एवं संपर्क' : 'Shop Location & Contact Details'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            {isHindi
              ? 'श्री श्याम कृषि सेवा केंद्र पर पधारकर उच्च गुणवत्ता की प्रामाणिक कृषि दवाइयाँ प्राप्त करें और स्वामी कार्तिक गावंडे जी से निःशुल्क परामर्श लें।'
              : 'Visit Shree Shyam Krishi Seva Kendra for genuine crop medicines and direct agronomic guidance from Kartick Gawande.'}
          </p>
        </div>

        {/* Top Highlight Banner: Timing & License Badge */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#181a22] to-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-medium">
                {isHindi ? 'दुकान का समय (Store Hours)' : 'Operating Hours'}
              </div>
              <div className="text-sm font-bold text-white">
                {hoursTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-medium">
                {isHindi ? 'अनुज्ञप्ति (Govt License)' : 'Authorized License'}
              </div>
              <div className="text-xs font-semibold text-zinc-200">
                {settings.licenseNumber || 'अधिकृत कृषि रसायन एवं बीज विक्रय अनुज्ञप्ति क्र. MP/AGRI-LIC-7892/2024'}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Contact & Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Official Call */}
          <div className="p-6 rounded-2xl bg-[#171922] border border-zinc-800/90 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200 mb-4 shadow">
                <Phone className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {isHindi ? '📞 फोन कॉल (Official Call)' : '📞 Phone Call'}
              </h3>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                {isHindi
                  ? 'फसल दवाइयों की उपलब्धता, वर्तमान दर एवं रोग निवारण सलाह हेतु सीधे कॉल करें।'
                  : 'Contact directly for crop medicine rates, stock availability and instant advice.'}
              </p>
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 mb-2">
                <div className="text-xs text-zinc-500">{isHindi ? 'प्रतिष्ठान स्वामी' : 'Shop Owner'}</div>
                <div className="text-sm font-bold text-white mt-0.5">{ownerTitle}</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                  {settings.officialPhone || '+91 81204 64749'}
                </div>
              </div>
            </div>

            <a
              href={`tel:${cleanPhone}`}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 shadow transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{isHindi ? 'अभी कॉल करें (+91 81204 64749)' : 'Call Now (+91 81204 64749)'}</span>
            </a>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="p-6 rounded-2xl bg-[#171922] border border-zinc-800/90 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200 mb-4 shadow">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {isHindi ? '💬 व्हाट्सएप (WhatsApp)' : '💬 WhatsApp Chat'}
              </h3>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                {isHindi
                  ? 'रोग प्रभावित पौधे अथवा कीट की स्पष्ट फोटो भेजें और तत्काल सही दवाई का परामर्श पाएं।'
                  : 'Send photo of diseased leaf or crop for diagnosis and instant medicine recommendation.'}
              </p>
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 mb-2">
                <div className="text-xs text-zinc-500">{isHindi ? 'व्हाट्सएप हेल्पलाइन' : 'WhatsApp Helpline'}</div>
                <div className="text-lg font-bold text-white font-mono mt-1">
                  {settings.whatsapp || settings.officialPhone || '+91 81204 64749'}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{isHindi ? 'सक्रिय समय: सुबह 7 बजे से रात 8 बजे तक' : 'Active 7:00 AM to 8:00 PM'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleWhatsAppChat}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isHindi ? 'व्हाट्सएप पर बात करें' : 'Chat on WhatsApp'}</span>
            </button>
          </div>

          {/* Card 3: Interactive Location & Live GPS */}
          <div className="p-6 rounded-2xl bg-[#171922] border border-zinc-800/90 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-200 mb-4 shadow">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {isHindi ? '📍 दुकान का स्थान (Address)' : '📍 Shop Location'}
              </h3>
              <div className="text-sm font-semibold text-zinc-200">{shopTitle}</div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {fullAddress}
              </p>

              {/* Coordinates display with quick copy */}
              <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400">
                <span className="font-mono">
                  GPS: {shopLat.toFixed(4)}°N, {shopLng.toFixed(4)}°E
                </span>
                <button
                  onClick={handleCopyCoords}
                  className="flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                  title="निर्देशांक कॉपी करें"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCoords ? 'कॉपी हुआ' : 'Copy'}</span>
                </button>
              </div>

              {/* Live Distance text if calculated */}
              {distanceText && (
                <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/60 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{distanceText}</span>
                </div>
              )}

              {/* Error message if geolocation failed */}
              {locError && (
                <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/60 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{locError}</span>
                </div>
              )}

              {/* Success notification if user saved their location as shop location */}
              {saveSuccess && (
                <div className="mt-2 text-[11px] text-emerald-200 bg-emerald-900/50 p-2 rounded-lg border border-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {isHindi
                      ? '✓ दुकान की लोकेशन आपकी वर्तमान स्थिति पर सफलतापूर्वक सेट हो गई है!'
                      : '✓ Shop location successfully updated to your current GPS position!'}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              {/* Primary Directions Button */}
              <button
                onClick={handleOpenDirections}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all shadow cursor-pointer active:scale-95"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>
                  {userCoords
                    ? isHindi
                      ? 'मेरी लोकेशन से दुकान तक का रास्ता देखें (Google Maps)'
                      : 'Navigate from My Location to Shop (Google Maps)'
                    : isHindi
                    ? 'Google Maps में रास्ता देखें (Directions)'
                    : 'Get Directions in Google Maps'}
                </span>
              </button>

              {/* Get Real Location Button */}
              <button
                onClick={handleGetRealLocation}
                disabled={locating}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
              >
                {locating ? (
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                ) : (
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>
                  {locating
                    ? isHindi
                      ? 'वर्तमान GPS लोकेशन प्राप्त हो रही है...'
                      : 'Detecting GPS location...'
                    : isHindi
                    ? '📍 मेरी वर्तमान लोकेशन प्राप्त करें (Detect My Location)'
                    : '📍 Detect My Current GPS Location'}
                </span>
              </button>

              {/* Set Current Location as Shop Location (As requested by user: "जो अभी लोकेशन मेरी दिखा रही है वही लोकेशन एड करना है") */}
              {userCoords && (
                <button
                  onClick={handleSetCurrentLocationAsShop}
                  disabled={savingLocation}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-800/80 rounded-xl transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {savingLocation
                      ? isHindi
                        ? 'दुकान का पता अपडेट हो रहा है...'
                        : 'Saving location...'
                      : isHindi
                      ? '📍 इस लोकेशन को दुकान का पता सेट करें (Set as Shop Location)'
                      : '📍 Save this as Official Shop Location'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Interactive Map Pin Preview Card */}
        <div className="mt-8 rounded-2xl bg-[#171922] border border-zinc-800/90 overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-[#13151c]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-white">
                {isHindi ? 'दुकान का लाइव मानचित्र (Interactive Map Preview)' : 'Interactive Shop Map View'}
              </span>
              <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                ({shopLat.toFixed(4)}, {shopLng.toFixed(4)})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenDirections}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
              >
                <span>Google Maps ऐप में खोलें</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Embedded Google Maps / OpenStreetMap Visualizer */}
          <div className="relative w-full h-64 sm:h-80 bg-zinc-950">
            <iframe
              title="Shree Shyam Krishi Seva Kendra Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${shopLng - 0.015}%2C${shopLat - 0.01}%2C${shopLng + 0.015}%2C${shopLat + 0.01}&layer=mapnik&marker=${shopLat}%2C${shopLng}`}
            />
            {/* Center Map Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <div className="px-3 py-1 bg-zinc-900/95 border border-emerald-500/80 rounded-full shadow-2xl text-[11px] font-bold text-white mb-1 flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{shopTitle}</span>
              </div>
              <div className="w-4 h-4 bg-emerald-500 rotate-45 border-2 border-white shadow-lg" />
            </div>
          </div>

          {/* Map Footer Bar with Location Details */}
          <div className="p-4 bg-[#14161e] border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{fullAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{hoursTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
